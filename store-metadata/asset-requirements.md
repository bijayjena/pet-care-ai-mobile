# App Store Asset Requirements

Complete list of required assets for App Store and Play Store submission.

## App Icons

### iOS App Icon

**Size**: 1024 x 1024 pixels
**Format**: PNG (no transparency)
**Color Space**: RGB
**Location**: `assets/images/icon.png`

**Requirements**:
- No rounded corners (iOS adds them automatically)
- No transparency
- High quality, recognizable at small sizes
- Consistent with brand

### Android App Icon

**Adaptive Icon**:
- **Foreground**: 1024 x 1024 pixels (PNG with transparency)
- **Background**: 1024 x 1024 pixels (PNG, solid color or pattern)
- **Location**: `assets/images/icon.png`

**Legacy Icon** (optional):
- **Size**: 512 x 512 pixels
- **Format**: PNG

**Requirements**:
- Safe zone: Center 66% of icon
- Foreground can have transparency
- Background should be solid or simple pattern

## Screenshots

### iOS Screenshots

#### iPhone 6.7" Display (iPhone 14 Pro Max, 15 Pro Max)
- **Size**: 1290 x 2796 pixels
- **Format**: PNG or JPEG
- **Quantity**: 3-10 screenshots
- **Required**: Yes

#### iPhone 6.5" Display (iPhone 11 Pro Max, XS Max)
- **Size**: 1242 x 2688 pixels
- **Format**: PNG or JPEG
- **Quantity**: 3-10 screenshots
- **Required**: Yes

#### iPhone 5.5" Display (iPhone 8 Plus, 7 Plus)
- **Size**: 1242 x 2208 pixels
- **Format**: PNG or JPEG
- **Quantity**: 3-10 screenshots
- **Required**: Yes (for older devices)

#### iPad Pro 12.9" (3rd gen)
- **Size**: 2048 x 2732 pixels
- **Format**: PNG or JPEG
- **Quantity**: 3-10 screenshots
- **Required**: If supporting iPad

#### iPad Pro 12.9" (2nd gen)
- **Size**: 2048 x 2732 pixels
- **Format**: PNG or JPEG
- **Quantity**: 3-10 screenshots
- **Required**: If supporting iPad

### Android Screenshots

#### Phone Screenshots
- **Size**: 1080 x 1920 pixels (recommended)
- **Min Size**: 320 x 320 pixels
- **Max Size**: 3840 x 3840 pixels
- **Format**: PNG or JPEG
- **Quantity**: 2-8 screenshots
- **Required**: Yes

#### 7" Tablet Screenshots
- **Size**: 1200 x 1920 pixels (recommended)
- **Format**: PNG or JPEG
- **Quantity**: 2-8 screenshots
- **Required**: Optional

#### 10" Tablet Screenshots
- **Size**: 1600 x 2560 pixels (recommended)
- **Format**: PNG or JPEG
- **Quantity**: 2-8 screenshots
- **Required**: Optional

### Screenshot Content Suggestions

1. **Home Screen** - Show dashboard with pet overview
2. **AI Assistant** - Show AI chat interface
3. **Health Tracking** - Show vaccination/medication tracking
4. **Diet Management** - Show meal tracking
5. **Care Reminders** - Show notification system
6. **Pet Profile** - Show detailed pet information
7. **Emergency Features** - Show emergency contacts

### Screenshot Best Practices

- Use actual app screenshots (no mockups)
- Show key features
- Include captions/text overlays
- Use consistent branding
- Show realistic data
- Avoid clutter
- High quality images
- Localize for different markets

## App Preview Videos (Optional)

### iOS App Preview

- **Duration**: 15-30 seconds
- **Format**: M4V, MP4, or MOV
- **Resolution**: Same as screenshot sizes
- **Aspect Ratio**: Match device
- **File Size**: Max 500 MB
- **Quantity**: 1-3 videos per device size

### Android Promo Video

- **Duration**: 30 seconds - 2 minutes
- **Format**: MP4 or MOV
- **Resolution**: 1920 x 1080 (recommended)
- **File Size**: Max 100 MB
- **Quantity**: 1 video
- **Location**: YouTube (provide URL)

## Feature Graphics

### iOS (Not Required)

iOS doesn't require feature graphics, but you can use them in marketing materials.

### Android Feature Graphic

- **Size**: 1024 x 500 pixels
- **Format**: PNG or JPEG
- **Required**: Yes
- **Usage**: Displayed at top of store listing

**Content Suggestions**:
- App name/logo
- Key features
- Tagline
- Pet imagery
- Brand colors

## Additional Assets

### Splash Screen

- **iOS**: Handled by Expo
- **Android**: Handled by Expo
- **Location**: `assets/images/icon.png`
- **Background Color**: #3B82F6 (defined in app.json)

### Notification Icon

- **Size**: 96 x 96 pixels (Android)
- **Format**: PNG with transparency
- **Color**: White icon on transparent background
- **Location**: `assets/images/icon.png`

