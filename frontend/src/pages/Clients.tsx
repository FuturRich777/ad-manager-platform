import React, { useState } from 'react';
import { Plus, Mail, Phone, Edit2, Trash2 } from 'lucide-react';

function Clients() {
  const [clients] = useState([
    { id: 1, name: 'Acme Corp', email: 'contact@acme.com', phone: '+1234567890', campaigns: 5 },
    { id: 2, name: 'Tech Startup', email: 'hello@techstartup.com', phone: '+0987654321', campaigns: 3 },
    { id: 3, name: 'Digital Agency', email: 'info@digagency.com', phone: '+1122334455', campaigns: 8 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          <span>Add Client</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">{client.name}</h3>
            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <a href={`mailto:${client.email}`} className="hover:text-blue-600">{client.email}</a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>{client.phone}</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">Active Campaigns: <span className="font-semibold">{client.campaigns}</span></p>
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 bg-blue-100 text-blue-600 px-3 py-2 rounded hover:bg-blue-200">
                <Edit2 size={16} />
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 bg-red-100 text-red-600 px-3 py-2 rounded hover:bg-red-200">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Clients;
