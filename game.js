
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
 loadPackage({"files": [{"audio": 0, "start": 0, "crunched": 0, "end": 5594, "filename": "/actions.lua"}, {"audio": 0, "start": 5594, "crunched": 0, "end": 5898, "filename": "/adventureplusplus.lsln"}, {"audio": 0, "start": 5898, "crunched": 0, "end": 14325, "filename": "/anim8.lua"}, {"audio": 0, "start": 14325, "crunched": 0, "end": 16663, "filename": "/app2.luaproj"}, {"audio": 0, "start": 16663, "crunched": 0, "end": 19065, "filename": "/art.lua"}, {"audio": 0, "start": 19065, "crunched": 0, "end": 37902, "filename": "/businessof ragespritesheet (2).png"}, {"audio": 0, "start": 37902, "crunched": 0, "end": 56739, "filename": "/businessof ragespritesheet.png"}, {"audio": 0, "start": 56739, "crunched": 0, "end": 60156, "filename": "/buttons.lua"}, {"audio": 0, "start": 60156, "crunched": 0, "end": 68533, "filename": "/chats.lua"}, {"audio": 0, "start": 68533, "crunched": 0, "end": 76629, "filename": "/collision (2).png"}, {"audio": 0, "start": 76629, "crunched": 0, "end": 84725, "filename": "/collision.png"}, {"audio": 0, "start": 84725, "crunched": 0, "end": 86176, "filename": "/conf.lua"}, {"audio": 0, "start": 86176, "crunched": 0, "end": 90296, "filename": "/entities (Dave-HP's conflicted copy 2017-04-05).lua"}, {"audio": 0, "start": 90296, "crunched": 0, "end": 105585, "filename": "/entities.lua"}, {"audio": 0, "start": 105585, "crunched": 0, "end": 113031, "filename": "/events.lua"}, {"audio": 0, "start": 113031, "crunched": 0, "end": 113386, "filename": "/fileutility.lua"}, {"audio": 0, "start": 113386, "crunched": 0, "end": 118756, "filename": "/flux.lua"}, {"audio": 0, "start": 118756, "crunched": 0, "end": 118773, "filename": "/logfile.txt"}, {"audio": 0, "start": 118773, "crunched": 0, "end": 123379, "filename": "/logic.lua"}, {"audio": 0, "start": 123379, "crunched": 0, "end": 142640, "filename": "/lovebird.lua"}, {"audio": 0, "start": 142640, "crunched": 0, "end": 145197, "filename": "/main.lua"}, {"audio": 0, "start": 145197, "crunched": 0, "end": 175161, "filename": "/npcs.png"}, {"audio": 0, "start": 175161, "crunched": 0, "end": 176177, "filename": "/playeractions.lua"}, {"audio": 0, "start": 176177, "crunched": 0, "end": 194474, "filename": "/README.md"}, {"audio": 0, "start": 194474, "crunched": 0, "end": 195902, "filename": "/script language.txt"}, {"audio": 0, "start": 195902, "crunched": 0, "end": 249761, "filename": "/SNES - Super Mario World - Mario.png"}, {"audio": 0, "start": 249761, "crunched": 0, "end": 262946, "filename": "/spec.lua"}, {"audio": 0, "start": 262946, "crunched": 0, "end": 301509, "filename": "/Standard sprites upd.png"}, {"audio": 0, "start": 301509, "crunched": 0, "end": 306878, "filename": "/strong.lua"}, {"audio": 0, "start": 306878, "crunched": 0, "end": 307295, "filename": "/ui.lua"}, {"audio": 0, "start": 307295, "crunched": 0, "end": 308529, "filename": "/utility.lua"}, {"audio": 0, "start": 308529, "crunched": 0, "end": 311463, "filename": "/variables.lua"}, {"audio": 0, "start": 311463, "crunched": 0, "end": 317633, "filename": "/version_history.md"}, {"audio": 0, "start": 317633, "crunched": 0, "end": 317712, "filename": "/.vscode/settings.json"}, {"audio": 0, "start": 317712, "crunched": 0, "end": 322240, "filename": "/docs/index.html"}, {"audio": 0, "start": 322240, "crunched": 0, "end": 328161, "filename": "/docs/ldoc.css"}, {"audio": 0, "start": 328161, "crunched": 0, "end": 335283, "filename": "/docs/modules/jumper.core.bheap.html"}, {"audio": 0, "start": 335283, "crunched": 0, "end": 344068, "filename": "/docs/modules/jumper.core.heuristics.html"}, {"audio": 0, "start": 344068, "crunched": 0, "end": 349381, "filename": "/docs/modules/jumper.core.node.html"}, {"audio": 0, "start": 349381, "crunched": 0, "end": 358248, "filename": "/docs/modules/jumper.core.path.html"}, {"audio": 0, "start": 358248, "crunched": 0, "end": 377078, "filename": "/docs/modules/jumper.grid.html"}, {"audio": 0, "start": 377078, "crunched": 0, "end": 396345, "filename": "/docs/modules/jumper.pathfinder.html"}, {"audio": 0, "start": 396345, "crunched": 0, "end": 398765, "filename": "/docs/scripts/jumper.search.astar.html"}, {"audio": 0, "start": 398765, "crunched": 0, "end": 401231, "filename": "/docs/scripts/jumper.search.bfs.html"}, {"audio": 0, "start": 401231, "crunched": 0, "end": 403691, "filename": "/docs/scripts/jumper.search.dfs.html"}, {"audio": 0, "start": 403691, "crunched": 0, "end": 406134, "filename": "/docs/scripts/jumper.search.dijkstra.html"}, {"audio": 0, "start": 406134, "crunched": 0, "end": 409302, "filename": "/docs/scripts/jumper.search.jps.html"}, {"audio": 0, "start": 409302, "crunched": 0, "end": 411761, "filename": "/docs/scripts/jumper.search.thetastar.html"}, {"audio": 0, "start": 411761, "crunched": 0, "end": 427604, "filename": "/jumper/grid (2).lua"}, {"audio": 0, "start": 427604, "crunched": 0, "end": 444253, "filename": "/jumper/grid.lua"}, {"audio": 0, "start": 444253, "crunched": 0, "end": 458766, "filename": "/jumper/pathfinder (2).lua"}, {"audio": 0, "start": 458766, "crunched": 0, "end": 471858, "filename": "/jumper/pathfinder.lua"}, {"audio": 0, "start": 471858, "crunched": 0, "end": 474423, "filename": "/jumper/core/assert.lua"}, {"audio": 0, "start": 474423, "crunched": 0, "end": 479927, "filename": "/jumper/core/bheap.lua"}, {"audio": 0, "start": 479927, "crunched": 0, "end": 485322, "filename": "/jumper/core/heuristics.lua"}, {"audio": 0, "start": 485322, "crunched": 0, "end": 486188, "filename": "/jumper/core/lookuptable.lua"}, {"audio": 0, "start": 486188, "crunched": 0, "end": 488984, "filename": "/jumper/core/node.lua"}, {"audio": 0, "start": 488984, "crunched": 0, "end": 493725, "filename": "/jumper/core/path.lua"}, {"audio": 0, "start": 493725, "crunched": 0, "end": 497400, "filename": "/jumper/core/utils.lua"}, {"audio": 0, "start": 497400, "crunched": 0, "end": 501068, "filename": "/jumper/search/astar.lua"}, {"audio": 0, "start": 501068, "crunched": 0, "end": 503637, "filename": "/jumper/search/bfs.lua"}, {"audio": 0, "start": 503637, "crunched": 0, "end": 506196, "filename": "/jumper/search/dfs.lua"}, {"audio": 0, "start": 506196, "crunched": 0, "end": 508054, "filename": "/jumper/search/dijkstra.lua"}, {"audio": 0, "start": 508054, "crunched": 0, "end": 522401, "filename": "/jumper/search/jps.lua"}, {"audio": 0, "start": 522401, "crunched": 0, "end": 524432, "filename": "/jumper/search/thetastar.lua"}, {"audio": 0, "start": 524432, "crunched": 0, "end": 530467, "filename": "/love/screen (2).lua"}, {"audio": 0, "start": 530467, "crunched": 0, "end": 536502, "filename": "/love/screen.lua"}, {"audio": 0, "start": 536502, "crunched": 0, "end": 537507, "filename": "/rockspecs/jumper-1.6-2.rockspec"}, {"audio": 0, "start": 537507, "crunched": 0, "end": 538518, "filename": "/rockspecs/jumper-1.6.3-1.rockspec"}, {"audio": 0, "start": 538518, "crunched": 0, "end": 539772, "filename": "/rockspecs/jumper-1.7.0-1.rockspec"}, {"audio": 0, "start": 539772, "crunched": 0, "end": 541220, "filename": "/rockspecs/jumper-1.8.0.rockspec"}, {"audio": 0, "start": 541220, "crunched": 0, "end": 542682, "filename": "/rockspecs/jumper-1.8.1-1.rockspec"}, {"audio": 0, "start": 542682, "crunched": 0, "end": 545892, "filename": "/specs/bheap_specs.lua"}, {"audio": 0, "start": 545892, "crunched": 0, "end": 555780, "filename": "/specs/grid_specs.lua"}, {"audio": 0, "start": 555780, "crunched": 0, "end": 558604, "filename": "/specs/heuristics_specs.lua"}, {"audio": 0, "start": 558604, "crunched": 0, "end": 559331, "filename": "/specs/node_specs.lua"}, {"audio": 0, "start": 559331, "crunched": 0, "end": 567336, "filename": "/specs/pathfinder_specs.lua"}, {"audio": 0, "start": 567336, "crunched": 0, "end": 569774, "filename": "/specs/path_specs.lua"}, {"audio": 0, "start": 569774, "crunched": 0, "end": 573967, "filename": "/scriptfile.txt"}], "remote_package_size": 573967, "package_uuid": "c6cb5d2c-f01c-41a7-bf48-49128b4cecf3"});

})();
