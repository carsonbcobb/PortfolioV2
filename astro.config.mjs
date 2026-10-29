import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.carsoncobb.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // agencies.html instead of agencies/index.html. Amplify serves /agencies straight from
    // agencies.html; a folder made it 301 to /agencies/, away from the canonical URL.
    format: 'file',
    inlineStylesheets: 'always',
  },
});
