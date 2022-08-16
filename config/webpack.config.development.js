const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const dxMock = require('dx-mock')

const rules = require('./webpack.rules')
module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'main.js',
  },
  devtool: 'inline-source-map',
  resolve: {
    modules: ['node_modules', 'lib'],
    fallback: {
      "stream": false,
      "util": false,
      "path": false,
      "buffer": false
    },
  },
  module: {
    rules: rules.concat([
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.join(__dirname, 'postcss.config.js'),
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.join(__dirname, 'postcss.config.js'),
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                relativeUrls: false,
                math: 'always',
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ]),
  },
  plugins: [
    new ESLintPlugin({
      failOnError: true,
    }),
    new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'template/index.html',
    }),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new webpack.DefinePlugin({}),
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname, '..'),
      },
      {
        directory: path.join(__dirname, '../dist'),
      },
    ],
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    hot: true,
    host: '0.0.0.0',
    allowedHosts: 'all',
    onBeforeSetupMiddleware: function (devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined')
      }

      dxMock(devServer.app, { root: path.join(__dirname, '../api') })
    },
    proxy: {
      '/dev': {
        target: '',
        pathRewrite: { '^/dev': '' },
      },
    },
  },
}
