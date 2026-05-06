import React from 'react';
import { TrendingUp, Users, Zap, BarChart3 } from 'lucide-react';

function Dashboard() {
  const stats = [
    { label: 'Active Campaigns', value: '12', icon: Zap, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Clients', value: '8', icon: Users, color: 'bg-green-100 text-green-600' },
    { label: 'This Month Spend', value: '$4,250', icon: BarChart3, color: 'bg-purple-100 text-purple-600' },
    { label: 'Avg ROI', value: '2.8x', icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Campaigns</h3>
          <div className="space-y-3">
            {['Summer Promo', 'Product Launch', 'Brand Awareness'].map((campaign) => (
              <div key={campaign} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">{campaign}</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Total Impressions</span>
              <span className="font-semibold">1.2M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Total Clicks</span>
              <span className="font-semibold">45K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Total Conversions</span>
              <span className="font-semibold">3.2K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Total Spend</span>
              <span className="font-semibold">$12,450</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
