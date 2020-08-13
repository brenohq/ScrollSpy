const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  devtool: '',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'scrollspy.js',
    path: path.resolve(__dirname, 'build'),
    library: 'ScrollSpy',
    libraryTarget: 'umd',
  },
};