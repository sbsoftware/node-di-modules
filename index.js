(function () {
  'use strict';

  var fs = require('fs');

  function Modules() {
  }

  Modules.prototype.add = function (name, type, module) {
    this[name] = [type, module];
  };

  Modules.prototype.addDir = function (dirPath) {
    var that = this;
    var files = fs.readdirSync(dirPath);

    files.filter(function (file) {
      return file.indexOf('.js') > 0;
    }).forEach(function (file) {
      file = file.replace('.js', '');
      that.add(file, 'factory', require(dirPath + '/' + file));
    });
  };

  module.exports = Modules;

}());
