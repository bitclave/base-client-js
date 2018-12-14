const Path = require('path');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

module.exports = {
    entry: './lib/Base.js',
    node: {
      fs: 'empty',
      child_process: 'empty'
  },
    output: {
        filename: 'main.js',
        path: Path.resolve(__dirname, Path.resolve('./lib')),
    },
    plugins: [
        new TypedocWebpackPlugin({
            out: './docs',
            module: 'commonjs',
            target: 'es6',
            exclude: '**/node_modules/**/*.*',
            excludePrivate: true,
            experimentalDecorators: true,
            excludeExternals: true
        }, './src/')
    ]
};
