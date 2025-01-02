import React from 'react';

interface ApprovalStatusBadgeProps {
  status: string;
}

export const ApprovalStatusBadge: React.FC<ApprovalStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft':
        return { label: '下書き', className: 'bg-gray-100 text-gray-800' };
      case 'pending':
        return { label: '承認待ち', className: 'bg-yellow-100 text-yellow-800' };
      case 'approved':
        return { label: '承認済み', className: 'bg-green-100 text-green-800' };
      case 'rejected':
        return { label: '却下', className: 'bg-red-100 text-red-800' };
      default:
        return { label: status, className: 'bg-gray-100 text-gray-800' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${config.className}
    `}>
      {config.label}
    </span>
  );
};