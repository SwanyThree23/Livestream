# VDO.Ninja Integration Guide

Complete guide for using VDO.Ninja integration in SwanyThree Ultimate to bring remote guests into your streams with ultra-low latency.

## 📹 What is VDO.Ninja?

VDO.Ninja (formerly OBS.Ninja) is a powerful tool for bringing remote guests into your live streams with:
- ✅ **Ultra-low latency** (under 1 second)
- ✅ **No app installation required** (works in browser)
- ✅ **High quality video/audio** (up to 60fps, 4K)
- ✅ **Works on any device** (desktop, mobile, tablet)
- ✅ **Free and open source**
- ✅ **Direct browser-to-browser connection** (P2P)

## 🚀 Quick Start

### 1. Create a Room

1. Navigate to **VDO.Ninja** in the sidebar
2. Select a workflow (Interview, Panel, Podcast, etc.)
3. Enter a room name or leave empty for random
4. Click **Create Room**

### 2. Invite Your Guest

**Option A: Send Link**
- Copy the "Guest Link"
- Send to your remote guest via email/SMS/chat
- Guest clicks link and joins (no app needed!)

**Option B: QR Code**
- Click QR code button
- Guest scans with mobile device
- Instant join!

### 3. Add to OBS

1. In OBS, add **Browser Source**
2. Copy "OBS Viewer Link" from SwanyThree
3. Paste as URL in OBS
4. Set size to **1920x1080**
5. Check "Control audio via OBS"
6. Your guest will appear when they join!

### 4. Control Your Guest

- Click "Director Link" to open control panel
- Control guest camera, audio, quality
- See live stats and connection quality
- Mute/unmute, enable/disable camera

---

## 🎯 Pre-Configured Workflows

SwanyThree includes 5 optimized workflows:

### 1. One-on-One Interview
**Best for:** Single guest interviews, 1-on-1 conversations

**Features:**
- High quality video (2 Mbps)
- Stereo audio
- Low latency
- Clean output for OBS

**Use Case:** Talk shows, interviews, podcasts

---

### 2. Panel Discussion
**Best for:** Multiple guests (3+ people)

**Features:**
- Grid layout
- Individual guest links
- Director control for all guests
- Medium quality to support multiple feeds

**Use Case:** Roundtable discussions, webinars, panel shows

---

### 3. Podcast with Screen Share
**Best for:** Audio-focused content with optional visuals

**Features:**
- High audio quality (256 kbps)
- Screen share enabled
- Separate audio/video feeds
- Echo cancellation

**Use Case:** Podcasts, tutorials, presentations

---

### 4. Gaming Stream Co-op
**Best for:** Gaming with remote players

**Features:**
- 60 FPS support
- High bitrate (8 Mbps)
- VP9 codec for better quality
- Optimized for high motion

**Use Case:** Co-op gaming, speedruns, competitive gaming

---

### 5. Mobile Guest Interview
**Best for:** Guests joining from phones

**Features:**
- Lower bitrate for cellular (2.5 Mbps)
- Mobile-optimized settings
- Data-saving mode
- Works on iPhone/Android

**Use Case:** Field reporting, on-the-go interviews

---

## 🎨 Guest Templates

Each workflow uses optimized guest templates:

### Professional Guest
```
Quality: High (2)
Bitrate: 5000 kbps
Audio: Stereo
Codec: H264
Noise Reduction: Enabled
```
**When to use:** Professional interviews, important guests

### Gaming Guest
```
Quality: High (2)
Framerate: 60 fps
Bitrate: 8000 kbps
Codec: VP9
```
**When to use:** Gaming streams, high-motion content

### Podcast Guest
```
Quality: Medium (1)
Audio Bitrate: 256 kbps
Screen Share: Enabled
Echo Cancellation: Enabled
```
**When to use:** Audio-focused content, presentations

### Mobile Guest
```
Quality: Low (0)
Bitrate: 2500 kbps
Framerate: 30 fps
Audio: Mono
```
**When to use:** Mobile connections, limited bandwidth

