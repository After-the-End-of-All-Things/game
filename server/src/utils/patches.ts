import * as jsonpatch from 'fast-json-patch';

export async function getPatchesAfterPropChanges<T>(
  object: T,
  makeChanges: (object: T) => Promise<void>,
) {
  const observer = jsonpatch.observe(object);

  await makeChanges(object);

  const patches = jsonpatch.generate(observer);
  observer.unobserve();

  return patches;
}
