export const EXPORTED_METHOD = Symbol('EXPORTED_METHOD');

/**
 * ExportMethod - is Decorator (annotation). for use in remote implementation of base-client-js.
 * Which grant access for call remote method.
 * if method not annotated. we get 'Access forbidden' error message.
 */
export const ExportMethod = <T>() => (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
) => {
    Reflect.defineMetadata(EXPORTED_METHOD, true, target, propertyKey);
};
