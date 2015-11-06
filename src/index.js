'use strict';
var app = require('app');
var BrowserWindow = require('browser-window');
var Menu = require('menu');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
	// if (process.platform != 'darwin'){
		app.quit();
	// }
});

app.on('ready', function() {

	// ブラウザ(Chromium)の起動, 初期画面のロード
	mainWindow = new BrowserWindow({width: 800, height: 600});
	mainWindow.loadUrl('file://' + __dirname + '/index.html');
// アプリケーションメニュー
var menu = Menu.buildFromTemplate([
  {
    label: 'Sample',  /* Menu1 */
    submenu: [
      {
        label: 'About ' + app.getName(),
        selector: "orderFrontStandardAboutPanel:"
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() { app.quit(); }
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
          alert("test")
        }
      },
      {
        label: 'Delete Sheet',
        accelerator: 'CmdOrCtrl+W'
      },
      {
        label: 'Lock Sheet',
        accelerator: 'CmdOrCtrl+M'
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
      }
    ]
  },
  {
    label: 'Find',  /* Menu3 */
    submenu: [
      {
        label: 'Find',
        accelerator: 'CmdOrCtrl+F',
        selector: 'find:'
      },
      {
        label: 'Replace',
        accelerator: 'Shift+CmdOrCtrl+V',
        selector: 'paste'
      }
    ]
  },
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

        }
      },
      {
        label: 'Full Screen',
        accelerator: 'Command+Enter',
        click: function() { mainWindow.setFullScreen(!mainWindow.isFullScreen()); }
      },
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
    ]
  }
]);