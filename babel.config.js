module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['> 1%', 'last 2 versions'],
        },
        modules: false,
      },
    ],
    '@babel/preset-react',
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: true,
            },
          },
        ],
        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
          },
        ],
      ],
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
      ],
    },
    development: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
        'react-refresh/babel',
      ],
    },
    production: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
      ],
    },
  },
}
