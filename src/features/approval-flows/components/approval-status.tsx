
import React from 'react';
import { useData } from '../../../hooks/useData';
import { approvalFlowsApi } from '../../../api/approval-flows';
import { formatDate } from '../../../utils/date';

interface ApprovalStatusProps {
  targetType: 'quotation' | 'purchase_order';
  targetId: string;
}

export const ApprovalStatus: React.FC<ApprovalStatusProps> = ({
  targetType,
  targetId
}) => {
  const { data: histories, loading } = useData({
    fetchFn: () => approvalFlowsApi.getHistories(targetType, targetId),
    dependencies: [targetType, targetId]
  });

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!histories?.length) {
    return <div>承認履歴がありません</div>;
  }

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {histories.map((history, historyIdx) => (
          <li key={history.id}>
            <div className="relative pb-8">
              {historyIdx !== histories.length - 1 ? (
                <span
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div>
                  <div className={`
                    relative px-1
                    ${history.action === 'approve' ? 'text-green-500' : 'text-red-500'}
                  `}>
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                      {history.action === 'approve' ? '✓' : '×'}
                    </div>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">
                        {history.created_by_user?.email}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {formatDate(history.created_at)}
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>
                      ステップ {history.step} を
                      {history.action === 'approve' ? '承認' : '却下'}
                      しました
                    </p>
                    {history.comment && (
                      <p className="mt-1 text-gray-500">{history.comment}</p>
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