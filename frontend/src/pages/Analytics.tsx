import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Analytics() {
  const chartData = [
    { date: 'Jan', impressions: 4000, clicks: 2400, conversions: 240 },
    { date: 'Feb', impressions: 3000, clicks: 1398, conversions: 221 },
    { date: 'Mar', impressions: 2000, clicks: 9800, conversions: 229 },
    { date: 'Apr', impressions: 2780, clicks: 3908, conversions: 200 },
    { date: 'May', impressions: 1890, clicks: 4800, conversions: 221 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impressions vs Clicks */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Impressions vs Clicks</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="impressions" fill="#3B82F6" />
              <Bar dataKey="clicks" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Conversion Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="conversions" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Platform Performance</h3>
        <div className="space-y-4">
          {[
            { platform: 'Facebook', impressions: '450K', clicks: '18K', roi: '2.8x' },
            { platform: 'Google Ads', impressions: '320K', clicks: '14K', roi: '3.1x' },
            { platform: 'LinkedIn', impressions: '180K', clicks: '8K', roi: '2.2x' },
          ].map((data) => (
            <div key={data.platform} className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded">
              <div>
                <p className="text-sm text-gray-600">Platform</p>
                <p className="font-semibold">{data.platform}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Impressions</p>
                <p className="font-semibold">{data.impressions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Clicks</p>
                <p className="font-semibold">{data.clicks}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ROI</p>
                <p className="font-semibold">{data.roi}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
