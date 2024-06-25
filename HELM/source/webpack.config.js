const path = require('path');
const packageName = path.parse(require('./package.json').name).name.toLowerCase().replace(/-/g, '');

const TerserWebpackPlugin = require('terser-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

const extPaths = new class {
  Helm = '../../../../packages/Helm';
}();

const mode = process.env.NODE_ENV ?? 'production';
if (mode !== 'production')
  console.warn(`Building '${packageName}' in '${mode}' mode.`);
const out = `helm-web-editor.${mode}`;

module.exports = {
  mode: mode,
  entry: {
    package: ['./src/package.ts'],
  },
  resolve: {
    fallback: {'url': false},
    extensions: ['.wasm', '.mjs', '.ts', '.tsx', '.js', '.json'],
    alias: {
      'vendor/js-draw-lite': mode === 'production' ?
        path.resolve(__dirname, 'vendor', 'js-draw-lite.production.js') :
        path.resolve(__dirname, 'vendor', 'js-draw-lite.development.js'),
    },
  },
  module: {
    rules: [
      {test: /\.js$/, enforce: 'pre', use: ['source-map-loader'], exclude: /node_modules/},
      {test: /\.ts(x?)$/, use: 'ts-loader', exclude: /node_modules/},
      {test: /\.css$/, use: ['style-loader', 'css-loader']},
    ],
  },
  plugins: [new FileManagerPlugin({
    events: {
      onStart: {delete: ['./dist/*']},
      onEnd: {copy: [{source: './dist/*', destination: `${extPaths.Helm}/vendor/`}]},
    },
  })],
  devtool: mode !== 'production' ? 'inline-source-map' : 'source-map',
  optimization: {
    minimize: mode === 'production',
    minimizer: [new TerserWebpackPlugin({extractComments: false})],
  },
  output: {
    filename: `${out}.js`,
    sourceMapFilename: `${out}.js.map`,
    library: packageName,
    libraryTarget: 'var',
    path: path.resolve(__dirname, 'dist'),
  },
};
