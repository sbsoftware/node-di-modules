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
    modules.addDir('./src'); // contains myModule.js and yourModule.js, which must be "factory" modules
    modules.addDir('./src2', true); // recursively goes deeper into subdirectories

    // use di as if you filled the modules container manually
    new di.Injector([modules]).invoke(fs, myModule, yourModule) {
      ...
    });

Ideas
-----

* .addDir() could support other module types than 'factory', either by specifying when calling it
or by indicating it in the file name
