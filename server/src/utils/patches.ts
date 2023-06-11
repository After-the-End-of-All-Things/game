import * as jsonpatch from 'fast-json-patch';

export function getPatchesAfterPropChanges<T>(
  object: T,
  makeChanges: (object: T) => void,
) {
  const observer = jsonpatch.observe(object);

  makeChanges(object);

  const patches = jsonpatch.generate(observer);
  observer.unobserve();

  return patches;
}
