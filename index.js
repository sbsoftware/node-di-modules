(function () {
  'use strict';

  var fs = require('fs');

  function Modules() {
  }

  Modules.prototype.add = function (name, type, module) {
    this[name] = [type, module];
  };

  Modules.prototype.addDir = function (dirPath, recursive) {
    var that = this;
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

  module.exports = Modules;

}());
