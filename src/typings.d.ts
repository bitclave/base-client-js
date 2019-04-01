/* SystemJS module definition */

declare interface XMLHttpRequestInitializer extends XMLHttpRequest {
    new(): XMLHttpRequest;
}

declare interface WindowXMLHttpRequest extends Window {
    XMLHttpRequest: XMLHttpRequestInitializer;
}

declare interface JsonObject<T> {
    [key: string]: object | string | number | boolean | Array<object | string | number> | T | undefined;
}
