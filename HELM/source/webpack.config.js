const path = require('path');
const packageName = path.parse(require('./package.json').name).name.toLowerCase().replace(/-/g, '');

const TerserWebpackPlugin = require('terser-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

const mode = process.env.NODE_ENV ?? 'production';
if (mode !== 'production')
  console.warn(`Building '${packageName}' in '${mode}' mode.`);

module.exports = {
  mode: mode,
  entry: {
    package: ['./src/package.ts'],
  },
  resolve: {
    fallback: {'url': false},
    extensions: ['.ts', '.tsx', '.js', '.wasm', '.mjs', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/, enforce: 'pre', use: ['source-map-loader'],
        exclude: (path) => { return /node_modules/.test(path) && !/@datagrok-libraries/.test(path); },
      },
      {test: /\.ts(x?)$/, use: 'ts-loader', exclude: /node_modules/},
      {test: /\.css$/, use: ['style-loader', 'css-loader']},
    ],
  },
  plugins: [new FileManagerPlugin({
    events: {onStart: {delete: ['./dist/*']}},
  })],
  devtool: 'source-map',
  optimization: {
    minimize: mode === 'production',
    minimizer: [new TerserWebpackPlugin({extractComments: false})],
  },
  output: {
    filename: '[name].js',
    library: packageName,
    libraryTarget: 'var',
    path: path.resolve(__dirname, 'dist'),
  },
};
