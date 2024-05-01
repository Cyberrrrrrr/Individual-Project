import { SetStateAction, WritableAtom, atom } from 'jotai';
import debounce from 'lodash.debounce';

export function atomWithLocalStorage<T>(
  key: string,
  initialValue: any,
  adapter?: (value: T) => T,
): WritableAtom<T, [SetStateAction<T>], void> {
  const getInitialValue = () => {
    const item = window.electron.store.get(key);
    if (item !== null && item !== undefined) {
      if (adapter) return adapter(item);
      return item;
    }
    return initialValue;
  };

  const debouncedWrite = debounce(
    (targetKey, value) => {
      window.electron.store.set(targetKey, value);
    },
    750,
    { leading: false, trailing: true },
  );

  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      debouncedWrite(key, nextValue);
    },
  );
  return derivedAtom;
}

export default atomWithLocalStorage;
