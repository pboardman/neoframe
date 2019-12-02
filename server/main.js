// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')

var api = require('./api');

let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    },
    webPreferences: {
        nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('client/html/index.html')
  mainWindow.setFullScreen(true);
  // mainWindow.loadFile('index2.html')

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  api.on('set_frame', function (data) {
    mainWindow.webContents.send('set_frame', data);
  });

  api.on('random_mode', function (data) {
    mainWindow.webContents.send('random_mode', data);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})
