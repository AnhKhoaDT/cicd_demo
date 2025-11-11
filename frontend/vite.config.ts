import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Allow using process.env without adding @types/node
declare const process: any;

// For GitHub Pages project site, set base to "/cicd_demo/" only when GITHUB_PAGES=true
// Local dev and other hosts should use base "/"
export default defineConfig(() => {
  const isGitHubPages = process.env.GITHUB_PAGES === 'true';
  const base = isGitHubPages ? '/cicd_demo/' : '/';
  return {
    base,
    plugins: [react()],
  };
});
