import React from 'react';
import type { QuotationItem } from '../../../api/quotations';

interface QuotationItemsProps {
  items: QuotationItem[];
}

export const QuotationItems: React.FC<QuotationItemsProps> = ({ items }) => (
  <div className="bg-white shadow rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">見積明細</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">内容</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">数量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">仕入単価</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">仕入金額</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">販売単価</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">販売金額</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">粗利</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.quantity}</td>
                <td className="px-6 py-4 text-sm text-gray-900">¥{item.cost_price.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900">¥{(item.quantity * item.cost_price).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900">¥{item.unit_price.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900">¥{item.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900">¥{item.gross_profit.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={5} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">合計</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                ¥{items.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                ¥{items.reduce((sum, item) => sum + item.gross_profit, 0).toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
);