import { JsonUtils } from '../../../utils/JsonUtils';
import { DeepCopy } from '../DeepCopy';
import { JsonObject } from '../JsonObject';

export class ServiceResponse extends DeepCopy<ServiceResponse> {

    public readonly headers: Map<string, Array<string>>;
    public readonly status: number;
    public readonly body?: object;

    public static fromJson(json: JsonObject<ServiceResponse>): ServiceResponse {
        return new ServiceResponse(
            JsonUtils.jsonToMap(json.headers as object),
            json.status as number,
            json.body as object
        );
    }

    constructor(headers: Map<string, Array<string>> = new Map(), status: number = 0, body?: object) {
        super();
        this.headers = headers || new Map();
        this.status = status || 0;
        this.body = body;
    }

    public toJson(): object {
        const json = JSON.parse(JSON.stringify(this));
        json.headers = JsonUtils.mapToJson(this.headers);

        return json;
    }

    protected deepCopyFromJson(): ServiceResponse {
        return ServiceResponse.fromJson(this.toJson() as JsonObject<ServiceResponse>);
    }
}
