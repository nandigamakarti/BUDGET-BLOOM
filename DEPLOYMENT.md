# Deploying BudgetBloom to Render

This guide provides instructions for deploying the BudgetBloom application to Render.

## Prerequisites

- A [Render](https://render.com) account
- Your Supabase project set up and configured

## Deployment Steps

### Option 1: Deploy via Render Dashboard (Manual)

1. Log in to your Render account
2. Click "New" and select "Static Site"
3. Connect your GitHub repository or upload your code
4. Fill in the following details:
   - **Name**: BudgetBloom (or your preferred name)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Add the following environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
6. Click "Create Static Site"

### Option 2: Deploy via render.yaml (Automated)

1. Ensure the `render.yaml` file is in your repository
2. Log in to your Render account
3. Click "New" and select "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file and set up your services
6. Add your environment variables in the Render dashboard

## Environment Variables

Make sure to set these environment variables in your Render dashboard:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Post-Deployment

After deployment, you should:

1. Verify that your site is working correctly
2. Check that the Supabase connection is functioning
3. Test user authentication and other features

## Troubleshooting

If you encounter issues:

1. Check the build logs in the Render dashboard
2. Verify your environment variables are set correctly
3. Ensure your Supabase project is properly configured

## Security Notes

- Never commit your actual `.env` file to version control
- Use the `.env.example` file as a template for required variables
- Consider setting up a production-specific Supabase project for better security
