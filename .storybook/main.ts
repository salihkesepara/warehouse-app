import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  'stories': [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  'addons': [
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  'framework': {
    'name': '@storybook/angular',
    'options': {},
  },
  webpackFinal: async (config) => {
    // Fix NODE_ENV conflict warning
    if (config.plugins) {
      const DefinePlugin = config.plugins.find(
        (plugin: { constructor: { name: string } }) => plugin.constructor.name === 'DefinePlugin',
      );
      if (DefinePlugin) {
        DefinePlugin.definitions = {
          ...DefinePlugin.definitions,
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        };
      }
    }
    return config;
  },
};
export default config;
