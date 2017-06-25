'use strict';
const fs = require('fs');

const readDirAsync = (dir) => {
  const promise = new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      !!err && resolve()
      resolve(!!files ? files.map(file => dir+'/'+file) : undefined);
    });
  });
  return promise;
};
module.exports = readDirAsync;