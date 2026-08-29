import React from 'react';
import {
  LayoutDashboard,
  Database,
  Cpu,
  GanttChartSquare,
  CalendarDays,
  FileCheck2,
  BarChart3,
  Truck,
  Download,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'feeds'
  | 'optimizer'
  | 'corridor'
  | 'schedules'
  | 'sanctions'
  | 'machines'
  | 'analytics';

interface NavigationBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingSanctionsCount: number;
  unassignedDemandsCount: number;
  onExportAllData?: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  activeTab,
  onTabChange,
  pendingSanctionsCount,
  unassignedDemandsCount,
  onExportAllData,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Command Dashboard',
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
    },
    {
      id: 'feeds',
      label: 'Data Feeds (TMS/SMMS/TDMS)',
      icon: <Database className="w-3.5 h-3.5" />,
      badge: unassignedDemandsCount > 0 ? unassignedDemandsCount : undefined,
    },
    {
      id: 'optimizer',
      label: 'Block Planning Engine',
      icon: <Cpu className="w-3.5 h-3.5" />,
    },
    {
      id: 'corridor',
      label: 'Corridor & Gantt View',
      icon: <GanttChartSquare className="w-3.5 h-3.5" />,
    },
    {
      id: 'schedules',
      label: 'Multi-Horizon Programs',
      icon: <CalendarDays className="w-3.5 h-3.5" />,
    },
    {
      id: 'sanctions',
      label: 'Joint Sanctions & Circulars',
      icon: <FileCheck2 className="w-3.5 h-3.5" />,
      badge: pendingSanctionsCount > 0 ? pendingSanctionsCount : undefined,
    },
    {
      id: 'machines',
      label: 'Track Machine Roster',
      icon: <Truck className="w-3.5 h-3.5" />,
    },
    {
      id: 'analytics',
      label: 'Uptime & KPIs',
      icon: <BarChart3 className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <nav className="bg-[#0D1E32] text-slate-300 border-b border-slate-700/80 shadow-xs no-print sticky top-0 z-30">
      <div className="px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center overflow-x-auto no-scrollbar space-x-1 py-1 flex-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="text-[10px] text-slate-900 bg-amber-400 font-bold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Export Data Button */}
        {onExportAllData && (
          <button
            onClick={onExportAllData}
            title="Download Master CSV Ledger"
            className="hidden md:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-medium px-3 py-1.5 rounded transition cursor-pointer flex-shrink-0 ml-2"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
        )}
      </div>
    </nav>
  );
};
