# Signal Animations Collection

All signal animations from the Signal Society website, collected in one folder.

## Files

| # | File | Description |
|---|------|-------------|
| 01 | `01-hero-signal.svg` | Expanding concentric rings from center dot |
| 02 | `02-about-signal.svg` | Rings, nodes, connections, pulse dots |
| 03 | `03-signal-grow.svg` | Growth chart with signal rings |
| 04 | `04-signal-build.svg` | Circuit board with central node |
| 05 | `05-signal-operate.svg` | Hub with orbiting satellites |
| 06 | `06-logo-reveal.svg` | Logo reveal animation |

## How to Convert SVG to MP4 (Transparent Background)

### Option 1: FFmpeg + Chrome/Chromium

```bash
# Install dependencies
npm install -g puppeteer

# Use puppeteer to record SVG animation as WebM, then convert to MP4
ffmpeg -i animation.webm -vf "format=yuva420p" -c:v libx264 -pix_fmt yuva420p output.mp4
```

### Option 2: After Effects

1. Import SVG into After Effects
2. Set composition to transparent background (Channel > Shift Channels > Full)
3. Render with alpha channel: Animation > Add to Render Queue > Output Module > RGB + Alpha

### Option 3: Lottie (Recommended for Web)

1. Convert SVG animations to Lottie JSON using Bodymovin plugin
2. Use Lottie player for web rendering
3. No need for MP4 — plays natively in browser with transparency

### Option 4: Browser Recording

```html
<!-- Create an HTML file to record -->
<!DOCTYPE html>
<html>
<body style="background: #000; margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh;">
  <img src="01-hero-signal.svg" width="400" height="400">
</body>
</html>
```

Then use OBS Studio or ScreenFlow to record with:
- Green screen background
- Chroma key in post-production

## Usage in Website

These SVGs can be used directly in HTML:

```html
<img src="signal-animations/01-hero-signal.svg" alt="Signal animation">
```

Or inline:

```html
<object type="image/svg+xml" data="signal-animations/01-hero-signal.svg"></object>
```

## Color Reference

- Orange: `#FF6600`
- Blue: `#1A1AFF`
- White: `#FFFFFF`
