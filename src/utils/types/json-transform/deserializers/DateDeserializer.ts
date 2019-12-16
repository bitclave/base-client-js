import { JsonObject } from '../../../../Base';
import { JsonDeserializer } from '../JsonDeserializer';

export class DateDeserializer implements JsonDeserializer<Date> {

    public fromJson(json: JsonObject<Date>): Date {
        return new Date(json.toString());
    }
}
