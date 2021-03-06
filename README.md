node-di-modules
===============

Simple helper to create module specification objects for node-di.
It gives you two methods to add modules to the container. The first one, .add(), is nothing more than
just setting `modules[moduleName] = [type, module]` manually. The reason why I built this is the second
method, .addDir(), which dynamically requires all \*.js files in the given folder and adds them to the
module container, using the file name as the module name and assuming type = 'factory'.


Installation
------------

`npm install di-modules`


Usage
-----

    var di = require('di');
    var modules = new (require('di-modules'))();

    modules.add('fs', 'value', require('fs'));
    // directory paths must be relative to __dirname of the calling file
    modules.addDir('./src'); // contains myModule.js and yourModule.js, which must be "factory" modules
    modules.addDir('./src2', true); // recursively goes deeper into subdirectories
    // add all node_modules entries (in the same directory as the calling file)
    modules.addNodeModules();
    // add specific modules by name
    modules.addNodeModules(['events', 'express', 'async']);

    // use di as if you filled the modules container manually
    new di.Injector([modules]).invoke(async, fs, events, express, myModule, yourModule) {
      ...
    });

Ideas
-----

* .addDir() could support other module types than 'factory', either by specifying when calling it
or by indicating it in the file name

Changelog
---------

* 0.2.0
  * .addNodeModules()
