// https://www.maizhiying.me/posts/2017/03/01/webpack-babel-ie8-support.html
const path = require('path')
const dayjs = require('dayjs')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const rules = require('./webpack.rules')
module.exports = {
  mode: 'production',
  target: 'web',
  entry: './lib/index.js',
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'main.js',
    chunkFilename: '[name].[hash].js',
    library: 'someLibName',
    libraryTarget: 'umd',
    clean: {
      keep: /vendor/,
    },
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    'prop-types': 'prop-types',
    antd: 'antd',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new webpack.BannerPlugin(`${dayjs().format('YYYY-MM-DD HH:mm:ss')}`),
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
  resolve: {
    modules: ['node_modules', 'src'],
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
          MiniCssExtractPlugin.loader,
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
          MiniCssExtractPlugin.loader,
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
    new webpack.DefinePlugin({}),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new MiniCssExtractPlugin({
      chunkFilename: '[name].[hash].css',
      filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      template: 'template/index.html',
      hash: true,
    }),
  ],
}
