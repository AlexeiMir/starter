const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const path = require('path');

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`



module.exports = {
  entry: path.join(__dirname, 'src', 'index.tsx'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.[contenthash].js',
    assetModuleFilename: path.join('images', '[name].[contenthash][ext]'),
  },
  module: {
      rules: [
        {
          test: /\.ts(x)$/,
          exclude: /node_modules/,
          loader: 'ts-loader'
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.pug$/,
          loader: 'pug-loader',
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        },
        {
        test: /\.svg$/,
        type: 'asset/resource',
        generator: {
        filename: path.join('icons', '[name].[contenthash][ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.png'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      //template: path.join(__dirname, 'src', 'template.html'),
      template: path.join(__dirname, 'src', 'template.pug'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: isProd,
        removeComments: isProd,
        removeRedundantAttributes: isProd,
        useShortDoctype: isProd,
      },
    }),
    new ESLintPlugin(),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: ['dist'],
        },
        onEnd: {
          copy: [
            {
              source: path.join('src', 'static'),
              destination: 'dist',
            },
          ],
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      }),
  ],
    devServer: {
      watchFiles: path.join(__dirname, 'src'),
       port: 9000,
  },
  devtool: isProd ? false : 'source-map',
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              ['svgo', { name: 'preset-default' }],
            ],
          },
        },
      }),
    ],
  },
};