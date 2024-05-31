const path = require('path');
const packageName = path.parse(require('./package.json').name).name.toLowerCase().replace(/-/g, '');

//const CopyPlugin = require('copy-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
// const FuncGeneratorPlugin = require('datagrok-tools/plugins/func-gen-plugin');

const extPaths = new class {
  JSDrawLite = '../../../JSDraw.Lite';
}();

const mode = process.env.NODE_ENV ?? 'production';
if (mode !== 'production') {
  console.warn(`Building '${packageName}' in '${mode}' mode.`);
}

module.exports = {
  mode: mode,
  entry: {
    package: ['./src/package.ts'],
  },
  resolve: {
    fallback: {'url': false},
    extensions: ['.wasm', '.mjs', '.ts', '.tsx', '.js', '.json'],
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
      onStart: {
        copy: [
          {source: `${extPaths.JSDrawLite}/source/web/dist/package.js`, destination: './vendor/js-draw-lite.js'},
        ],
      },
      onEnd: {},
    },
  }),
  ],
  devtool: mode !== 'production' ? 'inline-source-map' : 'source-map',
  externals: {
    'datagrok-api/dg': 'DG',
    'datagrok-api/grok': 'grok',
    'datagrok-api/ui': 'ui',
    'wu': 'wu',
  },
  output: {
    filename: '[name].js',
    library: packageName,
    libraryTarget: 'var',
    path: path.resolve(__dirname, 'dist'),
  },
};
