export const calculateAmount = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

export const calculateGrossProfit = (
  quantity: number, 
  unitPrice: number, 
  costPrice: number
): number => {
  const amount = calculateAmount(quantity, unitPrice);
  return amount - (quantity * costPrice);
};

export const calculateTotalAmount = (items: any[]): number => {
  return items.reduce((sum, item) => sum + item.amount, 0);
};

export const calculateTotalGrossProfit = (items: any[]): number => {
  return items.reduce((sum, item) => sum + item.gross_profit, 0);
};