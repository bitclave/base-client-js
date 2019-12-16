import { Primitive } from '../../../utils/types/Primitive';

export class JsonRpc {

    public readonly jsonrpc: string = '2.0';
    public readonly method: string;
    public readonly id: number;
    public readonly params: Array<object | Primitive | undefined | null>;
    public readonly result?: object | Primitive;
    public readonly error?: object | Array<object>;

    public static request(id: number, method: string, params: Array<object | Primitive | undefined | null>): JsonRpc {
        return new JsonRpc(id, method, params);
    }

    public static response(
        id: number,
        method: string,
        result?: object | Primitive,
        error?: object | Array<object>
    ): JsonRpc {
        return new JsonRpc(id, method, undefined, result, error);
    }

    private constructor(
        id: number,
        method: string,
        params: Array<object | Primitive | undefined | null> = [],
        result?: object | Primitive,
        error?: object | Array<object>
    ) {
        this.id = id;
        this.method = method;
        this.params = params || [];
        this.result = result;
        this.error = error;
    }

    public getResult<T>(): T {
        // tslint:disable-next-line:no-any
        return this.result as any;
    }
}
