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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  postMessage(_message: any) {}
  close() {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  addEventListener(_type: string, _listener: any) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  removeEventListener(_type: string, _listener: any) {}
}

// Apply all necessary global mocks and polyfills
// This must run before any imports that might use these APIs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.BroadcastChannel = MockBroadcastChannel as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextEncoder = TextEncoder as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextDecoder = TextDecoder as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.ReadableStream = PolyfillReadableStream as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.WritableStream = PolyfillWritableStream as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
