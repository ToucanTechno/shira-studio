// This file must be JavaScript, not TypeScript, to run before TypeScript is compiled

// Import polyfills from node.js util
const { TextEncoder, TextDecoder } = require('util');

// Mock BroadcastChannel
class MockBroadcastChannel {
  constructor(channel) {
    this.channel = channel;
  }

  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
}

// Set up globals early, before any modules are loaded
global.BroadcastChannel = MockBroadcastChannel;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Web streams polyfill needs to be required, not imported
const webStreamsPolyfill = require('web-streams-polyfill');
global.ReadableStream = webStreamsPolyfill.ReadableStream;
global.WritableStream = webStreamsPolyfill.WritableStream;
global.TransformStream = webStreamsPolyfill.TransformStream;

// Mock window.matchMedia
Object.defineProperty(global, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(), 
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
