import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';

function Campaigns() {
  const [campaigns] = useState([
    { id: 1, name: 'Summer Promo', platform: 'Facebook', budget: 2000, status: 'Active', roi: '2.5x' },
    { id: 2, name: 'Product Launch', platform: 'Google', budget: 1500, status: 'Active', roi: '3.2x' },
    { id: 3, name: 'Brand Awareness', platform: 'LinkedIn', budget: 1000, status: 'Paused', roi: '1.8x' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
            <option>All Platforms</option>
            <option>Facebook</option>
            <option>Google</option>
            <option>LinkedIn</option>
          </select>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Campaign Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Platform</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Budget</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ROI</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{campaign.name}</td>
                <td className="px-6 py-4 text-gray-700">{campaign.platform}</td>
                <td className="px-6 py-4 text-gray-700">${campaign.budget}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{campaign.roi}</td>
                <td className="px-6 py-4 flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Eye size={18} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Edit2 size={18} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Campaigns;
