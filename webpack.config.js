const path = require('path');

module.exports = {
    entry: './src/Base.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        filename: 'Base.js',
        path: path.resolve(__dirname, 'dist')
    }
};
