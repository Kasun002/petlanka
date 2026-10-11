import type { RecentApplication } from '../../types/dashboard';
import StatusBadge from '../ui/StatusBadge';

interface Props {
  applications: RecentApplication[];
}

export default function ApplicationsTable({ applications }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5">
      <div className="flex items-center justify-between px-5 py-[18px] border-b border-black/[0.06]">
        <h2 className="text-[15px] font-bold">Recent applications</h2>
        <button className="text-[12.5px] text-primary font-semibold">View all →</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="text-left text-[11.5px] font-semibold text-muted border-b border-black/[0.06]">
              <th className="px-5 py-3 font-semibold">Applicant</th>
              <th className="px-4 py-3 font-semibold">Pet</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">District</th>
              <th className="px-4 py-3 font-semibold">Submitted</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {applications.map((app, i) => (
              <tr
                key={app.id}
                className={`${i < applications.length - 1 ? 'border-b border-black/[0.04]' : ''} hover:bg-surface/50 transition-colors`}
              >
                <td className="px-5 py-3.5 font-semibold text-gray-900">{app.applicant}</td>
                <td className="px-4 py-3.5 text-gray-700">{app.pet}</td>
                <td className="px-4 py-3.5 text-gray-600">{app.type}</td>
                <td className="px-4 py-3.5 text-gray-600">{app.district}</td>
                <td className="px-4 py-3.5 text-gray-500">{app.submitted}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-4 py-3.5">
                  <button className="text-[12.5px] text-primary font-semibold hover:underline">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
