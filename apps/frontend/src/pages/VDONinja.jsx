import { useState } from 'react';
import {
  Video, Users, Copy, Check, ExternalLink, QrCode, Settings,
  Mic, Monitor, Grid3x3, Radio, Smartphone, Plus, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  generateGuestLink,
  generateViewerLink,
  generateDirectorLink,
  VDONinjaTemplates,
  ViewerTemplates,
  VDONinjaWorkflows,
  generateQRCodeURL,
  validateRoomName,
  generateRandomRoomName,
  copyToClipboard,
} from '../lib/vdoninja';

function VDONinja() {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState('interview');
  const [showQRCode, setShowQRCode] = useState(null);
  const [copiedLink, setCopiedLink] = useState(null);

  /**
   * Create new VDO.Ninja room
   */
  const handleCreateRoom = (workflowName = selectedWorkflow) => {
    const roomName = newRoomName.trim() || generateRandomRoomName();

    if (!validateRoomName(roomName)) {
      toast.error('Room name must be 3-50 characters (alphanumeric, dashes, underscores)');
      return;
    }

    const workflow = VDONinjaWorkflows[workflowName];
    const links = workflow.links(roomName);

    const room = {
      id: Date.now(),
      name: roomName,
      workflow: workflowName,
      workflowName: workflow.name,
      links,
      instructions: workflow.instructions,
      createdAt: new Date(),
    };

    setRooms([room, ...rooms]);
    setNewRoomName('');
    toast.success(`Room "${roomName}" created!`);
  };

  /**
   * Delete room
   */
  const handleDeleteRoom = (roomId) => {
    setRooms(rooms.filter(r => r.id !== roomId));
    toast.success('Room deleted');
  };

  /**
   * Copy link to clipboard
   */
  const handleCopyLink = (link, label) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(link);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopiedLink(null), 2000);
    });
  };

  /**
   * Open link in new tab
   */
  const handleOpenLink = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  /**
   * Render link card
   */
  const LinkCard = ({ label, url, icon: Icon, color = 'blue', showQR = false }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-2">
        <Icon size={18} className={`text-${color}-600`} />
        <span className="font-medium text-sm">{label}</span>
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={url}
          readOnly
          className="input text-xs flex-1 font-mono"
        />
        <button
          onClick={() => handleCopyLink(url, label)}
          className="btn-secondary p-2"
          title="Copy link"
        >
          {copiedLink === url ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
        </button>
        <button
          onClick={() => handleOpenLink(url)}
          className="btn-secondary p-2"
          title="Open in new tab"
        >
          <ExternalLink size={16} />
        </button>
        {showQR && (
          <button
            onClick={() => setShowQRCode(url)}
            className="btn-secondary p-2"
            title="Show QR code"
          >
            <QrCode size={16} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <Video className="text-brand-primary" />
            <span>VDO.Ninja Integration</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Bring remote guests into your streams with ultra-low latency
          </p>
        </div>
      </div>

      {/* Quick Start Workflows */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Start Workflows</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Choose a pre-configured workflow optimized for your streaming scenario
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {Object.entries(VDONinjaWorkflows).map(([key, workflow]) => (
            <button
              key={key}
              onClick={() => setSelectedWorkflow(key)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedWorkflow === key
                  ? 'border-brand-primary bg-brand-primary/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-brand-primary/50'
              }`}
            >
              <h3 className="font-semibold mb-1">{workflow.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{workflow.description}</p>
            </button>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Room name (leave empty for random)"
            className="input flex-1"
          />
          <button
            onClick={() => handleCreateRoom()}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Create Room</span>
          </button>
        </div>
      </div>

      {/* Active Rooms */}
      {rooms.length === 0 ? (
        <div className="card text-center py-12">
          <Video size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Active Rooms</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first VDO.Ninja room to start bringing remote guests into your streams
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {rooms.map((room) => (
            <div key={room.id} className="card">
              {/* Room Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{room.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{room.workflowName}</p>
                </div>
                <button
                  onClick={() => handleDeleteRoom(room.id)}
                  className="btn-secondary text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                <h4 className="font-semibold mb-2 flex items-center space-x-2">
                  <Settings size={16} className="text-blue-600" />
                  <span>Setup Instructions</span>
                </h4>
                <ol className="text-sm space-y-1 list-decimal list-inside text-gray-700 dark:text-gray-300">
                  {room.instructions.map((instruction, i) => (
                    <li key={i}>{instruction}</li>
                  ))}
                </ol>
              </div>

              {/* Links Section */}
              <div className="space-y-4">
                {/* Director Link */}
                {room.links.hostDirector && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center space-x-2">
                      <Monitor size={16} />
                      <span>Host Control</span>
                    </h4>
                    <LinkCard
                      label="Director Link (You - Control Panel)"
                      url={room.links.hostDirector}
                      icon={Monitor}
                      color="purple"
                    />
                  </div>
                )}

                {/* Guest Links */}
                {room.links.guestLink && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center space-x-2">
                      <Users size={16} />
                      <span>Guest Invite</span>
                    </h4>
                    <LinkCard
                      label="Guest Link (Send to Remote Guest)"
                      url={room.links.guestLink}
                      icon={Users}
                      color="green"
                      showQR
                    />
                  </div>
                )}

                {/* Multiple Guest Links */}
                {room.links.guestLinks && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center space-x-2">
                      <Users size={16} />
                      <span>Guest Invites</span>
                    </h4>
                    <div className="space-y-2">
                      {room.links.guestLinks.map((guest, i) => (
                        <LinkCard
                          key={i}
                          label={guest.label}
                          url={guest.url}
                          icon={Users}
                          color="green"
                          showQR
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* OBS Viewer Links */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center space-x-2">
                    <Video size={16} />
                    <span>OBS Browser Sources</span>
                  </h4>
                  <div className="space-y-2">
                    {room.links.obsViewer && (
                      <LinkCard
                        label="OBS Viewer (Add as Browser Source)"
                        url={room.links.obsViewer}
                        icon={Video}
                        color="blue"
                      />
                    )}
                    {room.links.obsVideoViewer && (
                      <LinkCard
                        label="Video Viewer"
                        url={room.links.obsVideoViewer}
                        icon={Video}
                        color="blue"
                      />
                    )}
                    {room.links.obsAudioViewer && (
                      <LinkCard
                        label="Audio Viewer"
                        url={room.links.obsAudioViewer}
                        icon={Mic}
                        color="blue"
                      />
                    )}
                  </div>
                </div>

                {/* Live Preview */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center space-x-2">
                    <Monitor size={16} />
                    <span>Live Preview</span>
                  </h4>
                  <div className="bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={room.links.obsViewer || room.links.hostDirector}
                      className="w-full h-96"
                      allow="camera; microphone; display-capture; autoplay; clipboard-write"
                      title={`Preview: ${room.name}`}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    This preview shows what viewers will see. Guests will appear here when they join.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Templates Reference */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Available Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(VDONinjaTemplates).map(([key, template]) => (
            <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-1">{template.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{template.description}</p>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Quality:</span>
                  <span className="font-mono">{template.params.quality || 'Auto'}</span>
                </div>
                {template.params.bitrate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bitrate:</span>
                    <span className="font-mono">{template.params.bitrate} kbps</span>
                  </div>
                )}
                {template.params.framerate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Framerate:</span>
                    <span className="font-mono">{template.params.framerate} fps</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowQRCode(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Scan to Join</h3>
            <img
              src={generateQRCodeURL(showQRCode)}
              alt="QR Code"
              className="w-full rounded-lg"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Guest can scan this QR code with their mobile device to join
            </p>
            <button
              onClick={() => setShowQRCode(null)}
              className="w-full btn-primary mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="card bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <h3 className="font-semibold mb-2">💡 Pro Tips</h3>
        <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
          <li>• Use the Director Link to control guest cameras and audio remotely</li>
          <li>• Add OBS Viewer links as Browser Sources (1920x1080 recommended)</li>
          <li>• Share QR codes for easy mobile joining</li>
          <li>• Test with a guest before going live</li>
          <li>• Each workflow is optimized for specific streaming scenarios</li>
        </ul>
      </div>
    </div>
  );
}

export default VDONinja;
