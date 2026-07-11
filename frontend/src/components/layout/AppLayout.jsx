import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Navbar from './Navbar/Navbar';
import { useState } from 'react';

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <div className={`app-layout__main${sidebarCollapsed ? ' app-layout__main--collapsed' : ''}`}>
        <Navbar />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
