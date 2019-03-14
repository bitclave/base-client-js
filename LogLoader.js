module.exports = function (source, map) {
    const separated = source.split('\n');
    const fileName = getFileNameByPath(this.currentRequest);

    for (let i = 0; i < separated.length; i++) {
        const line = separated[i];
        const match = line.match(/(\.log\(|\.info\(|\.debug\(|\.warn\(|\.error\()/g);
        if (match) {
            match.forEach(item => {
                separated[i] = separated[i].replace(item, `${item}\'${fileName}:${i + 1}\ ' + `);
            });
        }
    }
    const toSource = separated.join('\n');
    this.callback(null, toSource, map);
};

const getFileNameByPath = (path) => {
    if (!path || path.length < 1) {
        return path
    }

    const normalizedPath = path.replace(/\\/gi, '/');
    const lastIndex = normalizedPath.lastIndexOf('/');

    if (lastIndex > -1 && lastIndex + 1 < normalizedPath.length) {
        return normalizedPath.substring(lastIndex + 1, normalizedPath.length)
    }

    return path;
};
