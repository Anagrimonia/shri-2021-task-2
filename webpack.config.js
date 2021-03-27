const path = require('path');

module.exports = (env) => {

const mode = env.development ? 'development' : 'production';

  return {
    mode,
    entry: [
      './src/index.ts',
    ],
    plugins: [ ],
    module: {
      rules: [
        {
          test: /\.ts?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options:{
            // disable type checker - we will use it in fork plugin
            transpileOnly: true 
          }
        },
      ],
    },
    resolve: {
      extensions: [ '.ts', '.js' ],
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'build'),
      libraryTarget: 'umd',
      globalObject: 'this'
    },
  }
};