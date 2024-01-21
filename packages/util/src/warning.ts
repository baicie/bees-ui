let warned: Record<string, boolean> = {};

export function error(valid: boolean, message: string) {
  // Support uglify
  if (process.env.NODE_ENV !== 'production' && !valid && console !== undefined) {
    console.error(`ikun Warning: ${message}`);
  }
}

export function warning(valid: boolean, message: string) {
  // Support uglify
  if (process.env.NODE_ENV !== 'production' && !valid && console !== undefined) {
    console.warn(`ikun Note: ${message}`);
  }
}

export function resetWarned() {
  warned = {};
}

export function call(method: (valid: boolean, message: string) => void, valid: boolean, message: string) {
  if (!valid && !warned[message]) {
    method(false, message);
    warned[message] = true;
  }
}

export function errorOnce(valid: boolean, message: string) {
  call(error, valid, message);
}

export function warningOnce(valid: boolean, message: string) {
  call(warning, valid, message);
}

export default warningOnce;
