import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bell,
  TriangleAlert,
  BarChart3,
  HardHat,
  Map,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from 'lucide-react';

const navSections = [
  {
    label: 'Main',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/alerts', label: 'Alerts', icon: Bell },
      { to: '/emergencies', label: 'Emergencies', icon: TriangleAlert },
    ],
  },
  {
    label: 'Monitoring',
    items: [
      { to: '/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/helmet/:id', label: 'Helmets', icon: HardHat, disabled: true },
      { to: '/maps', label: 'Maps', icon: Map, disabled: true },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/settings', label: 'Settings', icon: Settings, disabled: true },
    ],
  },
];

function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">K</div>
          {!collapsed && <span className="sidebar__logo-text">KAVACH</span>}
        </div>
        {!collapsed && (
          <button className="sidebar__collapse-btn" onClick={onToggle} type="button" aria-label="Collapse sidebar">
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed && <div className="sidebar__section-label">{section.label}</div>}
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `sidebar__link${isActive ? ' sidebar__link--active' : ''}${item.disabled ? ' sidebar__link--disabled' : ''}`
                  }
                  onClick={(e) => item.disabled && e.preventDefault()}
                  tabIndex={item.disabled ? -1 : 0}
                  aria-disabled={item.disabled}
                  aria-label={collapsed ? item.label : undefined}
                >
                  <span className="sidebar__link-icon">
                    <Icon size={18} />
                  </span>
                  {!collapsed && <span className="sidebar__link-label">{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__user-avatar">
              <User size={16} />
            </div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">Site Admin</div>
              <div className="sidebar__user-role">Mine Operator</div>
            </div>
            <LogOut size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          </div>
        </div>
      )}

      {collapsed && (
        <div className="sidebar__footer" style={{ padding: '8px' }}>
          <button
            className="sidebar__collapse-btn"
            onClick={onToggle}
            type="button"
            aria-label="Expand sidebar"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </aside>
  );
}

export default memo(Sidebar);
