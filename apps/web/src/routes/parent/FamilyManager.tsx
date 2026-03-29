import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const FamilyManager: React.FC = () => {
  const [showAddChild, setShowAddChild] = useState(false);

  const children = [
    {
      id: '1',
      name: 'Alex',
      level: 7,
      streak: 5,
      lastActive: '2 hours ago',
    },
    {
      id: '2',
      name: 'Jordan',
      level: 5,
      streak: 2,
      lastActive: '1 day ago',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Family Manager</h1>
        <Button
          onClick={() => setShowAddChild(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Add Child
        </Button>
      </div>

      {/* Children List */}
      <div className="space-y-4">
        {children.map((child) => (
          <Card key={child.id} className="p-6 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{child.name}</h3>
                <p className="text-sm text-gray-600">Last active: {child.lastActive}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Level</p>
                <p className="text-2xl font-bold text-blue-500">{child.level}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Button variant="secondary">View Progress</Button>
              <Button variant="outline">Edit Settings</Button>
              <Button variant="ghost">Remove</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Child Modal */}
      <Modal
        isOpen={showAddChild}
        onClose={() => setShowAddChild(false)}
        title="Add Child to Family"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Child Name</label>
            <input
              type="text"
              placeholder="Enter child's name"
              className="w-full px-4 py-2 rounded border-2 border-gray-300 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="number"
              placeholder="Age"
              className="w-full px-4 py-2 rounded border-2 border-gray-300 focus:border-blue-500"
            />
          </div>
          <p className="text-sm text-gray-600">
            A 4-digit PIN will be generated for the child to log in.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default FamilyManager;
