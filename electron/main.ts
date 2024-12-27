import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { createMainWindow } from './electronWindows/mainWindow';
import { createBrowserWindow } from './electronWindows/browserWindow';
import { CopiedMetadata } from './main.types';

process.env.APP_ROOT = path.join(__dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

const copiedMetadata: CopiedMetadata = {
  copiedText: null,
  copiedAt: null,
  copiedFrom: null,
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow(
      VITE_DEV_SERVER_URL, 
      RENDERER_DIST, 
      process.env.VITE_PUBLIC!, 
      copiedMetadata
    );

    createBrowserWindow(
      VITE_DEV_SERVER_URL, 
      RENDERER_DIST, 
      process.env.VITE_PUBLIC!,
      copiedMetadata
    );
  }
});

app.whenReady().then(() => {
  app.dock.setIcon(path.join(__dirname, 'public', 'boarIcon.icns'));
});

app.whenReady().then(() => {
  createMainWindow(
    VITE_DEV_SERVER_URL, 
    RENDERER_DIST, 
    process.env.VITE_PUBLIC!, 
    copiedMetadata
  );

  createBrowserWindow(
    VITE_DEV_SERVER_URL, 
    RENDERER_DIST, 
    process.env.VITE_PUBLIC!,
    copiedMetadata
  );
});
