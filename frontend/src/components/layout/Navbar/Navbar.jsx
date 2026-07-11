import { memo } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useSocket } from '../../../hooks/useSocket';
import ThemeToggle from '../../common/ThemeToggle';

function Navbar() {
  const { isConnected } = useSocket();

  return (
    <header className="navbar">
      <div className="navbar__left">
        <h1 className="navbar__page-title">
          Mining Helmet Monitor
          <span className="navbar__page-subtitle"> / KAVACH</span>
        </h1>
      </div>
      <div className="navbar__right">
        <div className="navbar__search">
          <Search className="navbar__search-icon" size={16} />
          <input
            className="navbar__search-input"
            type="search"
            placeholder="Search helmets, workers..."
            aria-label="Search"
          />
        </div>

        <div className="navbar__connection">
          <span className={`navbar__connection-dot${!isConnected ? ' navbar__connection-dot--disconnected' : ''}`} />
          {isConnected ? 'Live' : 'Offline'}
        </div>

        <div className="navbar__divider" />

        <ThemeToggle />

        <button className="navbar__icon-btn" type="button" aria-label="Notifications">
          <Bell size={18} />
          <span className="navbar__badge" />
        </button>

        <div className="navbar__profile" role="button" tabIndex={0} aria-label="User profile">
          <div className="navbar__profile-avatar">
            <User size={16} />
          </div>
          <span className="navbar__profile-name">Admin</span>
        </div>
      </div>
    </header>
  );
}

export default memo(Navbar);
