import { CreateStockLevel, CreateStockLevelHooks, models } from "@teamkeel/sdk";
import { retrieveStockLevel } from "../src/retrieveStockLevel";

// To learn more about what you can do with hooks, visit https://docs.keel.so/functions
const hooks: CreateStockLevelHooks = {
  async beforeWrite(ctx, inputs, values) {
    const product = await models.product.findOne({ sku: inputs.product.sku });
    if (product == null) {
      throw new Error("product not found: " + inputs.product.sku);
    }

    const warehouse = await models.warehouse.findOne({
      code: inputs.warehouse.code,
    });
    if (product == null) {
      throw new Error("warehouse not found: " + inputs.warehouse.code);
    }

    const stock = await retrieveStockLevel(
      inputs.warehouse.code,
      inputs.product.sku,
      ctx.secrets.TAKEALOT_API_KEY,
    );

    return {
      productId: product!.id,
      warehouseId: warehouse!.id,
      available: stock,
      date: new Date(),
    };
  },
};

export default CreateStockLevel(hooks);
