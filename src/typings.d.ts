/* SystemJS module definition */

declare interface XMLHttpRequestInitializer extends XMLHttpRequest {
    new(): XMLHttpRequest;
}

declare interface WindowXMLHttpRequest extends Window {
    XMLHttpRequest: XMLHttpRequestInitializer;
}
