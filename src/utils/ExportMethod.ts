export const EXPORTED_METHOD = Symbol('EXPORTED_METHOD');
export const EXPORTED_METHOD_PROPS = Symbol('EXPORTED_METHOD_PROPS');

/**
 * ExportMethod - is Decorator (annotation). for use in remote implementation of base-client-js.
 * Which grant access for call remote method.
 * if method not annotated. we get 'Access forbidden' error message.
 */
export interface ExportMethodProps {
    public: boolean;
}

export const ExportMethod = <T>(props?: ExportMethodProps) => (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
) => {
    Reflect.defineMetadata(EXPORTED_METHOD, true, target, propertyKey);
    Reflect.defineMetadata(EXPORTED_METHOD_PROPS, props, target, propertyKey);
};
