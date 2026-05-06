import React from 'react';

function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input type="text" defaultValue="Olivier Bruno" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" defaultValue="olivier@minexai.ca" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <input type="text" placeholder="Your Company Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Save Changes</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Platform Integrations</h3>
        <div className="space-y-3">
          {['Facebook Ads', 'Google Ads', 'LinkedIn Ads'].map((platform) => (
            <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-700">{platform}</span>
              <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Connect</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings;
