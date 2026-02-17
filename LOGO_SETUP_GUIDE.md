# Logo Setup Guide

This guide explains how to add proper logos and branding to the Pet Care AI app.

## Required Logo Assets

### 1. App Icon (icon.png)
- **Location**: `assets/images/icon.png`
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Purpose**: Main app icon for both iOS and Android
- **Design**: Should feature a pet-related icon (paw print, pet silhouette, or veterinary symbol)
- **Colors**: Use primary brand color (#3B82F6 - blue) with complementary colors

### 2. Adaptive Icon (Android)
- **Location**: `assets/images/adaptive-icon.png`
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Purpose**: Android adaptive icon foreground
- **Design**: Icon should fit within safe zone (center 66% of canvas)
- **Background**: Set in app.json as backgroundColor: "#3B82F6"

### 3. Favicon
- **Location**: `assets/images/favicon.png`
- **Size**: 48x48 pixels
- **Format**: PNG
- **Purpose**: Web version favicon

### 4. Splash Screen
- **Location**: `assets/images/splash.png`
- **Size**: 1284x2778 pixels (iPhone 13 Pro Max resolution)
- **Format**: PNG
- **Purpose**: App loading screen
- **Design**: Simple logo centered on brand color background

### 5. Notification Icon (Android)
- **Location**: `assets/images/notification-icon.png`
- **Size**: 96x96 pixels
- **Format**: PNG (white icon on transparent background)
- **Purpose**: Android notification tray icon

## Design Recommendations

### Color Palette
- **Primary**: #3B82F6 (Blue)
- **Secondary**: #10B981 (Green - for health/wellness)
- **Accent**: #F59E0B (Amber - for alerts)
- **Background**: #FFFFFF (White)

### Icon Design Options

#### Option 1: Paw Print
- Simple, recognizable paw print icon
- Works well at all sizes
- Universal pet symbol

#### Option 2: Pet Silhouette
- Dog and cat silhouettes combined
- Shows app supports both species
- More detailed but still clear

#### Option 3: Medical Cross + Paw
- Combines veterinary care with pet theme
- Clearly communicates app purpose
- Professional appearance

### Design Tools

You can create these assets using:
- **Figma** (free, web-based)
- **Adobe Illustrator** (professional)
- **Canva** (easy, template-based)
- **Sketch** (Mac only)

## Quick Setup with Placeholder

If you need to launch quickly, you can use a simple placeholder:

1. Create a 1024x1024 canvas
2. Fill with primary color (#3B82F6)
3. Add white paw print emoji or icon in center
4. Export as PNG
5. Save to `assets/images/icon.png`

## Generating All Sizes

After creating the main 1024x1024 icon, use these tools to generate all required sizes:

- **Expo**: Run `npx expo prebuild` - automatically generates all sizes
- **Online Tools**: 
  - https://appicon.co/
  - https://makeappicon.com/
  - https://icon.kitchen/

## App Store Assets (Future)

When ready to publish, you'll also need:

### iOS App Store
- App Preview screenshots (various iPhone sizes)
- App Store icon (1024x1024, no transparency)

### Google Play Store
- Feature graphic (1024x500)
- Screenshots (various Android sizes)
- High-res icon (512x512)

## Current Status

✅ Basic icon placeholder exists
❌ Adaptive icon not configured
❌ Custom splash screen not configured
❌ Notification icon not configured

## Next Steps

1. Design main app icon (1024x1024)
2. Create adaptive icon variant
3. Generate splash screen
4. Create notification icon
5. Update app.json with new asset paths
6. Test on both iOS and Android devices
7. Verify all icons display correctly

## Testing

After adding logos:

```bash
# Clear cache and rebuild
npx expo start -c

# Test on iOS
npx expo run:ios

# Test on Android
npx expo run:android
```

Check:
- [ ] App icon appears on home screen
- [ ] Splash screen displays on launch
- [ ] Notifications show correct icon
- [ ] Icon looks good in light/dark mode
- [ ] Icon is clear at all sizes
