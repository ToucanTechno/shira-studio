import { TextEncoder, TextDecoder } from 'util';
import {
    ReadableStream as PolyfillReadableStream,
    WritableStream as PolyfillWritableStream,
    TransformStream as PolyfillTransformStream,
} from 'web-streams-polyfill';

global.TextEncoder ||= TextEncoder;
global.TextDecoder ||= TextDecoder;

global.ReadableStream ||= PolyfillReadableStream as any;
global.WritableStream ||= PolyfillWritableStream as any;
global.TransformStream ||= PolyfillTransformStream as any;

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
