// Import polyfills
import { TextEncoder, TextDecoder } from 'util';
import {
  ReadableStream as PolyfillReadableStream,
  WritableStream as PolyfillWritableStream,
  TransformStream as PolyfillTransformStream,
} from 'web-streams-polyfill';

// Global mock for BroadcastChannel before any test runs
class MockBroadcastChannel {
  channel: string;

  constructor(channel: string) {
    this.channel = channel;
  }

  postMessage(_message: any) {}
  close() {}
  addEventListener(_type: string, _listener: any) {}
  removeEventListener(_type: string, _listener: any) {}
}

// Apply all necessary global mocks and polyfills
// This must run before any imports that might use these APIs
global.BroadcastChannel = MockBroadcastChannel as any;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = PolyfillReadableStream as any;
global.WritableStream = PolyfillWritableStream as any;
global.TransformStream = PolyfillTransformStream as any;

// Mock window object for browser APIs
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
