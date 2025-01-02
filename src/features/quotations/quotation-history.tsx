import React from 'react';
import { Clock } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { useData } from '../../hooks/useData';
import { quotationsApi } from '../../api/quotations';

interface QuotationHistoryProps {
  quotationId: string;
}

const ACTION_LABELS = {
  create: '作成',
  update: '更新',
  delete: '削除'
};

export const QuotationHistory: React.FC<QuotationHistoryProps> = ({ quotationId }) => {
  const { data: history, loading } = useData({
    fetchFn: () => quotationsApi.getHistory(quotationId),
    dependencies: [quotationId]
  });

  if (loading) return <div>読み込み中...</div>;

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {history?.map((entry, entryIdx) => (
          <li key={entry.id}>
            <div className="relative pb-8">
              {entryIdx !== history.length - 1 ? (
                <span
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
                    <Clock className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">
                        {entry.created_by_email}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {formatDate(entry.created_at)}
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>
                      見積書を{ACTION_LABELS[entry.action as keyof typeof ACTION_LABELS]}しました
                    </p>
                    {entry.action === 'update' && entry.changes.old && entry.changes.new && (
                      <div className="mt-2 text-sm">
                        <p className="font-medium">変更内容:</p>
                        <ul className="mt-1 list-disc list-inside">
                          {Object.keys(entry.changes.new).map(key => {
                            const oldValue = entry.changes.old[key];
                            const newValue = entry.changes.new[key];
                            if (oldValue !== newValue) {
                              return (
                                <li key={key}>
                                  {key}: {oldValue} → {newValue}
                                </li>
                              );
                            }
                            return null;
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};