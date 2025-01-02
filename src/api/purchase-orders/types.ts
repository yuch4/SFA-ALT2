export interface PurchaseOrder {
  id: string;
  supplier_id: string;
  quotation_id: string | null;
  purchase_order_number: string;
  issue_date: string;
  delivery_date: string | null;
  status: string;
  notes: string | null;
  total_amount: number;
  created_at: string;
  created_by: string;
  supplier?: {
    name: string;
  };
  quotation?: {
    quotation_number: string;
  };
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  quotation_item_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  sort_order: number;
}

export interface PurchaseOrderCreateInput {
  supplier_id: string;
  quotation_id?: string;
  issue_date: string;
  delivery_date?: string;
  notes?: string;
  items: Omit<PurchaseOrderItem, 'id' | 'purchase_order_id'>[];
}

export interface PurchaseOrderUpdateInput {
  issue_date: string;
  delivery_date?: string;
  notes?: string;
  items: Omit<PurchaseOrderItem, 'id' | 'purchase_order_id'>[];
}