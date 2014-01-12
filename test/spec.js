(function () {
  'use strict';

  var should = require('should');
  var sinon = require('sinon');
  var expectRequire = require('a').expectRequire;

  var fs = require('fs');
  var path = require('path');
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
      var readdirStub;

      beforeEach(function () {
        modules = new Modules();
        readdirStub = sinon.stub(fs, 'readdirSync');
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
        var statStub;
        var module1, module2;

        beforeEach(function () {
          readdirStub.withArgs(__dirname + '/testDir').returns(['.', '..', 'module1.js', 'wrong.html', 'module2.js', 'subDir']);
          statStub = sinon.stub(fs, 'statSync').returns({isDirectory: function () { return false; }});
          statStub.withArgs(__dirname + '/testDir/subDir').returns({isDirectory: function () { return true; }});
          module1 = {};
          module2 = {};
        });

        describe('not recursive', function () {
          it('should require every .js file in the given folder', function () {
            expectRequire(__dirname + '/testDir/module1.js').return(module1);
            expectRequire(__dirname + '/testDir/module2.js').return(module2);
            // requiring ., .. or wrong.html would throw "Cannot find module" error
            modules.addDir('./testDir');
          });

          it('should add the required modules as type "factory" to the object', function () {
            expectRequire(__dirname + '/testDir/module1.js').return(module1);
            expectRequire(__dirname + '/testDir/module2.js').return(module2);
            modules.addDir('./testDir');
            modules.module1.should.be.an.Array;
            modules.module1[0].should.equal('factory');
            modules.module1[1].should.equal(module1);
            modules.module2.should.be.an.Array;
            modules.module2[0].should.equal('factory');
            modules.module2[1].should.equal(module2);
          });
        });

        describe('recursive', function () {
          var module3;

          beforeEach(function () {
            module3 = {};
            readdirStub.withArgs(__dirname + '/testDir/subDir').returns(['.', '..', 'module3.js']);
          });

          it('should require every .js file in the given folder and its subfolders', function () {
            expectRequire(__dirname + '/testDir/module1.js').return(module1);
            expectRequire(__dirname + '/testDir/module2.js').return(module2);
            expectRequire(__dirname + '/testDir/subDir/module3.js').return(module3);
            modules.addDir('./testDir', true);
          });

          it('should add the required modules from subdirectories as type "factory" to the object', function () {
            expectRequire(__dirname + '/testDir/module1.js').return(module1);
            expectRequire(__dirname + '/testDir/module2.js').return(module2);
            expectRequire(__dirname + '/testDir/subDir/module3.js').return(module3);
            modules.addDir('./testDir', true);
            modules.module3.should.be.an.Array;
            modules.module3[0].should.equal('factory');
            modules.module3[1].should.equal(module3);
          });
        });

        afterEach(function () {
          fs.statSync.restore();
        });
      });

      describe('.addNodeModules()', function () {
        var expressModule = {};
        var mochaModule = {};

        describe('without descriptor', function () {
          beforeEach(function () {
            readdirStub.withArgs(__dirname + '/node_modules').returns(['.', '..', 'express', 'mocha']);
          });

          it('should require all entries in node_modules and add them as values', function () {
            expectRequire(__dirname + '/node_modules/express').return(expressModule);
            expectRequire(__dirname + '/node_modules/mocha').return(mochaModule);
            modules.addNodeModules();
            modules.should.have.properties('express', 'mocha');
            modules.express[0].should.equal('value');
            modules.express[1].should.equal(expressModule);
            modules.mocha[0].should.equal('value');
            modules.mocha[1].should.equal(mochaModule);
          });
        });

        describe('with string descriptor', function () {
          beforeEach(function () {
            readdirStub.withArgs(path.normalize(__dirname + '/../node_modules')).returns(['.', '..', 'express', 'mocha']);
          });

          it('should require all entries in the path specified by the string descriptor and add them as values', function () {
            expectRequire(path.normalize(__dirname + '/../node_modules/express')).return(expressModule);
            expectRequire(path.normalize(__dirname + '/../node_modules/mocha')).return(mochaModule);
            modules.addNodeModules('../node_modules');
            modules.should.have.properties('express', 'mocha');
            modules.express[0].should.equal('value');
            modules.express[1].should.equal(expressModule);
            modules.mocha[0].should.equal('value');
            modules.mocha[1].should.equal(mochaModule);
          });
        });

        describe('with array descriptor', function () {
          it('should require every array entry as a module and add it as a value', function () {
            expectRequire(__dirname + '/node_modules/express').return(expressModule);
            expectRequire(__dirname + '/node_modules/mocha').return(mochaModule);
            modules.addNodeModules(['express', 'mocha']);
            modules.should.have.properties('express', 'mocha');
            modules.express[0].should.equal('value');
            modules.express[1].should.equal(expressModule);
            modules.mocha[0].should.equal('value');
            modules.mocha[1].should.equal(mochaModule);
          });
        });
      });

      afterEach(function () {
        fs.readdirSync.restore();
      });
    });
  });

}());