### Favicon (Web)

- **Size**: 48 x 48 pixels
- **Format**: PNG
- **Location**: `assets/images/favicon.png`

## Marketing Assets (Optional)

### App Store Marketing

- **Banner**: 2400 x 1260 pixels
- **Social Media**: 1200 x 630 pixels
- **Press Kit**: Various sizes

### Play Store Marketing

- **Promo Graphic**: 180 x 120 pixels (optional)
- **TV Banner**: 1280 x 720 pixels (if supporting Android TV)

## Asset Checklist

### Required for iOS

- [ ] App Icon (1024x1024)
- [ ] iPhone 6.7" Screenshots (3-10)
- [ ] iPhone 6.5" Screenshots (3-10)
- [ ] iPhone 5.5" Screenshots (3-10)
- [ ] iPad Screenshots (if supporting iPad)

### Required for Android

- [ ] App Icon (512x512)
- [ ] Adaptive Icon Foreground (1024x1024)
- [ ] Adaptive Icon Background (1024x1024)
- [ ] Feature Graphic (1024x500)
- [ ] Phone Screenshots (2-8)

### Optional but Recommended

- [ ] App Preview Video (iOS)
- [ ] Promo Video (Android)
- [ ] Tablet Screenshots (Android)
- [ ] Localized Screenshots
- [ ] Marketing Materials

## Tools for Creating Assets

### Design Tools

- **Figma**: Free, web-based design tool
- **Sketch**: Mac-only design tool
- **Adobe Photoshop**: Professional image editing
- **Canva**: Easy-to-use design tool
- **GIMP**: Free alternative to Photoshop

### Screenshot Tools

- **Expo**: Built-in screenshot capture
- **Simulator/Emulator**: Native screenshot tools
- **Fastlane**: Automated screenshot generation
- **Screenshot Maker**: Online tools for adding frames

### Icon Generators

- **App Icon Generator**: https://appicon.co/
- **Expo Icon Generator**: Built into Expo
- **Android Asset Studio**: https://romannurik.github.io/AndroidAssetStudio/

## Asset Organization

```
assets/
├── images/
│   ├── icon.png (1024x1024)
│   └── favicon.png (48x48)
├── screenshots/
│   ├── ios/
│   │   ├── 6.7-inch/
│   │   │   ├── 01-home.png
│   │   │   ├── 02-ai-assistant.png
│   │   │   ├── 03-health-tracking.png
│   │   │   ├── 04-diet-management.png
│   │   │   └── 05-reminders.png
│   │   ├── 6.5-inch/
│   │   └── 5.5-inch/
│   └── android/
│       ├── phone/
│       │   ├── 01-home.png
│       │   ├── 02-ai-assistant.png
│       │   ├── 03-health-tracking.png
│       │   └── 04-diet-management.png
│       └── tablet/
├── feature-graphic/
│   └── android-feature.png (1024x500)
└── videos/
    ├── ios-preview.mp4
    └── android-promo.mp4
```

## Quality Guidelines

### Image Quality

- Use PNG for graphics with transparency
- Use JPEG for photos (smaller file size)
- Optimize file sizes without losing quality
- Use consistent color profiles (sRGB)
- Avoid compression artifacts

### Content Guidelines

- Show actual app functionality
- Use realistic data (not lorem ipsum)
- Avoid showing personal information
- Follow platform design guidelines
- Maintain brand consistency
- Ensure readability at all sizes

### Localization

If supporting multiple languages:
- Translate screenshot text
- Localize UI elements
- Use culturally appropriate imagery
- Provide localized descriptions

## Validation

### Before Submission

- [ ] All images are correct size
- [ ] All images are correct format
- [ ] No transparency in app icon
- [ ] Screenshots show actual app
- [ ] Feature graphic is eye-catching
- [ ] All text is readable
- [ ] Brand colors are consistent
- [ ] No copyrighted content
- [ ] No misleading content
- [ ] High quality, no pixelation

### Testing

- View assets on actual devices
- Check different screen sizes
- Verify colors on different displays
- Test in light and dark modes
- Get feedback from others

## Resources

- **iOS Human Interface Guidelines**: https://developer.apple.com/design/human-interface-guidelines/
- **Android Material Design**: https://material.io/design
- **App Store Screenshot Specs**: https://help.apple.com/app-store-connect/#/devd274dd925
- **Play Store Asset Guidelines**: https://support.google.com/googleplay/android-developer/answer/9866151

## Tips

1. **Start Early**: Creating quality assets takes time
2. **Be Consistent**: Use same style across all assets
3. **Show Value**: Highlight key features in screenshots
4. **Test Everywhere**: View on different devices
5. **Get Feedback**: Ask others for opinions
6. **Iterate**: Refine based on feedback
7. **Stay Updated**: Platform requirements change
8. **Localize**: Support multiple languages if possible

Good luck with your app submission! 🚀
