import { StockTracker, models } from "@teamkeel/sdk";
import { retrieveStockLevel } from "../src/retrieveStockLevel";

// To learn more about jobs, visit https://docs.keel.so/jobs
export default StockTracker(async (ctx) => {
  const products = await models.product.findMany();
  const warehouses = await models.warehouse.findMany();

  for (const p of products) {
    for (const w of warehouses) {
      const available = await retrieveStockLevel(
        w.code,
        p.sku,
        ctx.secrets.TAKEALOT_API_KEY,
      );

      let row = await models.stockLevels
        .where({
          date: new Date(),
          warehouseId: w.id,
          productId: p.id,
        })
        .findOne();

      if (row) {
        if (row.available > available) {
          row = await models.stockLevels.update(
            { id: row.id },
            { available: available },
          );
        }
      } else {
        row = await models.stockLevels.create({
          date: new Date(),
          productId: p.id,
          warehouseId: w.id,
          available: available,
        });
      }
    }
  }
});
