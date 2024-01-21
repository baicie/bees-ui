import { createStore } from 'solid-js/store';

const store = createStore<Record<any, any>>({});
const [get, set] = store
export default store;

export function inject() {
  return get
}

export function provide(value: any) {
  return set(value)
}
