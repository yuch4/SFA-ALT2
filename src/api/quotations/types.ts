export interface Quotation {
  id: string;
  project_id: string;
  quotation_number: string;
  issue_date: string;
  valid_until: string;
  total_amount: number;
  status: string;
  notes: string | null;
  created_at: string;
  created_by: string;
  project?: {
    name: string;
  };
}

export interface QuotationItem {
  id: string;
  quotation_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  supplier_id: string | null;
  cost_price: number;
  sort_order: number;
}

export interface QuotationUpdateInput {
  issue_date: string;
  valid_until: string;
  notes?: string | null;
  items: Omit<QuotationItem, 'id' | 'quotation_id' | 'gross_profit'>[];
}