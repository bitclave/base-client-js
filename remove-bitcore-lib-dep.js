const fs = require('fs');
const Path = require('path');

const prefix = (__dirname.indexOf('node_modules') === -1) ? './' : './../../../';
console.log('remove-bitcore-lib-dep started with prefix: ', prefix);

const pathsToClean = [
    Path.resolve(prefix + 'node_modules/bitcore-ecies/node_modules/bitcore-lib'),
    Path.resolve(prefix + 'node_modules/bitcore-message/node_modules/bitcore-lib'),
    Path.resolve(prefix + 'node_modules/bitcore-mnemonic/node_modules/bitcore-lib'),
];

console.log(pathsToClean);

(function () {
    function deleteFolderRecursive(path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file, index) {
                const curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }

    for (let path of pathsToClean) {
        deleteFolderRecursive(path);
    }
})();
