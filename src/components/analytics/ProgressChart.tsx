interface ProgressChartProps {
  title: string;
  data: {
    date: string;
    completed: number;
    due: number;
  }[];
}

export const ProgressChart = ({ title, data }: ProgressChartProps) => {
  const maxValue = Math.max(...data.map((item) => Math.max(item.completed, item.due)), 1);
  const pointsCompleted = data
    .map((item, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100;
      const y = 100 - (item.completed / maxValue) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const pointsDue = data
    .map((item, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100;
      const y = 100 - (item.due / maxValue) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Completed
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            Due
          </span>
        </div>
      </div>
      <div className="mt-4 h-52 w-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <polyline fill="none" stroke="#CBD5F5" strokeWidth="0.4" points="0,100 100,100" />
          <polyline fill="none" stroke="#BCCCDC" strokeWidth="0.4" points="0,75 100,75" />
          <polyline fill="none" stroke="#94A3B8" strokeWidth="0.4" points="0,50 100,50" />
          <polyline fill="none" stroke="#64748B" strokeWidth="0.4" points="0,25 100,25" />
          <polyline fill="none" stroke="#CBD5F5" strokeWidth="0.4" points="0,0 100,0" />
          <polyline fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" points={pointsDue} />
          <polyline fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" points={pointsCompleted} />
        </svg>
      </div>
    </section>
  );
};

