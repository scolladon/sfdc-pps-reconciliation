# sfdc-pps-reconciliation

Display inconsistency between sources and profile & permission set

## Getting Started

Works in Unix like system.
Windows is not tested.

### Installing

```
npm install -g sfdc-pps-reconciliation
```

or

```
yarn globally add sfdc-pps-reconciliation
```

## Usage

### Command Line

```
$ spr -h

  Usage: spr [options]

  Display inconsistency between sources and profile & permission set

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    -s, --src                    salesforce src directory path [./src]
```

### Module

```
  var spr = require('sfdc-pps-reconciliation');

  spc({
    'src':'' // salesforce src directory path : ./src
  }, console.log);
```


## Built With

* [commander](https://github.com/tj/commander.js/) - The complete solution for node.js command-line interfaces, inspired by Ruby's commander.
* [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) - XML to JavaScript object converter.

## Versioning

[SemVer](http://semver.org/) is used for versioning.

## Authors

* **Sebastien Colladon** - *Initial work* - [scolladon](https://github.com/scolladon)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
