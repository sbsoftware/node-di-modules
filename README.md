node-di-modules
===============

Simple helper to create module specification objects for node-di


Installation
------------

`npm install di-modules`


Usage
-----

    var di = require('di');
    var modules = new require('di-modules')();

    modules.add('fs', 'value', require('fs'));
    modules.addDir('./src'); // contains myModule.js and yourModule.js, which must be "factory" modules

    new di.Injector([modules]).invoke(fs, myModule, yourModule) {
      ...
    });
