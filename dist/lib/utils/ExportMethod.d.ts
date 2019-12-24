export declare const EXPORTED_METHOD: unique symbol;
export declare const EXPORTED_METHOD_PROPS: unique symbol;
/**
 * ExportMethod - is Decorator (annotation). for use in remote implementation of base-client-js.
 * Which grant access for call remote method.
 * if method not annotated. we get 'Access forbidden' error message.
 */
export interface ExportMethodProps {
    public: boolean;
}
export declare const ExportMethod: <T>(props?: ExportMethodProps | undefined) => (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => void;
