import { ipcRenderer, contextBridge } from 'electron';

document.addEventListener('copy', () => {
  const clipboardData = window.getSelection()?.toString() || '';
  ipcRenderer.send('clipboard-changed', clipboardData);
});

document.addEventListener('cut', () => {
  const clipboardData = window.getSelection()?.toString() || '';
  ipcRenderer.send('clipboard-changed', clipboardData);
});

document.addEventListener('paste', () => {
  setTimeout(() => {
    const clipboardData = window.getSelection()?.toString() || '';
    ipcRenderer.send('clipboard-pasted', clipboardData);
  }, 0);
});

contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
});
