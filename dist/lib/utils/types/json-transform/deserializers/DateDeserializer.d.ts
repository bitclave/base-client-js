import { JsonObject } from '../../../../Base';
import { JsonDeserializer } from '../JsonDeserializer';
export declare class DateDeserializer implements JsonDeserializer<Date> {
    fromJson(json: JsonObject<Date>): Date;
}
