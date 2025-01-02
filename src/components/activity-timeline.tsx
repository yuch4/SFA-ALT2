// ActivityTimelineコンポーネントのActivity型を更新
interface Activity {
  id: string;
  type: string;
  title: string;
  description: string | null;
  created_at: string;
  created_by_email?: string;
}

// ... 残りのコンポーネントコード内で、created_by_user?.emailをcreated_by_emailに変更
export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id}>
            {/* ... 他のコード ... */}
            <div className="text-sm">
              <span className="font-medium text-gray-900">
                {activity.created_by_email}
              </span>
            </div>
            {/* ... 残りのコード ... */}
          </li>
        ))}
      </ul>
    </div>
  );
};