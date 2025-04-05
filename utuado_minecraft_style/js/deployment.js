// deployment.js - Handles deployment setup for Vercel
export class Deployment {
    constructor() {
        this.vercelConfig = {
            version: 2,
            builds: [
                {
                    src: "**/*",
                    use: "@vercel/static"
                }
            ],
            routes: [
                {
                    src: "/(.*)",
                    dest: "/$1"
                }
            ]
        };
    }
    
    // Generate vercel.json file
    generateVercelConfig(outputPath) {
        return JSON.stringify(this.vercelConfig, null, 2);
    }
    
    // Generate deployment instructions
    generateDeploymentInstructions() {
        return `
# Deploying Utuado: Sustainable Future to Vercel

This document provides instructions for deploying the Minecraft-style Utuado game to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI (optional, for command-line deployment)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. Log in to your Vercel account
2. Click "New Project"
3. Import the project from your Git repository or upload the files directly
4. Select "Other" as the framework preset, then choose "Static Site"
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI: \`npm install -g vercel\`
2. Navigate to the project directory
3. Run: \`vercel\`
4. Follow the prompts to log in and configure your project
5. The CLI will automatically detect the project as a static site

## Configuration

The project includes a \`vercel.json\` file with the following configuration:

\`\`\`json
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
\`\`\`

This configuration tells Vercel to:
- Use the static site builder
- Serve all files directly
- Route all requests appropriately

## After Deployment

Once deployed, Vercel will provide you with a URL where your game is accessible.
The URL will look something like: \`https://utuado-game.vercel.app\`

You can share this URL with others to let them play your game.

## Troubleshooting

If you encounter any issues during deployment:

1. Check that all files are included in your deployment
2. Verify that the \`index.html\` file is in the root directory
3. Ensure all JavaScript imports use the correct paths
4. Check the Vercel deployment logs for specific error messages
`;
    }
}
