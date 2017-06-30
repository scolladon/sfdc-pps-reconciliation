'use strict';
const metadata = require('./lib/utils/metadata');
const asyncReadFile = require('./lib/utils/async-read-file');
const asyncReadDir = require('./lib/utils/async-read-dir');
const asyncXmlParser = require('./lib/utils/async-xml-parser');
const path = require('path');


const metaMapping = {
  'objects' : {'objectPermissions' : 'object','fieldPermissions' : 'field','recordTypeVisibilities' : 'recordType'},
  'classes' : {'classAccesses' : 'apexClass'},
  'layouts' : {'layoutAssignments' : 'layout'},
  'pages' : {'pageAccesses' : 'apexPage'},
  'tabs' : {'tabVisibilities' : 'tab'}
}

let pps = [
  'permissionsets',
  'profiles'
];

const inFiles = [
  'objects'
];

const inFolders = [
  'classes',
  'layouts',
  'pages',
  'tabs'
];
;
const metadatas = [
  ...inFiles,
  ...inFolders
]

const inDepth = [
  ...pps,
  ...inFiles
];

const directories = [
  ...metadatas,
  ...pps
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
      metadatas.filter(type => metaMapping.hasOwnProperty(type)).forEach(type => {
        const inFile = Object.keys(result[type]);
        for(const pType of pps){
          for(const pName in result[pType]){
            const permissions = result[pType][pName][Object.keys(result[pType][pName])[0]];
            for(const permissionDef in metaMapping[type]) if (permissions.hasOwnProperty(permissionDef)){
              const inPerm = permissions[permissionDef].filter(aDef => aDef.hasOwnProperty(metaMapping[type][permissionDef])).map(aDef => aDef[metaMapping[type][permissionDef]][0]);
              inFile.filter(x => inPerm.indexOf(x) == -1).map(x=>logger(type + '.' + x + ' access definition missing in ' + pName+'.'+pType));
              inPerm.filter(x => inFile.indexOf(x) == -1).map(x=>logger(type + '.' + x + ' is defined in ' + pName+'.'+pType + ' but not present in src'));
            }
          }
        }
      });
    })
    .then(resolve)
    .catch(reject)
  });
  return promise;
};{}