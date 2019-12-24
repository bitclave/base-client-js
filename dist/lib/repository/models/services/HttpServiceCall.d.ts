import { HttpMethod } from '../../source/http/HttpMethod';
import { ClassCreator, DeepCopy } from '../DeepCopy';
import { JsonObject } from '../JsonObject';
import { ServiceCall, ServiceCallType } from './ServiceCall';
export declare class HttpServiceCall extends DeepCopy<HttpServiceCall> implements ServiceCall {
    readonly serviceId: string;
    readonly type: ServiceCallType;
    readonly httpMethod: HttpMethod;
    readonly path: string;
    readonly queryParams: Map<string, string>;
    readonly headers: Map<string, Array<string>>;
    readonly body?: object;
    static fromJson(json: JsonObject<HttpServiceCall>): HttpServiceCall;
    constructor(serviceId?: string, type?: ServiceCallType, httpMethod?: HttpMethod, path?: string, queryParams?: Map<string, string>, headers?: Map<string, Array<string>>, body?: object);
    toJson(): object;
    protected deepCopyFromJson(): HttpServiceCall;
    protected getClass(): ClassCreator<HttpServiceCall>;
}
