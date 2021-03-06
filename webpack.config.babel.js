import webpack from 'webpack';
import path from 'path';

const { NODE_ENV } = process.env;

const plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  }),
];

const filename = `redux-super-thunk${NODE_ENV === 'production' ? '.min' : ''}.js`;

export default {
  mode: NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ },
    ],
  },

  entry: [
    './src/index',
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    library: 'ReduxSuperThunk',
    libraryTarget: 'umd',
  },

  optimization: {
    minimize: Boolean(NODE_ENV === 'production'),
  },

  plugins,
};
