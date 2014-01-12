(function () {
  'use strict';

  var fs = require('fs');
  var path = require('path');
  var callsite = require('callsite');

  function getFullPath(dirPath) {
    var stack = callsite();
    return path.resolve(path.dirname(stack[2].getFileName()), dirPath);
  }

  function Modules() {
  }

  Modules.prototype.add = function (name, type, module) {
    this[name] = [type, module];
  };

  Modules.prototype.addDir = function (dirPath, recursive) {
    var that = this;
    dirPath = getFullPath(dirPath);
    var files = fs.readdirSync(dirPath);

    files.filter(function (file) {
      return file.indexOf('.js') > 0 || file.indexOf('.') === -1;
    }).forEach(function (file) {
      var path;
      path = dirPath + '/' + file;
      if (fs.statSync(path).isDirectory()) {
        if (recursive) {
          that.addDir(path, recursive);
        }
      } else {
        that.add(file.replace('.js', ''), 'factory', require(path));
      }
    });
  };

  Modules.prototype.addNodeModules = function (descriptor) {
    var that = this;
    var dirPath;

    if (descriptor === undefined || typeof descriptor === 'string') {
      var files;

      dirPath = getFullPath(descriptor || 'node_modules');
      files = fs.readdirSync(dirPath);

      files.filter(function (file) {
        return file.indexOf('.') === -1;
      }).forEach(function (module) {
        that.add(module, 'value', require(dirPath + '/' + module));
      });
    } else if (descriptor.length) {
      dirPath = getFullPath('node_modules');
      descriptor.forEach(function (module) {
        that.add(module, 'value', require(dirPath + '/' + module));
      });
    }
  };

  module.exports = Modules;

}());
