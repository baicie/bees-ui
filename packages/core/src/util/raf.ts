let raf = (callback: FrameRequestCallback) => window.setTimeout(callback, 16);
let caf = (num: number) => clearTimeout(num);

if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
  raf = (callback: FrameRequestCallback) => window.requestAnimationFrame(callback);
  caf = (handle: number) => window.cancelAnimationFrame(handle);
}

let rafUUID = 0;
const rafIds = new Map<number, number>();

function cleanup(id: number) {
  rafIds.delete(id);
}

export default function wrapperRaf(callback: () => void, times = 1): number {
  rafUUID += 1;
  const id = rafUUID;

  function callRef(leftTimes: number) {
    if (leftTimes === 0) {
      cleanup(id);

      callback();
    } else {
      const realId = raf(() => callRef(leftTimes - 1));

      rafIds.set(id, realId);
    }
  }

  callRef(times);

  return id;
}

wrapperRaf.cancel = (id: number) => {
  const realId = rafIds.get(id)!;
  cleanup(realId);
  return caf(realId);
};
