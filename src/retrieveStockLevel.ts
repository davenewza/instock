export async function retrieveStockLevel(
  warehouseCode: string,
  productSku: string,
  apiSecret: string,
): Promise<number> {
  const url =
    "https://seller-api.takealot.com/v2/offers/offer?identifier=SKU" +
    productSku;

  const response = await fetch(url, {
    headers: [["Authorization", "Key " + apiSecret]],
  });
  if (!response.ok) {
    throw new Error(
      "unexpected response from Takealot API: " + response.status,
    );
  }

  const json = await response.json();

  return json.stock_at_takealot.find((e) => {
    return e.warehouse.name == warehouseCode;
  }).quantity_available;
}
