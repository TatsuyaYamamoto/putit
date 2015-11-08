'use strict';
var _app    = require('app');
var _browserWindow 
            = require('browser-window');
var _menu   = require('menu');
var _ipc     = require('ipc');

require('crash-reporter').start();

var _mainWindow = null;

_app.on('window-all-closed', function() {
	if (process.platform != 'darwin'){
		_app.quit();
	}
});

_app.on('ready', function() {
    // ブラウザ(Chromium)の起動, 初期画面のロード
    _mainWindow = new _browserWindow({
      width: 800,
      height: 600,
      fullscreen: true
    });
    _mainWindow.loadUrl('file://' + __dirname + '/index.html');
    // _mainWindow.toggleDevTools();
    _mainWindow.on('closed', function() {
        _mainWindow = null;
    });

    _menu.setApplicationMenu(menu);
});

// アプリケーションメニュー ------------------------------------------
var menu = _menu.buildFromTemplate([
  {
    label: 'Sample',  /* Menu1 */
    submenu: [
      {
        label: 'About ' + _app.getName(),
        selector: "orderFrontStandardAboutPanel:"
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() { _app.quit(); }
      },
      {
        label: 'Services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide Electron',
        accelerator: 'Command+H',
        selector: 'hide:'
      }
    ]
  },
  {
    label: 'File',  /* Menu1 */
    submenu: [
      {
        label: 'New Sheet',
        accelerator: 'CmdOrCtrl+N',
        click: function(item, focusedWindow) {
          _mainWindow.webContents.send('newSheet');
        }
      },
      {
        label: 'Copy Sheet',
        accelerator: 'CmdOrCtrl+B',
        click: function(item, focusedWindow) {
          _mainWindow.webContents.send('copySheet');
        }
      },
      {
        label: 'Delete Sheet',
        accelerator: 'CmdOrCtrl+W',
        click: function(item, focusedWindow) {
          _mainWindow.webContents.send('deleteSheet');
        }
      },
      {
        label: 'Lock Sheet',
        accelerator: 'CmdOrCtrl+M',
        click: function(item, focusedWindow) {
          _mainWindow.webContents.send('lockSheet');
        }
      }
    ]
  },
  {
    label: 'Edit',  /* Menu2 */
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        selector: 'undo:'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        selector: 'redo:'
      },
      {type: 'separator'},
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        selector: 'cut:'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        selector: 'copy:'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        selector: 'paste:'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        selector: 'selectAll:'
      }
    ]
  },
  // {
  //   label: 'Find',  /* Menu3 */
  //   submenu: [
  //     {
  //       label: 'Find',
  //       accelerator: 'CmdOrCtrl+F',
  //       selector: 'find:'
  //     },
  //     {
  //       label: 'Replace',
  //       accelerator: 'Shift+CmdOrCtrl+V',
  //       selector: 'replace'
  //     }
  //   ]
  // },
  {
    label: 'View',  /* Menu4 */
    submenu: [
      {
        label: 'Reload', 
        accelerator: 'CmdOrCtrl+R',
        click: function(item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        }
      },
      {
        label: 'SheetList', 
        accelerator: 'CmdOrCtrl+L',
        click: function(item, focusedWindow) {
          _mainWindow.webContents.send('sidrToggle');
        }
      },
      {
        label: 'Full Screen',
        accelerator: 'Command+Enter',
        click: function() { mainWindow.setFullScreen(!mainWindow.isFullScreen()); }
      },
      {
        label: 'Minimize',
        accelerator: 'Command+Shift+Enter',
        role: 'minimize'
      },
    ]
  }
]);