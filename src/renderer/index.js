import {shell} from 'electron';
import domready from 'domready';

domready(() => {
  const webview = document.querySelector('#webview');
  webview.setAttribute('src', process.env.ENDPOINT);

  webview.addEventListener('new-window', event => {
    console.log('try to open new window: %s', event.url);
    event.preventDefault();
    shell.openExternal(event.url);
  });

  if (process.env.NODE_ENV !== 'production') {
    document.querySelector('title').textContent += ` [${process.env.NODE_ENV}]`;
    webview.addEventListener('did-stop-loading', () => {
      webview.openDevTools();
    });
  }
});
