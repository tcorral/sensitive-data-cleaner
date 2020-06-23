# sensitive-data-cleaner

Use this library to remove all sensitive information from your package.json on installing before publishing your app

[![Build Status](https://travis-ci.org/tcorral/sensitive-data-cleaner.svg?branch=master)](https://travis-ci.org/tcorral/sensitive-data-cleaner)
[![NPM Version](https://badge.fury.io/js/sensitive-data-cleaner.svg)](http://badge.fury.io/js/sensitive-data-cleaner)
[![Chat on Gitter](https://badges.gitter.im/tcorral/sensitive-data-cleaner.svg)](https://gitter.im/tcorral/sensitive-data-cleaner?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Installation

*sensitive-data-cleaner* is available as an NPM package. You can install *sensitive-data-cleaner*
in your project's directory as usual:

```bash
$ npm install sensitive-date-cleaner --save-dev
```

## Usage

### sensitive-data-cleaner

*sensitive-data-cleaner* is an utility for your development life cycle so you don't expose any potential information that can be used against you as user names, emails, jenkins or npm private registry paths.

When *sensitive-data-cleaner* exposes a cli called `clean-sensitive-data`

In order to make this tool work we have to provide some arguments.

-------

### Arguments

#### pattern *REQUIRED*

In order to find the package.json files it's needed to provide at least one pattern, but you can provide more than just one pattern.
The pattern accepts wildcards.

##### Single Pattern

```bash
clean-sensitive-data --pattern **/node_modules/**/package.json
```

##### Multiple Patterns

```bash
clean-sensitive-data --pattern **/node_modules/**/package.json --pattern node_modules/@scope/**/package.json
```

##### Using alias

```bash
clean-sensitive-data -p **/node_modules/**/package.json -p node_modules/@scope/**/package.json
```

#### verbose *OPTIONAL*

By default `clean-sensitive-data` only shows a message on finishing processing all the files found using the provided patterns.

On setting *verbose* argument it will show a lot of more information about all the files being processed, package.json information before stripping data, after stripping data...

##### Setting verbose mode

```bash
clean-sensitive-data --verbose --pattern **/node_modules/**/package.json --pattern node_modules/@scope/**/package.json
```

## Build the source
This library has been written using [TypeScript](http://typescriptlang.org).
If you need to use it in your project but you are not working with TypeScript you can always to build the code using ```npm run build``` This command will *lint your code*, *run the tests* and *compile to TypeScript.

## Contributing

This project is maintained by a community of developers. Contributions are welcome and appreciated.
You can find sensitive-data-cleaner on GitHub; feel free to start an issue or create a pull requests:<br>
[https://github.com/tcorral/sensitive-data-cleaner](https://github.com/tcorral/sensitive-data-cleaner)

For more information, read the [contribution guide](https://github.com/tcorral/sensitive-data-cleaner/blob/master/CONTRIBUTING.md).

## License

Copyright (c) 2019 [Tomas Corral](http://github.com/tcorral).<br>
Copyright (c) 2019 [sensitive-data-cleaner Contributors](https://github.com/tcorral/sensitive-data-cleaner/graphs/contributors).<br>
Licensed under the MIT License.
