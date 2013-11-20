(function () {
  'use strict';

  var should = require('should');
  var Modules = require('../index.js');

  describe('di-modules', function () {
    describe('constructor', function () {
      it('should return an object with no enumerable properties', function () {
        var modules = new Modules();
        Object.keys(modules).should.have.length(0);
      });
    });
    describe('methods', function () {
      var modules;

      beforeEach(function () {
        modules = new Modules();
      });

      describe('.add()', function () {
        it('should add the module specification to the object', function () {
          var testModule = {};
          modules.add('testModule', 'factory', testModule);
          modules.testModule.should.be.an.Array;
          modules.testModule[0].should.equal('factory');
          modules.testModule[1].should.equal(testModule);
        });
      });
    });
  });

}());
