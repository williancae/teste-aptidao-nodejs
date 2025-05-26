import { config } from 'dotenv';

config({ path: '.env.test' });

expect.extend({});

jest.setTimeout(30000);

const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
});

afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
});
