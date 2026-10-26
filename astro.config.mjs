import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.carsoncobb.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'always',
  },
});
