import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart,
  Table,
  Split,
  DollarSign,
  X,
} from 'lucide-react';

const navItems = [
  { name: 'TotalValuation', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Holdings', path: '/holdings', icon: <BarChart size={20} /> },
  { name: 'Trades', path: '/trades', icon: <Table size={20} /> },
  { name: 'Splits', path: '/splits', icon: <Split size={20} /> },
  { name: 'Currency Rates', path: '/currency-rates', icon: <DollarSign size={20} /> },
];

export default function Sidebar({ closeSidebar }) {
  return (
    <div className="h-full flex flex-col p-6 bg-black text-white shadow-lg">
      {/* Mobile close button */}
      <div className="flex justify-between items-center mb-6 md:hidden">
        <h2 className="text-lg font-bold">Menu</h2>
        <button onClick={closeSidebar}>
          <X />
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-8 hidden md:block">Portfolio</h2>
      <nav className="flex flex-col gap-4">
        {navItems.map(({ name, path, icon }) => (
          <NavLink
            to={path}
            key={name}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-white text-black font-semibold'
                  : 'hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {icon}
            {name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
