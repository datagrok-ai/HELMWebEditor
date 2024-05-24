const path = require('path');
// const FuncGeneratorPlugin = require('datagrok-tools/plugins/func-gen-plugin');
const packageName = path.parse(require('./package.json').name).name.toLowerCase().replace(/-/g, '');

const mode = process.env.NODE_ENV ?? 'production';
if (mode !== 'production') {
  console.warn(`Building '${packageName}' in '${mode}' mode.`);
}

module.exports = {
  mode: mode,
  entry: {
    // test: {
    //   filename: 'package-test.js',
    //   library: {type: 'var', name: `${packageName}_test`},
    //   import: './helm/package-test.ts',
    // },
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
  plugins: [
    // FuncGeneratorPlugin requires ./src path ?
    // new FuncGeneratorPlugin({outputPath: './helm/package.g.ts'}),
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
