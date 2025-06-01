# BudgetBloom - Personal Finance Tracker

BudgetBloom is a modern personal finance tracker application built with React, TypeScript, and Supabase. It features a clean, responsive UI with dark/light mode support and intuitive expense tracking functionality.

## Project info

**Original URL**: https://lovable.dev/projects/2f58818c-9e89-4cdd-8121-fa150befbe06

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2f58818c-9e89-4cdd-8121-fa150befbe06) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Deployment

### Deploying to Render

This project is configured for easy deployment to Render. For detailed instructions, see the [DEPLOYMENT.md](./DEPLOYMENT.md) file.

**Quick Start:**

1. Create a new Static Site on Render
2. Connect your repository
3. Use these settings:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add your environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

Alternatively, you can use the included `render.yaml` file for Blueprint deployments.

### Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials for local development. For production, set these in your Render dashboard.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2f58818c-9e89-4cdd-8121-fa150befbe06) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
