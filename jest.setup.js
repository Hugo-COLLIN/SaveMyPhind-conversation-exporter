import '@testing-library/jest-dom';

global.chrome = {
  runtime: {
    getManifest: () => ({
      version: '3.7.2'
    }),
    getURL: (path) => `chrome-extension://mock-extension-id/${path}`,
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn()
    }
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn()
    }
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn()
  }
};
