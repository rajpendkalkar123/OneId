# OneID Favicon Setup

I've updated the HTML and manifest files to use the OneID branding, but you'll need to create the actual favicon files from your OneID logo.

## Steps to create favicon files:

### Option 1: Online Favicon Generator (Recommended)
1. Go to https://favicon.io/favicon-converter/
2. Upload your OneID logo image
3. Download the generated favicon package
4. Replace these files in the `public` folder:
   - `favicon.ico`
   - `logo192.png` 
   - `logo512.png`

### Option 2: Manual Creation
If you have image editing software:
1. Create a 512x512px version of your OneID logo → save as `logo512.png`
2. Create a 192x192px version → save as `logo192.png`
3. Create a 32x32px version → save as `favicon.ico`

## Files Updated:
- ✅ `public/index.html` - Updated title and meta description
- ✅ `public/manifest.json` - Updated app name and theme colors

## What's Changed:
- App name: "OneID - Decentralized Identity"
- Theme color: Purple (#6366f1) to match your UI
- Background color: Dark theme (#1a1a2e)
- Updated description for better SEO

After replacing the favicon files, clear your browser cache or hard refresh (Ctrl+F5) to see the new favicon.
