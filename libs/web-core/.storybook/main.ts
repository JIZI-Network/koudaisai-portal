import type {StorybookConfig} from '@storybook/react-vite';

import {nxViteTsPaths} from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import {mergeConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import {patchCssModules} from "vite-css-modules";
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

const config: StorybookConfig = {
  stories: ['../src/components/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [react(), nxViteTsPaths(), tsconfigPaths(), patchCssModules(), rollupNodePolyFill()],
      resolve: {
        alias: {
          '@': '../src',
          'crypto': 'crypto-browserify'
        }
      },
      define: {
        global: 'globalThis',
      },
      optimizeDeps: {
        include: ['crypto-browserify'],
      },
      css: {
        module: {}
      }
    }),
};

export default config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs
