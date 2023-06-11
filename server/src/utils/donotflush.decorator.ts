export function DoNotFlush(): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    descriptor.value.doNotFlush = true;
    return descriptor;
  };
}
