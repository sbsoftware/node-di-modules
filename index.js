(function () {
  'use strict';

  function Modules() {
  }

  Modules.prototype.add = function (name, type, module) {
    this[name] = [type, module];
  };

  module.exports = Modules;

}());
