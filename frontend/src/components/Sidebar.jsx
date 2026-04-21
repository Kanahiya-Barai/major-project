import { NavLink } from 'react-router-dom'

const Sidebar = ({ items }) => {
  return (
    <aside className="w-64 bg-surface border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto hidden md:block">
      <nav className="p-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar