import { ExcludeSignature, ExcludeSignatureType } from '../source/http/SignInterceptor';
import { JsonObject } from './JsonObject';
import { JsonTransform } from './JsonTransform';

@ExcludeSignature(ExcludeSignatureType.EXCLUDE_WRAPPER)
export class InputGraphData extends JsonTransform {

    public readonly clients: Array<string>;
    public readonly fields: Set<string>;

    public static fromJson(json: JsonObject<InputGraphData>): InputGraphData {
        return new InputGraphData(
            json.clients,
            json.fields ? new Set<string>(json.fields) : json.fields
        );
    }
    
    constructor(clients: Array<string>, fields?: Set<string>) {
        super();
        this.clients = clients || [];
        this.fields = fields || new Set<string>();
    }

    public toJson(): object {
        const json = JSON.parse(JSON.stringify(this));
        json.fields = Array.from(this.fields.keys());

        return json;
    }
}
