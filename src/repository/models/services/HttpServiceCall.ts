import { JsonUtils } from '../../../utils/JsonUtils';
import { HttpMethod } from '../../source/http/HttpMethod';
import { ClassCreator, DeepCopy } from '../DeepCopy';
import { JsonObject } from '../JsonObject';
import { ServiceCall, ServiceCallType } from './ServiceCall';

export class HttpServiceCall extends DeepCopy<HttpServiceCall> implements ServiceCall {
    public readonly serviceId: string;
    public readonly type: ServiceCallType;
    public readonly httpMethod: HttpMethod;
    public readonly path: string;
    public readonly queryParams: Map<string, string>;
    public readonly headers: Map<string, Array<string>>;
    public readonly body?: object;

    public static fromJson(json: JsonObject<HttpServiceCall>): HttpServiceCall {
        return new HttpServiceCall(
            json.serviceId as string,
            ServiceCallType[json.type as string],
            HttpMethod[json.httpMethod as string],
            json.path as string,
            JsonUtils.jsonToMap(json.queryParams as object),
            JsonUtils.jsonToMap(json.headers as object),
            json.body as object
        );
    }

    constructor(
        serviceId: string = '',
        type: ServiceCallType = ServiceCallType.UNDEFINED,
        httpMethod: HttpMethod = HttpMethod.Get,
        path: string = '',
        queryParams: Map<string, string> = new Map(),
        headers: Map<string, Array<string>> = new Map(),
        body?: object
    ) {
        super();
        this.serviceId = serviceId || '';
        this.type = type || ServiceCallType.UNDEFINED;
        this.httpMethod = httpMethod || HttpMethod.Get;
        this.path = path || '';
        this.queryParams = queryParams || new Map();
        this.headers = headers || new Map();
        this.body = body;
    }

    public toJson(): object {
        const json = JSON.parse(JSON.stringify(this));
        json.queryParams = JsonUtils.mapToJson(this.queryParams);
        json.headers = JsonUtils.mapToJson(this.headers);

        return json;
    }

    protected deepCopyFromJson(): HttpServiceCall {
        return HttpServiceCall.fromJson(this.toJson() as JsonObject<HttpServiceCall>);
    }

    protected getClass(): ClassCreator<HttpServiceCall> {
        return HttpServiceCall;
    }
}
