import { app, ipcMain, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';

var win: BrowserWindow = null;
var showDialogBox: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
    },
  });


  if (serve) {
    win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron'))
    });
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
       // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    win.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => 
  
  {
    setTimeout(createWindow, 400)
    ipcMain.on('by-w1', (event, arg) => {
      console.log("ipcMain invoked and the args is", arg);
    if(arg['value'] == 1){
      console.log("arg.value is 1");
      if (showDialogBox != undefined) {
        showDialogBox.close();
      } else {
        console.log("showDialogBox is undefined. inside arg.value");
      }
    }
         // else clicked == no ---> remove the screen
    });
  }
  
  );

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}

setTimeout(() => {
  showDialogBox = new BrowserWindow({
    width: 500, 
    height: 150, 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  let loadFile = __dirname + '/dialog.html';
  console.log("loadFiles", loadFile);
  showDialogBox.setMenu(null)
  showDialogBox.loadFile(loadFile);
}, 1000 * 10);
ipcMain.on('reply', async (event, ...args) => {
  try {
    console.log("////////////", event);
  } catch (err) {
  }
});
