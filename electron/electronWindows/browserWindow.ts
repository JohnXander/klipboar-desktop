import { BrowserWindow, ipcMain, screen } from 'electron';
import path from 'node:path';
import { CreateWindowProps } from './windows.types';

let browserWindow: BrowserWindow | null = null;

export const createBrowserWindow: CreateWindowProps = (
  VITE_DEV_SERVER_URL,
  RENDERER_DIST,
  VITE_PUBLIC,
  copiedMetadata,
): void => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  console.log('VITE_PUBLIC', VITE_PUBLIC);

  const x = Math.round(width * 0.8);
  const y = Math.round(height * 0.1);

  browserWindow = new BrowserWindow({
    width: Math.round(width * 0.8),
    height: Math.round(height * 0.9),
    x: x,
    y: y,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'public', 'boarIcon.icns')
  });

  browserWindow.webContents.on('did-finish-load', () => {
    browserWindow?.webContents.send('main-process-message', new Date().toLocaleString());
    browserWindow?.webContents.send('browser-window-created');
  });

  browserWindow.webContents.on('will-navigate', (_event, url) => {
    browserWindow?.webContents.send('url-changed', url);
    copiedMetadata.copiedFrom = url;
  });

  if (VITE_DEV_SERVER_URL) {
    browserWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    browserWindow.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  ipcMain.on('load-url', (_, url: string) => {
    if (url && typeof url === 'string') {
      if (url.startsWith('www.')) {
        url = `https://${url}`;
      }

      if (url.startsWith('https://')) {
        browserWindow?.loadURL(url);
        copiedMetadata.copiedFrom = url;
        
        browserWindow?.once('ready-to-show', () => {
          browserWindow?.show();
          browserWindow?.focus();
        });
      } else {
        console.error('Invalid URL. Only HTTPS URLs are allowed.');
      }
    }
  });

  browserWindow.on('closed', () => {
    browserWindow = null;
  });
};

export const getBrowserWindow = (): BrowserWindow | null => browserWindow;
