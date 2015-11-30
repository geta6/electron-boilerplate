import {ipcRenderer} from 'electron';
import domready from 'domready';

setTimeout(() => {
  domready(() => {
    ipcRenderer.on('pong', () => {
      console.log('pong');
    });

    ipcRenderer.send('ping');
  });
}, 1000);
