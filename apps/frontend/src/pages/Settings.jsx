import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { usersAPI } from '../lib/api';
import toast from 'react-hot-toast';

function Settings() {
  const { user, fetchUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar_url: user?.avatar_url || '',
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.updateProfile(formData);
      toast.success('Profile updated successfully!');
      fetchUser();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'account', label: 'Account' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 -mb-px ${
              activeTab === tab.id
                ? 'border-b-2 border-brand-primary text-brand-primary font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="label">Username</label>
              <input
                type="text"
                className="input"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Bio</label>
              <textarea
                className="input"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="label">Avatar URL</label>
              <input
                type="url"
                className="input"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </form>
        </div>
      )}

      {activeTab === 'account' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={user?.email} disabled />
            </div>
            <div>
              <label className="label">Subscription Tier</label>
              <input type="text" className="input capitalize" value={user?.subscription_tier} disabled />
            </div>
            <div>
              <label className="label">Member Since</label>
              <input
                type="text"
                className="input"
                value={new Date(user?.created_at).toLocaleDateString()}
                disabled
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            {['Email notifications', 'Push notifications', 'Stream alerts', 'Chat messages'].map((pref) => (
              <label key={pref} className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span>{pref}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'privacy' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
          <div className="space-y-4">
            {['Public profile', 'Show analytics', 'Allow direct messages'].map((pref) => (
              <label key={pref} className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span>{pref}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
