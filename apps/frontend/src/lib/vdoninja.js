/**
 * VDO.Ninja Integration Utilities
 * Complete toolkit for generating optimized VDO.Ninja links and managing remote guests
 */

const VDO_NINJA_BASE = 'https://vdo.ninja';

/**
 * VDO.Ninja Link Templates with Optimal Settings
 */
export const VDONinjaTemplates = {
  // High-quality guest link for professional broadcasts
  professionalGuest: {
    name: 'Professional Guest',
    description: 'High quality, low latency for professional interviews',
    params: {
      quality: 2,          // High quality
      stereo: 1,           // Stereo audio
      codec: 'h264',       // H264 codec for compatibility
      bitrate: 5000,       // 5 Mbps
      denoise: 1,          // Audio noise reduction
      autostart: 1,        // Auto-start when ready
      cleanoutput: 1,      // Clean output for OBS
    }
  },

  // Gaming stream with high framerate
  gamingGuest: {
    name: 'Gaming Stream',
    description: 'Optimized for high-motion gaming content',
    params: {
      quality: 2,
      framerate: 60,       // 60 FPS
      codec: 'vp9',        // VP9 for better quality
      bitrate: 8000,       // 8 Mbps for high motion
      audio: 1,
      stereo: 1,
      cleanoutput: 1,
    }
  },

  // Podcast/audio-focused with screen share
  podcastGuest: {
    name: 'Podcast Guest',
    description: 'Audio-focused with optional screen share',
    params: {
      quality: 1,          // Medium video quality
      audiobitrate: 256,   // High audio bitrate
      stereo: 1,
      echocancellation: 1, // Echo cancellation for clear audio
      autostart: 1,
      audiodevice: 1,      // Allow audio device selection
      screenshare: 1,      // Enable screen share option
    }
  },

  // Mobile guest with data-saving
  mobileGuest: {
    name: 'Mobile Guest',
    description: 'Optimized for mobile connections with lower bandwidth',
    params: {
      quality: 0,          // Lower quality for mobile
      bitrate: 2500,       // Lower bitrate
      framerate: 30,
      stereo: 0,           // Mono audio to save bandwidth
      cleanoutput: 1,
      autostart: 1,
    }
  },

  // Screen share only (no camera)
  screenShareOnly: {
    name: 'Screen Share Only',
    description: 'Screen sharing without camera feed',
    params: {
      screenshare: 1,
      nocamera: 1,         // Disable camera
      quality: 2,
      framerate: 30,
      cleanoutput: 1,
      autostart: 1,
    }
  },

  // Multi-guest panel
  panelGuest: {
    name: 'Panel Discussion',
    description: 'Multiple guests in a panel format',
    params: {
      quality: 1,
      bitrate: 3000,
      layout: 'grid',      // Grid layout for multiple guests
      cleanoutput: 1,
      audiobitrate: 128,
      autostart: 1,
    }
  },
};

/**
 * Viewer Link Templates for OBS
 */
export const ViewerTemplates = {
  // Standard scene viewer
  standardViewer: {
    name: 'Standard Viewer',
    description: 'Basic viewer for OBS browser source',
    params: {
      scene: 1,            // Scene mode
      cleanoutput: 1,      // Remove VDO.Ninja UI
      transparent: 1,      // Transparent background
      bitrate: 10000,      // High bitrate for local viewing
    }
  },

  // Solo viewer for single guest
  soloViewer: {
    name: 'Solo Viewer',
    description: 'View single guest feed',
    params: {
      solo: 1,             // Solo mode
      cleanoutput: 1,
      transparent: 1,
      bitrate: 10000,
    }
  },

  // Mixer for audio mixing
  audioMixer: {
    name: 'Audio Mixer',
    description: 'Audio-only viewer for mixing',
    params: {
      audioonly: 1,        // Audio only
      cleanoutput: 1,
      effects: 1,          // Enable audio effects
    }
  },

  // Grid layout for multiple guests
  gridViewer: {
    name: 'Grid Layout',
    description: 'Multiple guests in grid layout',
    params: {
      scene: 1,
      cleanoutput: 1,
      transparent: 1,
      grid: 1,             // Grid layout
      bitrate: 15000,      // Higher bitrate for multiple feeds
    }
  },
};

