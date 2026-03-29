import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Settings: React.FC = () => {
  const [familyName, setFamilyName] = useState('Smith Family');
  const [timezone, setTimezone] = useState('America/New_York');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleSave = () => {
    console.log('Saving settings:', { familyName, timezone, emailNotifications, pushNotifications });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      {/* Family Settings */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Family Settings</h2>
        <div className="space-y-4">
          <Input
            label="Family Name"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-2 rounded border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Email Notifications</span>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-6 h-6 rounded"
            />
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-gray-700">Push Notifications</span>
            <input
              type="checkbox"
              checked={pushNotifications}
              onChange={(e) => setPushNotifications(e.target.checked)}
              className="w-6 h-6 rounded"
            />
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 bg-red-50 border-red-200">
        <h2 className="text-lg font-bold text-red-800 mb-4">Danger Zone</h2>
        <Button variant="outline" className="text-red-600 border-red-600">
          Delete Family Account
        </Button>
      </Card>

      <Button onClick={handleSave} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
        Save Settings
      </Button>
    </div>
  );
};

export default Settings;
