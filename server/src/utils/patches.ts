import * as jsonpatch from 'fast-json-patch';

export async function getPatchesAfterPropChanges<T extends object>(
  object: T,
  makeChanges: (object: T) => Promise<void>,
) {
  const observer = jsonpatch.observe<T>(object);

  await makeChanges(object);

  const patches = jsonpatch.generate<T>(observer);
  observer.unobserve();

  return patches;
}
