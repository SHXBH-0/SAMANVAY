import React from 'react';
import { ShieldCheck, Server, Award, ExternalLink } from 'lucide-react';

export const GovFooter: React.FC = () => {
  return (
    <footer className="bg-[#0B1E36] text-slate-400 text-xs border-t border-slate-700 mt-12 no-print">
      {/* Upper Footer Links */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <div className="flex items-center space-x-2 text-white font-bold text-sm mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>SAMANVAY (समन्वय)</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            National Automatic Block Planning & Corridor Optimization System for the Ministry of Railways, Government of India.
          </p>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-amber-400 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700 w-fit">
            <span>Version: 3.4.2-PROD</span>
            <span>•</span>
            <span>CRIS Hosted</span>
          </div>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold text-xs mb-2 uppercase tracking-wider">
            Connected Systems
          </h4>
          <ul className="space-y-1 text-[11px]">
            <li className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              TMS - Track Management System
            </li>
            <li className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              SMMS - Signalling Maintenance System
            </li>
            <li className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              TDMS - Traction Distribution Management
            </li>
            <li className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
              COA - Control Office Application (Timetable)
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold text-xs mb-2 uppercase tracking-wider">
            Compliance & Rules
          </h4>
          <ul className="space-y-1 text-[11px]">
            <li>Indian Railways General Rules (GR 15.06 & 15.09)</li>
            <li>Operating Manual Chapter VII: Block Disconnections</li>
            <li>GIGW 3.0 (Guidelines for Indian Govt Websites)</li>
            <li>Integrated Track Machine Manual (ITMM 2024)</li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold text-xs mb-2 uppercase tracking-wider">
            National Support
          </h4>
          <p className="text-[11px] leading-relaxed">
            Central Railway Control Office Helpdesk:
          </p>
          <p className="font-mono text-amber-400 text-xs mt-1">Railway Rly CUG: 030-22441</p>
          <p className="text-[11px] mt-1">Email: abps-support@cris.org.in</p>
          <div className="mt-2 text-[10px] text-slate-500">
            Rail Bhavan, Raisina Road, New Delhi 110001
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Disclaimer */}
      <div className="bg-[#07162C] py-3 px-4 text-center text-[11px] border-t border-slate-800 text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Centre for Railway Information Systems (CRIS) | Ministry of Railways, Govt. of India. All Rights Reserved.</span>
          <span className="text-slate-400">Designed for Secure Official Intranet Operations</span>
        </div>
      </div>
    </footer>
  );
};
