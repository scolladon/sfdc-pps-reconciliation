'use strict';
const metadata = require('./lib/utils/metadata');
const asyncReadFile = require('./lib/utils/async-read-file');
const asyncReadDir = require('./lib/utils/async-read-dir');
const asyncXmlParser = require('./lib/utils/async-xml-parser');
const path = require('path');

const directories = [
  'applications',
  'classes',
  'customPermissions',
  'dataSources',
  'layouts',
  'objects',
  'pages',
  'permissionsets',
  'profiles',
  'tabs'
];

const inDepth = [
  'objects',
  'permissionsets',
  'profiles'
];

const result = directories.reduce((tab, item) => {
    tab[item] = {};
    return tab;
  }, {}
);

module.exports = (config,logger) => {

  // Check if we have enough config options
  if(typeof config.src === 'undefined' || config.src === null) {
    throw new Error('Not enough config options');
  }

  // The module return this promise
  // This is where the job is done
  const promise = new Promise((resolve, reject) => {
    Promise.all(directories.map(dir => asyncReadDir(config.src+path.sep+dir)))
    .then(files => Promise.all([].concat.apply([], files).filter(file => typeof file != 'undefined' && !file.endsWith('-meta.xml')).map(file => ~inDepth.indexOf(path.basename(path.dirname(file))) ? asyncReadFile(file).then(asyncXmlParser) : {'name':file})))
    .then(files => files.forEach(file => result[path.basename(path.dirname(file.name))][path.basename(file.name.replace(/\.[^/.]+$/, ''))] = file.content))
    .then(()=>{
      console.log(result)
      // TODO treatment with result here;
    })
    .then(resolve)
    .catch(reject)
  });
  return promise;
};{}