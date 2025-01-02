import { supabase } from './client';

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
  gross_profit: number;
  sort_order: number;
}

export const quotationsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('quotations')
      .select(`
        *,
        project:projects(name)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getByProject: async (projectId: string) => {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('quotations')
      .select(`
        *,
        project:projects(name)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  getItems: async (quotationId: string) => {
    const { data, error } = await supabase
      .from('quotation_items')
      .select('*')
      .eq('quotation_id', quotationId)
      .order('sort_order');
    if (error) throw error;
    return data;
  },

  create: async (
    quotation: Omit<Quotation, 'id' | 'created_at' | 'created_by'>,
    items: Omit<QuotationItem, 'id' | 'quotation_id'>[]
  ) => {
    const { data: newQuotation, error: quotationError } = await supabase
      .from('quotations')
      .insert(quotation)
      .select()
      .single();

    if (quotationError) throw quotationError;

    if (items.length > 0) {
      const { error: itemsError } = await supabase
        .from('quotation_items')
        .insert(
          items.map(item => ({
            ...item,
            quotation_id: newQuotation.id
          }))
        );

      if (itemsError) throw itemsError;
    }

    return newQuotation;
  },

  generateQuotationNumber: async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Get count of quotations for this month
    const { count, error } = await supabase
      .from('quotations')
      .select('id', { count: 'exact' })
      .gte('created_at', `${year}-${month}-01`)
      .lt('created_at', `${year}-${String(Number(month) + 1).padStart(2, '0')}-01`);

    if (error) throw error;

    // Generate sequential number
    const sequence = String(Number(count || 0) + 1).padStart(3, '0');
    return `Q${year}${month}${sequence}`;
  }
};