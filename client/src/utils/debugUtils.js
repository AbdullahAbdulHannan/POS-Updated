// Debug utility to control console logging
const DEBUG_MODE = process.env.NODE_ENV === 'development' && false; // Set to true to enable debug logs

export const debugLog = (...args) => {
  if (DEBUG_MODE) {
    console.log(...args);
  }
};

export const debugError = (...args) => {
  if (DEBUG_MODE) {
    console.error(...args);
  }
};

export const debugWarn = (...args) => {
  if (DEBUG_MODE) {
    console.warn(...args);
  }
};

// Performance monitoring utility
export const measurePerformance = (name, fn) => {
  if (DEBUG_MODE) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return fn();
};

export const measureAsyncPerformance = async (name, fn) => {
  if (DEBUG_MODE) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return await fn();
}; 