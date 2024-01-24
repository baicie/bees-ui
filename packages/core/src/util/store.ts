<<<<<<< HEAD
<<<<<<< HEAD
import { createStore } from 'solid-js/store';

const store = createStore<Record<any, any>>({});
const [get, set] = store
export default store;

export function inject() {
  return get
}

export function provide(value: any) {
  return set(value)
=======
import { createStore } from '@stencil/store';
=======
import { createStore } from 'solid-js/store';
>>>>>>> ebe2878 (feat: button show)

const store = createStore<Record<any, any>>({});
const [get, set] = store
export default store;

export function inject() {
  return get
}

<<<<<<< HEAD
export function provide(key: symbol, value: unknown) {
  return store.set(key as any, value);
>>>>>>> d2b3de8 (refactor: files)
=======
export function provide(value: any) {
  return set(value)
>>>>>>> ebe2878 (feat: button show)
}
