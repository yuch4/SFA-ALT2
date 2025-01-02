import React from 'react';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../../components/button';
import type { Quotation } from '../../../api/quotations';

interface QuotationHeaderProps {
  quotation: Quotation;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

export const QuotationHeader: React.FC<QuotationHeaderProps> = ({
  quotation,
  onEdit,
  onDelete,
  onBack
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <Button
        variant="secondary"
        onClick={onBack}
        icon={<ArrowLeft className="w-4 h-4" />}
      >
        戻る
      </Button>
      <h1 className="text-2xl font-semibold text-gray-900">
        {quotation.quotation_number}
      </h1>
    </div>
    <div className="flex space-x-2">
      <Button
        variant="secondary"
        onClick={onEdit}
        icon={<Edit2 className="w-4 h-4" />}
      >
        編集
      </Button>
      <Button
        variant="danger"
        onClick={onDelete}
        icon={<Trash2 className="w-4 h-4" />}
      >
        削除
      </Button>
    </div>
  </div>
);