(function () {
  'use strict';

  var should = require('should');
  var sinon = require('sinon');
  var expectRequire = require('a').expectRequire;

  var fs = require('fs');
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

      describe('.addDir()', function () {
        var readdirStub;
        var module1, module2;

        beforeEach(function () {
          readdirStub = sinon.stub(fs, 'readdirSync');
          readdirStub.returns(['.', '..', 'module1.js', 'wrong.html', 'module2.js']);
          module1 = {};
          module2 = {};
          expectRequire('./testDir/module1').return(module1);
          expectRequire('./testDir/module2').return(module2);
        });

        it('should require every .js file in the given folder', function () {
          // requiring ., .. or wrong.html would throw "Cannot find module" error
          modules.addDir('./testDir');
        });

        it('should add the required modules as type "factory" to the object', function () {
          modules.addDir('./testDir');
          modules.module1.should.be.an.Array;
          modules.module1[0].should.equal('factory');
          modules.module1[1].should.equal(module1);
          modules.module2.should.be.an.Array;
          modules.module2[0].should.equal('factory');
          modules.module2[1].should.equal(module2);
        });

        afterEach(function () {
          fs.readdirSync.restore();
        });
      });
    });
  });

}());