### Screen Share Only
```
Screen Share: Enabled
Camera: Disabled
Quality: High (2)
```
**When to use:** Tutorials, demonstrations, presentations

---

## 🛠️ OBS Setup Guide

### Adding Guest Feed to OBS

1. **Create Browser Source**
   - Sources → Add → Browser
   - Name it "VDO.Ninja Guest"

2. **Configure Source**
   - URL: Paste "OBS Viewer Link" from SwanyThree
   - Width: 1920
   - Height: 1080
   - FPS: 30 (or 60 for gaming)
   - Check "Control audio via OBS"
   - Check "Shutdown source when not visible" (optional)

3. **Position and Size**
   - Resize to fit your scene
   - Add filters as needed

### Recommended OBS Settings

**For Single Guest:**
- 1920x1080 source
- Position in main frame or picture-in-picture

**For Multiple Guests (Panel):**
- Use Grid layout
- Position guests in grid
- Or use individual solo links for each guest

**Audio Settings:**
- Check "Control audio via OBS"
- Add audio filters (noise suppression, gate)
- Set levels in OBS mixer

---

## 🎮 Director Mode

The Director Link gives you full control over guests:

### Features:
- ✅ **View all guests** in one dashboard
- ✅ **Mute/unmute** guests
- ✅ **Enable/disable** cameras
- ✅ **Adjust quality** per guest
- ✅ **See connection stats**
- ✅ **Record** guest feeds
- ✅ **Toggle screen share**

### How to Use:
1. Open "Director Link" in browser
2. Wait for guests to join
3. Control each guest individually
4. Monitor connection quality
5. Make adjustments in real-time

---

## 📱 Mobile Guest Setup

For guests joining from mobile devices:

### iOS (iPhone/iPad):
1. Guest receives link via SMS/email
2. Tap link → Opens in Safari
3. Allow camera/microphone permissions
4. Guest is live!

### Android:
1. Guest receives link
2. Opens in Chrome
3. Allow camera/microphone permissions
4. Guest is live!

### Tips for Mobile Guests:
- Use WiFi when possible
- Landscape orientation for video
- Find good lighting
- Use headphones to prevent echo
- Close other apps
- Plug in charger for long sessions

---

## 🔧 Advanced Settings

### Custom Parameters

You can customize links with URL parameters:

**Quality Settings:**
- `quality=0` (low), `quality=1` (medium), `quality=2` (high)
- `bitrate=3000` (set specific bitrate in kbps)
- `framerate=60` (set framerate)

**Audio Settings:**
- `stereo=1` (enable stereo)
- `audiobitrate=256` (audio quality)
- `echocancellation=1` (enable echo cancellation)
- `denoise=1` (noise reduction)

**Layout:**
- `solo=1` (solo view)
- `scene=1` (scene mode)
- `grid=1` (grid layout)
- `transparent=1` (transparent background)

**Automation:**
- `autostart=1` (auto-start when ready)
- `cleanoutput=1` (remove UI elements)

### Example Custom Link:
```
https://vdo.ninja/?push=MyRoom&quality=2&bitrate=5000&stereo=1&autostart=1
```

---

## 🎯 Best Practices

### Before Going Live:

1. ✅ **Test with guest** 15 minutes before
2. ✅ **Check audio levels** in OBS
3. ✅ **Verify video quality**
4. ✅ **Test director controls**
5. ✅ **Have backup plan** (phone call, Discord)

### During Stream:

1. ✅ **Monitor connection quality** in Director
2. ✅ **Have guest restart if issues**
3. ✅ **Keep director panel open**
4. ✅ **Communicate with guest** (Discord, etc.)

### Optimization Tips:

1. **For Best Quality:**
   - Guest uses wired internet
   - Close other apps/tabs
   - Use dedicated device for VDO.Ninja
   - Good lighting
   - External microphone

2. **For Reliability:**
   - Use "professionalGuest" template
   - H264 codec (better compatibility)
   - Moderate bitrate (3000-5000 kbps)
   - Auto-start enabled

