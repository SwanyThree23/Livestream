import { User } from 'lucide-react';

function AvatarStudio() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Avatar Studio</h1>
      <div className="card text-center py-12">
        <User size={64} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-xl font-semibold mb-2">AI Avatar Studio</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Create AI-powered avatars with HeyGen/Akool integration
        </p>
        <p className="text-sm text-gray-500">Coming soon...</p>
      </div>
    </div>
  );
}

export default AvatarStudio;
