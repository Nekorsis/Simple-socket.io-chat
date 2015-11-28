var path = require('path');
var fs = require('fs');

module.exports = (dataFile) => {
	var pathToData = path.join('.', 'views', 'data');
	var resolvedPath = path.resolve(pathToData);
	var dataPath = resolvedPath + path.sep;
	var dataFilePath = path.resolve(path.join(dataPath, /\.json$/.test(dataFile) && dataFile || dataFile + '.json'));

	if (dataPath !== dataFilePath.slice(0, dataPath.length)) {
		throw new Error('Data path is not in data directory. Abort due potential data disclosure.');
	}

	return JSON.parse(fs.readFileSync(dataFilePath));
};
