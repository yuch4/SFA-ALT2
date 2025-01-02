import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

export const formatDate = (date: string | null) => {
  if (!date) return '-';
  return format(parseISO(date), 'yyyy年M月d日', { locale: ja });
};