3. **For Multiple Guests:**
   - Use panel workflow
   - Lower individual quality
   - Dedicated OBS scene
   - More bandwidth on host side

---

## 🐛 Troubleshooting

### Guest Can't Join

**Problem:** Link not working
**Solutions:**
- ✅ Ensure guest allows camera/microphone
- ✅ Try different browser (Chrome recommended)
- ✅ Disable browser extensions
- ✅ Check firewall/antivirus
- ✅ Use incognito/private mode

### Poor Video Quality

**Problem:** Pixelated or choppy video
**Solutions:**
- ✅ Reduce bitrate setting
- ✅ Lower quality setting
- ✅ Reduce framerate to 30fps
- ✅ Guest switches to wired connection
- ✅ Close background apps

### Audio Issues

**Problem:** Echo, static, or no audio
**Solutions:**
- ✅ Enable echo cancellation
- ✅ Guest uses headphones
- ✅ Check OBS audio settings
- ✅ Enable noise suppression
- ✅ Adjust audio bitrate

### Connection Drops

**Problem:** Guest keeps disconnecting
**Solutions:**
- ✅ Use lower quality settings
- ✅ Reduce bitrate
- ✅ Guest switches networks
- ✅ Disable other apps
- ✅ Try different server region

### Not Appearing in OBS

**Problem:** Browser source is black
**Solutions:**
- ✅ Check URL is correct
- ✅ Verify browser source size (1920x1080)
- ✅ Guest has actually joined
- ✅ Refresh browser source
- ✅ Check "Control audio via OBS"

---

## 📊 Comparison with Other Solutions

| Feature | VDO.Ninja | Zoom | Skype | Discord |
|---------|-----------|------|-------|---------|
| **Latency** | <1s | 2-3s | 2-3s | 1-2s |
| **Quality** | Up to 4K | 1080p | 1080p | 1080p |
| **Browser-based** | ✅ | ❌ | ❌ | ❌ |
| **No app needed** | ✅ | ❌ | ❌ | ❌ |
| **Cost** | Free | Paid | Free | Free |
| **OBS Integration** | Excellent | Good | Poor | Good |
| **P2P** | ✅ | ❌ | ❌ | ❌ |

---

## 💡 Pro Tips

1. **Create rooms in advance** and test before stream
2. **Save workflows** for recurring shows
3. **Use QR codes** for mobile guests
4. **Keep director link open** for monitoring
5. **Communicate with guests** via separate channel
6. **Have backup plans** for technical issues
7. **Test on same network type** as live stream
8. **Use wired connections** when possible
9. **Monitor bandwidth** usage
10. **Keep OBS scene ready** before guest joins

---

## 🔗 Useful Resources

- **VDO.Ninja Website:** https://vdo.ninja
- **VDO.Ninja Documentation:** https://docs.vdo.ninja
- **VDO.Ninja Discord:** https://discord.vdo.ninja
- **GitHub:** https://github.com/steveseguin/vdo.ninja

---

## 🆘 Getting Help

**For VDO.Ninja specific issues:**
- Visit https://docs.vdo.ninja
- Join VDO.Ninja Discord

**For SwanyThree integration:**
- Check this documentation
- Review TESTING.md
- Open GitHub issue

---

## 📝 Common Workflows

### Simple Interview Setup
```
1. Create "One-on-One Interview" workflow
2. Send Guest Link to interviewee
3. Add OBS Viewer to OBS as Browser Source
4. Open Director Link for control
5. Guest joins and appears in OBS
```

### Multi-Guest Panel
```
1. Create "Panel Discussion" workflow
2. Send individual Guest Links to each panelist
3. Add Grid Viewer to OBS
4. Use Director to control all guests
5. All guests appear in grid layout
```

### Podcast with Screen Share
```
1. Create "Podcast with Screen Share" workflow
2. Send Podcast Guest Link
3. Add Video Viewer to OBS (for camera)
4. Add Audio Viewer to OBS mixer (for audio)
5. Guest can toggle screen share during call
```

---

**Ready to bring remote guests into your streams? Create your first VDO.Ninja room in SwanyThree now! 🚀**
