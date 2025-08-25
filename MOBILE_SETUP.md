# QYK Mobile App Setup Guide

This guide will help you deploy your QYK app as a native mobile application for Android and iOS using Capacitor.

## Prerequisites

- Node.js and npm installed
- Git installed
- For Android: Android Studio
- For iOS: macOS with Xcode installed

## Setup Instructions

### 1. Export and Clone the Project

1. Click the "Export to Github" button in Lovable to transfer your project to your own GitHub repository
2. Clone the project to your local machine:
   ```bash
   git clone [your-github-repo-url]
   cd qykapp
   ```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Mobile Platforms

For Android:
```bash
npx cap add android
```

For iOS:
```bash
npx cap add ios
```

### 4. Build and Sync

```bash
npm run build
npx cap sync
```

### 5. Run the App

For Android:
```bash
npx cap run android
```

For iOS:
```bash
npx cap run ios
```

## Icon Configuration

The app now includes properly sized launcher icons:
- 48x48, 72x72, 96x96, 144x144, 192x192, 512x512, 1024x1024 px versions
- Icons are automatically configured for adaptive icons on Android
- iOS icons will be properly rounded and sized

## Key Features Configured

✅ **Safe Area Support**: All screens properly handle notches and status bars
✅ **Proper Navigation**: Forward/back buttons in title widgets (no bottom nav)
✅ **Theme-aware Outlines**: Posts show colored borders matching current theme
✅ **Custom Dialogs**: No more browser prompts, all UI follows app theme
✅ **Launcher Icons**: Professional rounded icons for all screen densities

## Hot Reload for Development

The Capacitor configuration includes hot reload support, so changes made in Lovable will automatically reflect in your mobile app during development.

## Deployment

For production deployment:
1. Update the server URL in `capacitor.config.ts` to your production domain
2. Build the app: `npm run build`
3. Sync changes: `npx cap sync`
4. Generate signed APK/AAB for Android or submit to App Store for iOS

## Troubleshooting

If you encounter issues:
1. Make sure all dependencies are installed: `npm install`
2. Clean and rebuild: `npm run build && npx cap sync`
3. For Android: Ensure Android Studio and SDK are properly configured
4. For iOS: Ensure Xcode command line tools are installed

## Support

For more information about Capacitor and mobile development, visit:
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Lovable Mobile Development Blog](https://lovable.dev/blogs/TODO)

---

Your QYK app is now ready for mobile deployment! 📱