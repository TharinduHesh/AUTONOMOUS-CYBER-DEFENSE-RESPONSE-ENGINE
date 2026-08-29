import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Radar,
  GitBranch,
  BookOpen,
  Shield,
  ClipboardCheck,
} from 'lucide-react'
import PrototypeBanner from './PrototypeBanner'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/threat-simulation', label: 'Threat Simulation', icon: Radar },
  { to: '/architecture', label: 'System Workflow', icon: GitBranch },
  { to: '/research', label: 'My Contribution', icon: BookOpen },
  { to: '/evaluation', label: 'Evaluation', icon: ClipboardCheck },
]

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[#0a0e17]">
      <aside className="w-64 shrink-0 border-r border-gray-800 bg-[#0d1321] flex flex-col">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2 text-cyan-400">
            <Shield className="w-7 h-7" />
            <span className="font-bold text-sm leading-tight">ACDRE</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 leading-snug">
            Autonomous Cyber Defense & Response Engine
          </p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 text-[10px] text-gray-600">
          Research Prototype v0.1
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <PrototypeBanner />
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
