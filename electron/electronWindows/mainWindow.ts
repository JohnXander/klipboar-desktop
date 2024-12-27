import { BrowserWindow, screen, ipcMain } from 'electron';
import path from 'node:path';
import { CreateWindowProps } from './windows.types';

let mainWindow: BrowserWindow | null = null;

export const createMainWindow: CreateWindowProps = (
  VITE_DEV_SERVER_URL,
  RENDERER_DIST,
  VITE_PUBLIC,
  copiedMetadata,
): void => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  console.log('VITE_PUBLIC', VITE_PUBLIC);

  const x = Math.round(width * 0.0);
  const y = Math.round(height * 0.0);

  mainWindow = new BrowserWindow({
    width: Math.round(width * 0.8),
    height: Math.round(height * 1.0),
    x: x,
    y: y,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'public', 'boarIcon.icns')
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  mainWindow.webContents.openDevTools();

  ipcMain.on('clipboard-changed', (_event, clipboardData) => {
    copiedMetadata.copiedText = clipboardData;
    copiedMetadata.copiedAt = new Date().toLocaleString();
  });

  ipcMain.on('clipboard-pasted', () => {
    if (mainWindow && copiedMetadata.copiedText && copiedMetadata.copiedAt) {
      mainWindow.webContents.send(
        'clipboard-pasted',
        { 
          copiedText: copiedMetadata.copiedText, 
          copiedAt: copiedMetadata.copiedAt, 
          copiedFrom: copiedMetadata.copiedFrom 
        }
      );
    }
  });

  mainWindow.on('close', () => {
    if (mainWindow) {
      mainWindow.webContents.send('app-closing');
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

export const getMainWindow = (): BrowserWindow | null => mainWindow;
