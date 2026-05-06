import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, BarChart3, Zap, Users, Settings, Home } from 'lucide-react';
import clsx from 'clsx';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/campaigns', label: 'Campaigns', icon: Zap },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/clients', label: 'Clients', icon: Users },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={clsx(
        'bg-white shadow-lg transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20'
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className={clsx(
            'font-bold text-xl transition-all duration-300',
            sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
          )}>
            AdManager
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors',
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Icon size={20} />
                <span className={clsx(
                  'transition-all duration-300',
                  sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {navItems.find(item => isActive(item.path))?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Campaign
              </button>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                OB
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
