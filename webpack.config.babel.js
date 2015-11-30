import util from 'gulp-util';
import chalk from 'chalk';
import merge from 'lodash/object/merge';
import webpack from 'webpack';

const DEBUG = !(process.argv.includes('--release') || process.argv.includes('release')) || process.env.NODE_ENV !== 'production';
const VERBOSE = process.argv.includes('--verbose') || process.argv.includes('verbose');

util.log(chalk.green(`DEBUG:    ${DEBUG ? 'on' : 'off'}`));
util.log(chalk.green(`VERBOSE:  ${VERBOSE ? 'on' : 'off'}`));

const config = {
  output: {
    path: './build',
    libraryTarget: 'commonjs2',
  },

  cache: DEBUG,
  debug: DEBUG,

  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    warnings: VERBOSE,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },

  target: 'node',

  node: {
    __dirname: false,
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.ExternalsPlugin('commonjs', ['electron', 'screen', 'remote']),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.ENDPOINT': JSON.stringify(process.env.ENDPOINT),
    }),
    ...(DEBUG ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: VERBOSE}}),
      new webpack.optimize.AggressiveMergingPlugin(),
    ]),
  ],

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel']},
      {test: /\.json$/, loaders: ['json']},
      {test: /\.styl$/, loaders: ['style', 'css', 'stylus']},
      {test: /\.png$/, loaders: ['url']},
    ],
  },
};

const rendererConfig = merge({}, config, {
  entry: './src/renderer/index.js',

  output: {
    filename: 'bundle.renderer.js',
  },
});

const preloadRendererConfig = merge({}, config, {
  entry: './src/renderer/preload.js',

  output: {
    filename: 'bundle.preload.renderer.js',
  },
});

const mainConfig = merge({}, config, {
  entry: './src/main/index.js',

  output: {
    filename: 'bundle.main.js',
  },
});

export default [rendererConfig, preloadRendererConfig, mainConfig];