/**
 * Generate VDO.Ninja Guest Link
 * @param {string} roomName - Room name/ID
 * @param {string} templateName - Template to use (from VDONinjaTemplates)
 * @param {object} customParams - Additional custom parameters
 * @returns {string} Complete VDO.Ninja URL
 */
export function generateGuestLink(roomName, templateName = 'professionalGuest', customParams = {}) {
  const template = VDONinjaTemplates[templateName] || VDONinjaTemplates.professionalGuest;
  const params = { ...template.params, ...customParams };

  const url = new URL(VDO_NINJA_BASE);
  url.searchParams.set('push', roomName);

  // Add all parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

/**
 * Generate VDO.Ninja Viewer Link for OBS
 * @param {string} roomName - Room name/ID
 * @param {string} guestId - Optional specific guest ID
 * @param {string} templateName - Template to use
 * @param {object} customParams - Additional parameters
 * @returns {string} Complete viewer URL
 */
export function generateViewerLink(roomName, guestId = null, templateName = 'standardViewer', customParams = {}) {
  const template = ViewerTemplates[templateName] || ViewerTemplates.standardViewer;
  const params = { ...template.params, ...customParams };

  const url = new URL(VDO_NINJA_BASE);

  if (guestId) {
    url.searchParams.set('view', guestId);
  } else {
    url.searchParams.set('view', roomName);
  }

  url.searchParams.set('room', roomName);

  // Add all parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

/**
 * Generate Director Link for controlling guests
 * @param {string} roomName - Room name/ID
 * @returns {string} Director control URL
 */
export function generateDirectorLink(roomName) {
  return `${VDO_NINJA_BASE}/?director=${roomName}`;
}

/**
 * Generate Scene Link for advanced layout control
 * @param {string} roomName - Room name/ID
 * @returns {string} Scene control URL
 */
export function generateSceneLink(roomName) {
  return `${VDO_NINJA_BASE}/?scene&room=${roomName}`;
}

/**
 * Common VDO.Ninja Workflows
 */
export const VDONinjaWorkflows = {
  // One-on-one interview
  interview: {
    name: 'One-on-One Interview',
    description: 'Host interviews single guest',
    links: (roomName) => ({
      hostDirector: generateDirectorLink(roomName),
      guestLink: generateGuestLink(roomName, 'professionalGuest'),
      obsViewer: generateViewerLink(roomName, null, 'soloViewer'),
    }),
    instructions: [
      'Send the Guest Link to your interviewee',
      'Add OBS Viewer link as Browser Source in OBS (1920x1080)',
      'Use Director Link to control guest camera/audio',
      'Guest will auto-start when they join'
    ]
  },

  // Panel discussion
  panel: {
    name: 'Panel Discussion',
    description: 'Multiple guests in discussion',
    links: (roomName) => ({
      hostDirector: generateDirectorLink(roomName),
      guestLinks: [
        { label: 'Guest 1', url: generateGuestLink(roomName, 'panelGuest', { label: 'Guest 1' }) },
        { label: 'Guest 2', url: generateGuestLink(roomName, 'panelGuest', { label: 'Guest 2' }) },
        { label: 'Guest 3', url: generateGuestLink(roomName, 'panelGuest', { label: 'Guest 3' }) },
      ],
      obsViewer: generateViewerLink(roomName, null, 'gridViewer'),
    }),
    instructions: [
      'Send individual guest links to each panelist',
      'Add Grid Viewer to OBS as Browser Source',
      'Use Director Link to manage all guests',
      'Guests appear in grid layout automatically'
    ]
  },

  // Podcast with screen share
  podcast: {
    name: 'Podcast with Screen Share',
    description: 'Audio-focused with optional screen sharing',
    links: (roomName) => ({
      hostDirector: generateDirectorLink(roomName),
      guestLink: generateGuestLink(roomName, 'podcastGuest'),
      obsVideoViewer: generateViewerLink(roomName, null, 'soloViewer'),
      obsAudioViewer: generateViewerLink(roomName, null, 'audioMixer'),
    }),
    instructions: [
      'Send Podcast Guest Link to your guest',
      'Add Video Viewer to OBS for camera/screen',
      'Add Audio Viewer to OBS audio mixer for clean audio',
      'Guest can toggle screen share during call'
    ]
  },

  // Gaming stream with guest
  gaming: {
    name: 'Gaming Stream Co-op',
    description: 'Gaming with remote co-host',
    links: (roomName) => ({
      hostDirector: generateDirectorLink(roomName),
      guestLink: generateGuestLink(roomName, 'gamingGuest'),
      obsViewer: generateViewerLink(roomName, null, 'soloViewer', { framerate: 60 }),
    }),
    instructions: [
      'Send Gaming Guest Link for high-quality 60fps',
      'Add OBS Viewer with 60fps support',
      'Guest will have optimized settings for high motion',
      'Use Director Link for camera control'
    ]
  },

  // Mobile guest
  mobileInterview: {
    name: 'Mobile Guest Interview',
    description: 'Guest joining from mobile device',
    links: (roomName) => ({
      hostDirector: generateDirectorLink(roomName),
      guestLink: generateGuestLink(roomName, 'mobileGuest'),
      obsViewer: generateViewerLink(roomName, null, 'soloViewer'),
    }),
    instructions: [
      'Send Mobile Guest Link optimized for cellular',
      'Link works on iPhone/Android browsers',
      'Lower quality to prevent buffering',
      'Guest can join without app installation'
    ]
  },
};

/**
 * Utility: Copy text to clipboard
 */
export function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      // Success callback
      return true;
    }).catch(() => {
      // Fallback
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

/**
 * Parse VDO.Ninja URL to extract room and parameters
 */
export function parseVDONinjaURL(url) {
  try {
    const urlObj = new URL(url);
    return {
      room: urlObj.searchParams.get('room') || urlObj.searchParams.get('push') || urlObj.searchParams.get('view'),
      view: urlObj.searchParams.get('view'),
      push: urlObj.searchParams.get('push'),
      director: urlObj.searchParams.get('director'),
      scene: urlObj.searchParams.has('scene'),
      solo: urlObj.searchParams.has('solo'),
      quality: urlObj.searchParams.get('quality'),
      bitrate: urlObj.searchParams.get('bitrate'),
      allParams: Object.fromEntries(urlObj.searchParams.entries()),
    };
  } catch (error) {
    return null;
  }
}

/**
 * Generate QR code URL for mobile sharing
 */
export function generateQRCodeURL(vdoNinjaLink) {
  const encodedURL = encodeURIComponent(vdoNinjaLink);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedURL}`;
}

/**
 * Validate VDO.Ninja room name
 */
export function validateRoomName(name) {
  // Room names should be alphanumeric and not too long
  const regex = /^[a-zA-Z0-9_-]{3,50}$/;
  return regex.test(name);
}

/**
 * Generate random room name
 */
export function generateRandomRoomName(prefix = 'SwanyThree') {
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${prefix}-${randomStr}`;
}

export default {
  VDONinjaTemplates,
  ViewerTemplates,
  VDONinjaWorkflows,
  generateGuestLink,
  generateViewerLink,
  generateDirectorLink,
  generateSceneLink,
  copyToClipboard,
  parseVDONinjaURL,
  generateQRCodeURL,
  validateRoomName,
  generateRandomRoomName,
};
