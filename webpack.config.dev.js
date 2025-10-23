const path = require('path')
const fs = require('fs')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const Dotenv = require('dotenv-webpack')

const isDev = fs.readFileSync('./config/build/isDev.html', 'utf8')

module.exports = () => ({
  mode: 'development',
  target: 'web',
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src', 'main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: false,
    filename: 'bundle.[contenthash].js',
    assetModuleFilename: 'assets/[name][ext]',
    publicPath: '/',
  },
  experiments: {
    topLevelAwait: true,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          hotReload: true,
        },
      },
      {
        test: /\.css$/,
        use: ['css-loader'],
      },
      {
        test: /\.(css|scss)$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[path][name].[hash][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'src/favicon.ico',
      filename: 'index.html',
      inject: 'body',
      isDev,
    }),
    new Dotenv({
      path: './.env.stage2',
    }),
    new VueLoaderPlugin(),
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: true,
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: false,
    historyApiFallback: {
      index: '/index.html',
      disableDotRule: true,
    },
    hot: true,
    port: 8080,
    client: {
      overlay: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  resolve: {
    extensions: ['.vue', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  stats: {
    children: true,
    errorDetails: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
})
