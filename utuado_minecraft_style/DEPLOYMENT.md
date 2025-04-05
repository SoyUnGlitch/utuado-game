# Utuado: Sustainable Future - Deployment Instructions

This document provides instructions for deploying the Minecraft-style version of Utuado: Sustainable Future to Vercel.

## Deployment Files

The following files are included in the deployment package:

- `index.html` - Main HTML file with game structure and UI elements
- `css/style.css` - CSS styles for the game interface
- `js/game-bundle.js` - Consolidated JavaScript file with all game logic
- `vercel.json` - Configuration file for Vercel deployment

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. Create a Vercel account at https://vercel.com if you don't already have one
2. Go to the Vercel dashboard and click "New Project"
3. Import the project from GitHub or upload the files directly
4. When configuring the project:
   - Framework Preset: Select "Other" and then "Static Site"
   - Build and Output Settings: Leave as default
   - Environment Variables: None required
5. Click "Deploy"
6. Vercel will provide you with a URL where your game is accessible (e.g., https://utuado-game.vercel.app)

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Navigate to the project directory:
   ```
   cd /path/to/utuado_game/minecraft_style
   ```

3. Login to Vercel:
   ```
   vercel login
   ```

4. Deploy the project:
   ```
   vercel
   ```

5. Follow the prompts to configure your project:
   - Set up and deploy: Yes
   - Link to existing project: No
   - Project name: utuado-game (or your preferred name)
   - Directory: ./ (current directory)
   - Override settings: No

6. Vercel will provide you with a URL where your game is accessible

## Vercel Configuration

The `vercel.json` file contains the following configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

This configuration tells Vercel to:
- Use the static site builder
- Serve all files directly
- Route all requests appropriately

## After Deployment

Once deployed, your game will be accessible at the URL provided by Vercel. You can share this URL with others to let them play the game.

The game should work on all modern browsers, including mobile browsers, thanks to the optimizations made to improve compatibility and performance.

## Troubleshooting

If you encounter any issues during deployment:

1. Check that all files are included in your deployment
2. Verify that the `index.html` file is in the root directory
3. Ensure all file paths in the HTML file are correct
4. Check the Vercel deployment logs for specific error messages

## Local Testing

Before deployment, you can test the game locally by:

1. Setting up a simple HTTP server:
   ```
   python -m http.server 8000
   ```
   or
   ```
   npx serve
   ```

2. Opening a browser and navigating to:
   ```
   http://localhost:8000
   ```

This will help ensure everything works correctly before deploying to Vercel.
