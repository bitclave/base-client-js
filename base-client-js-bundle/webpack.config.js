const path = require('path');

module.exports = {
    entry: './BitclaveBase.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'BitclaveBase.js',
        library: 'BitclaveBase',
        libraryTarget: 'umd2',
        umdNamedDefine: true,
    },
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    },
}
