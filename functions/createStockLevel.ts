import { CreateStockLevel, CreateStockLevelHooks, models } from '@teamkeel/sdk';
import lo from 'lodash';

// To learn more about what you can do with hooks, visit https://docs.keel.so/functions
const hooks : CreateStockLevelHooks = {
    async beforeWrite(ctx, inputs, values) {

        const product = await models.product.findOne({ sku: inputs.product.sku });
        if (product == null) {
            throw new Error("product not found: " + inputs.product.sku);
        }

        const warehouse = await models.warehouse.findOne({ code: inputs.warehouse.code });
        if (product == null) {
            throw new Error("warehouse not found: " +  inputs.warehouse.code);
        }

        const url = "https://seller-api.takealot.com/v2/offers/offer?identifier=SKU" + product.sku;
        
        
        const response = await fetch(url, {headers: [["Authorization", "Key " + ctx.secrets.TAKEALOT_API_KEY]]});
        if (!response.ok) {
            throw new Error("unexpected response from Takealot API: " + response.status)
        }

        const json = await response.json();

        const stock = json.stock_at_takealot.find((e) => {
            return e.warehouse.name == warehouse!.code
        }).quantity_available;

        return {
            productId: product!.id,
            warehouseId: warehouse!.id,
            available: stock,
            date: new Date(),
        };
    },
};

export default CreateStockLevel(hooks);
	