
var Module;

if (typeof Module === 'undefined') Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');

if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {
 var loadPackage = function(metadata) {

    var PACKAGE_PATH;
    if (typeof window === 'object') {
      PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
    } else if (typeof location !== 'undefined') {
      // worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
    } else {
      throw 'using preloaded data can only be done on a web page or in a web worker';
    }
    var PACKAGE_NAME = 'game.data';
    var REMOTE_PACKAGE_BASE = 'game.data';
    if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
      Module['locateFile'] = Module['locateFilePackage'];
      Module.printErr('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
    }
    var REMOTE_PACKAGE_NAME = typeof Module['locateFile'] === 'function' ?
                              Module['locateFile'](REMOTE_PACKAGE_BASE) :
                              ((Module['filePackagePrefixURL'] || '') + REMOTE_PACKAGE_BASE);
  
    var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
    var PACKAGE_UUID = metadata.package_uuid;
  
    function fetchRemotePackage(packageName, packageSize, callback, errback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', packageName, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function(event) {
        var url = packageName;
        var size = packageSize;
        if (event.total) size = event.total;
        if (event.loaded) {
          if (!xhr.addedTotal) {
            xhr.addedTotal = true;
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            Module.dataFileDownloads[url] = {
              loaded: event.loaded,
              total: size
            };
          } else {
            Module.dataFileDownloads[url].loaded = event.loaded;
          }
          var total = 0;
          var loaded = 0;
          var num = 0;
          for (var download in Module.dataFileDownloads) {
          var data = Module.dataFileDownloads[download];
            total += data.total;
            loaded += data.loaded;
            num++;
          }
          total = Math.ceil(total * Module.expectedDataFileDownloads/num);
          if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
        } else if (!Module.dataFileDownloads) {
          if (Module['setStatus']) Module['setStatus']('Downloading data...');
        }
      };
      xhr.onload = function(event) {
        var packageData = xhr.response;
        callback(packageData);
      };
      xhr.send(null);
    };

    function handleError(error) {
      console.error('package error:', error);
    };
  
      var fetched = null, fetchedCallback = null;
      fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);
    
  function runWithFS() {

    function assert(check, msg) {
      if (!check) throw msg + new Error().stack;
    }
Module['FS_createPath']('/', '.vscode', true, true);
Module['FS_createPath']('/', 'docs', true, true);
Module['FS_createPath']('/docs', 'modules', true, true);
Module['FS_createPath']('/docs', 'scripts', true, true);
Module['FS_createPath']('/', 'jumper', true, true);
Module['FS_createPath']('/jumper', 'core', true, true);
Module['FS_createPath']('/jumper', 'search', true, true);
Module['FS_createPath']('/', 'love', true, true);
Module['FS_createPath']('/', 'rockspecs', true, true);
Module['FS_createPath']('/', 'specs', true, true);

    function DataRequest(start, end, crunched, audio) {
      this.start = start;
      this.end = end;
      this.crunched = crunched;
      this.audio = audio;
    }
    DataRequest.prototype = {
      requests: {},
      open: function(mode, name) {
        this.name = name;
        this.requests[name] = this;
        Module['addRunDependency']('fp ' + this.name);
      },
      send: function() {},
      onload: function() {
        var byteArray = this.byteArray.subarray(this.start, this.end);

          this.finish(byteArray);

      },
      finish: function(byteArray) {
        var that = this;

        Module['FS_createDataFile'](this.name, null, byteArray, true, true, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
        Module['removeRunDependency']('fp ' + that.name);

        this.requests[this.name] = null;
      },
    };

        var files = metadata.files;
        for (i = 0; i < files.length; ++i) {
          new DataRequest(files[i].start, files[i].end, files[i].crunched, files[i].audio).open('GET', files[i].filename);
        }

  
    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
        // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though
        // (we may be allocating before malloc is ready, during startup).
        if (Module['SPLIT_MEMORY']) Module.printErr('warning: you should run the file packager with --no-heap-copy when SPLIT_MEMORY is used, otherwise copying into the heap may fail due to the splitting');
        var ptr = Module['getMemory'](byteArray.length);
        Module['HEAPU8'].set(byteArray, ptr);
        DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
  
          var files = metadata.files;
          for (i = 0; i < files.length; ++i) {
            DataRequest.prototype.requests[files[i].filename].onload();
          }
              Module['removeRunDependency']('datafile_game.data');

    };
    Module['addRunDependency']('datafile_game.data');
  
    if (!Module.preloadResults) Module.preloadResults = {};
  
      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }
    
  }
  if (Module['calledRun']) {
    runWithFS();
  } else {
    if (!Module['preRun']) Module['preRun'] = [];
    Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
  }

 }
 loadPackage({"files": [{"audio": 0, "start": 0, "crunched": 0, "end": 5594, "filename": "/actions.lua"}, {"audio": 0, "start": 5594, "crunched": 0, "end": 5898, "filename": "/adventureplusplus.lsln"}, {"audio": 0, "start": 5898, "crunched": 0, "end": 14325, "filename": "/anim8.lua"}, {"audio": 0, "start": 14325, "crunched": 0, "end": 16663, "filename": "/app2.luaproj"}, {"audio": 0, "start": 16663, "crunched": 0, "end": 19065, "filename": "/art.lua"}, {"audio": 0, "start": 19065, "crunched": 0, "end": 37902, "filename": "/businessof ragespritesheet (2).png"}, {"audio": 0, "start": 37902, "crunched": 0, "end": 56739, "filename": "/businessof ragespritesheet.png"}, {"audio": 0, "start": 56739, "crunched": 0, "end": 60221, "filename": "/buttons.lua"}, {"audio": 0, "start": 60221, "crunched": 0, "end": 68598, "filename": "/chats.lua"}, {"audio": 0, "start": 68598, "crunched": 0, "end": 76694, "filename": "/collision (2).png"}, {"audio": 0, "start": 76694, "crunched": 0, "end": 84790, "filename": "/collision.png"}, {"audio": 0, "start": 84790, "crunched": 0, "end": 86241, "filename": "/conf.lua"}, {"audio": 0, "start": 86241, "crunched": 0, "end": 90361, "filename": "/entities (Dave-HP's conflicted copy 2017-04-05).lua"}, {"audio": 0, "start": 90361, "crunched": 0, "end": 105750, "filename": "/entities.lua"}, {"audio": 0, "start": 105750, "crunched": 0, "end": 113337, "filename": "/events.lua"}, {"audio": 0, "start": 113337, "crunched": 0, "end": 113637, "filename": "/fileutility.lua"}, {"audio": 0, "start": 113637, "crunched": 0, "end": 119007, "filename": "/flux.lua"}, {"audio": 0, "start": 119007, "crunched": 0, "end": 120875, "filename": "/logfile.txt"}, {"audio": 0, "start": 120875, "crunched": 0, "end": 125481, "filename": "/logic.lua"}, {"audio": 0, "start": 125481, "crunched": 0, "end": 144742, "filename": "/lovebird.lua"}, {"audio": 0, "start": 144742, "crunched": 0, "end": 147410, "filename": "/main.lua"}, {"audio": 0, "start": 147410, "crunched": 0, "end": 177374, "filename": "/npcs.png"}, {"audio": 0, "start": 177374, "crunched": 0, "end": 178390, "filename": "/playeractions.lua"}, {"audio": 0, "start": 178390, "crunched": 0, "end": 196687, "filename": "/README.md"}, {"audio": 0, "start": 196687, "crunched": 0, "end": 198115, "filename": "/script language.txt"}, {"audio": 0, "start": 198115, "crunched": 0, "end": 202308, "filename": "/scriptfile.txt"}, {"audio": 0, "start": 202308, "crunched": 0, "end": 256167, "filename": "/SNES - Super Mario World - Mario.png"}, {"audio": 0, "start": 256167, "crunched": 0, "end": 269352, "filename": "/spec.lua"}, {"audio": 0, "start": 269352, "crunched": 0, "end": 307915, "filename": "/Standard sprites upd.png"}, {"audio": 0, "start": 307915, "crunched": 0, "end": 313284, "filename": "/strong.lua"}, {"audio": 0, "start": 313284, "crunched": 0, "end": 313701, "filename": "/ui.lua"}, {"audio": 0, "start": 313701, "crunched": 0, "end": 314972, "filename": "/utility.lua"}, {"audio": 0, "start": 314972, "crunched": 0, "end": 318038, "filename": "/variables.lua"}, {"audio": 0, "start": 318038, "crunched": 0, "end": 324208, "filename": "/version_history.md"}, {"audio": 0, "start": 324208, "crunched": 0, "end": 324287, "filename": "/.vscode/settings.json"}, {"audio": 0, "start": 324287, "crunched": 0, "end": 328815, "filename": "/docs/index.html"}, {"audio": 0, "start": 328815, "crunched": 0, "end": 334736, "filename": "/docs/ldoc.css"}, {"audio": 0, "start": 334736, "crunched": 0, "end": 341858, "filename": "/docs/modules/jumper.core.bheap.html"}, {"audio": 0, "start": 341858, "crunched": 0, "end": 350643, "filename": "/docs/modules/jumper.core.heuristics.html"}, {"audio": 0, "start": 350643, "crunched": 0, "end": 355956, "filename": "/docs/modules/jumper.core.node.html"}, {"audio": 0, "start": 355956, "crunched": 0, "end": 364823, "filename": "/docs/modules/jumper.core.path.html"}, {"audio": 0, "start": 364823, "crunched": 0, "end": 383653, "filename": "/docs/modules/jumper.grid.html"}, {"audio": 0, "start": 383653, "crunched": 0, "end": 402920, "filename": "/docs/modules/jumper.pathfinder.html"}, {"audio": 0, "start": 402920, "crunched": 0, "end": 405340, "filename": "/docs/scripts/jumper.search.astar.html"}, {"audio": 0, "start": 405340, "crunched": 0, "end": 407806, "filename": "/docs/scripts/jumper.search.bfs.html"}, {"audio": 0, "start": 407806, "crunched": 0, "end": 410266, "filename": "/docs/scripts/jumper.search.dfs.html"}, {"audio": 0, "start": 410266, "crunched": 0, "end": 412709, "filename": "/docs/scripts/jumper.search.dijkstra.html"}, {"audio": 0, "start": 412709, "crunched": 0, "end": 415877, "filename": "/docs/scripts/jumper.search.jps.html"}, {"audio": 0, "start": 415877, "crunched": 0, "end": 418336, "filename": "/docs/scripts/jumper.search.thetastar.html"}, {"audio": 0, "start": 418336, "crunched": 0, "end": 434179, "filename": "/jumper/grid (2).lua"}, {"audio": 0, "start": 434179, "crunched": 0, "end": 450828, "filename": "/jumper/grid.lua"}, {"audio": 0, "start": 450828, "crunched": 0, "end": 465341, "filename": "/jumper/pathfinder (2).lua"}, {"audio": 0, "start": 465341, "crunched": 0, "end": 478433, "filename": "/jumper/pathfinder.lua"}, {"audio": 0, "start": 478433, "crunched": 0, "end": 480998, "filename": "/jumper/core/assert.lua"}, {"audio": 0, "start": 480998, "crunched": 0, "end": 486502, "filename": "/jumper/core/bheap.lua"}, {"audio": 0, "start": 486502, "crunched": 0, "end": 491897, "filename": "/jumper/core/heuristics.lua"}, {"audio": 0, "start": 491897, "crunched": 0, "end": 492763, "filename": "/jumper/core/lookuptable.lua"}, {"audio": 0, "start": 492763, "crunched": 0, "end": 495559, "filename": "/jumper/core/node.lua"}, {"audio": 0, "start": 495559, "crunched": 0, "end": 500300, "filename": "/jumper/core/path.lua"}, {"audio": 0, "start": 500300, "crunched": 0, "end": 503975, "filename": "/jumper/core/utils.lua"}, {"audio": 0, "start": 503975, "crunched": 0, "end": 507643, "filename": "/jumper/search/astar.lua"}, {"audio": 0, "start": 507643, "crunched": 0, "end": 510212, "filename": "/jumper/search/bfs.lua"}, {"audio": 0, "start": 510212, "crunched": 0, "end": 512771, "filename": "/jumper/search/dfs.lua"}, {"audio": 0, "start": 512771, "crunched": 0, "end": 514629, "filename": "/jumper/search/dijkstra.lua"}, {"audio": 0, "start": 514629, "crunched": 0, "end": 528976, "filename": "/jumper/search/jps.lua"}, {"audio": 0, "start": 528976, "crunched": 0, "end": 531007, "filename": "/jumper/search/thetastar.lua"}, {"audio": 0, "start": 531007, "crunched": 0, "end": 537042, "filename": "/love/screen (2).lua"}, {"audio": 0, "start": 537042, "crunched": 0, "end": 543077, "filename": "/love/screen.lua"}, {"audio": 0, "start": 543077, "crunched": 0, "end": 544082, "filename": "/rockspecs/jumper-1.6-2.rockspec"}, {"audio": 0, "start": 544082, "crunched": 0, "end": 545093, "filename": "/rockspecs/jumper-1.6.3-1.rockspec"}, {"audio": 0, "start": 545093, "crunched": 0, "end": 546347, "filename": "/rockspecs/jumper-1.7.0-1.rockspec"}, {"audio": 0, "start": 546347, "crunched": 0, "end": 547795, "filename": "/rockspecs/jumper-1.8.0.rockspec"}, {"audio": 0, "start": 547795, "crunched": 0, "end": 549257, "filename": "/rockspecs/jumper-1.8.1-1.rockspec"}, {"audio": 0, "start": 549257, "crunched": 0, "end": 552467, "filename": "/specs/bheap_specs.lua"}, {"audio": 0, "start": 552467, "crunched": 0, "end": 562355, "filename": "/specs/grid_specs.lua"}, {"audio": 0, "start": 562355, "crunched": 0, "end": 565179, "filename": "/specs/heuristics_specs.lua"}, {"audio": 0, "start": 565179, "crunched": 0, "end": 565906, "filename": "/specs/node_specs.lua"}, {"audio": 0, "start": 565906, "crunched": 0, "end": 573911, "filename": "/specs/pathfinder_specs.lua"}, {"audio": 0, "start": 573911, "crunched": 0, "end": 576349, "filename": "/specs/path_specs.lua"}], "remote_package_size": 576349, "package_uuid": "916d01c7-fe51-46a5-8d71-7235b8f3c051"});

})();
