import 'babel-core/polyfill';
import {app, BrowserWindow, ipcMain, crashReporter} from 'electron';

crashReporter.start();

app.on('window-all-closed', () => app.quit());

app.on('ready', () => {
  const windows = {
    main: new BrowserWindow({width: 1024, height: 768}),
  };

  if (process.env.NODE_ENV !== 'production') {
    windows.main.openDevTools();
  }

  windows.main.webContents.session.clearCache(() => {
    console.log(`Loading "file://${__dirname}/index.html"`);
    windows.main.loadURL(`file://${__dirname}/index.html`);
    windows.main.on('closed', () => delete windows.main);
    windows.main.webContents.on('will-navigate', (event, url) => {
      console.log('WebContents try to navigate %s', url);
      /^file:\/\//.test(url) && event.preventDefault();
    });
  });

  ipcMain.on('print', (event, value) => {
    console.log('print: %s', value);
  });

  ipcMain.on('ping', event => {
    event.sender.send('pong');
  });

  if (process.env.NODE_ENV !== 'production') {
    require('electron-connect').client.create(windows.main);
  }
});
