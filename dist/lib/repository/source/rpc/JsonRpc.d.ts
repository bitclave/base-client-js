import { Primitive } from '../../../utils/types/Primitive';
export declare class JsonRpc {
    readonly jsonrpc: string;
    readonly method: string;
    readonly id: number;
    readonly params: Array<object | Primitive | undefined | null>;
    readonly result?: object | Primitive;
    readonly error?: object | Array<object>;
    static request(id: number, method: string, params: Array<object | Primitive | undefined | null>): JsonRpc;
    static response(id: number, method: string, result?: object | Primitive, error?: object | Array<object>): JsonRpc;
    private constructor();
    getResult<T>(): T;
}
