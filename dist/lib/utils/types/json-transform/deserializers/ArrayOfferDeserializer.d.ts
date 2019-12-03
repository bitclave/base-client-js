import { JsonObject } from '../../../../repository/models/JsonObject';
import Offer from '../../../../repository/models/Offer';
import { JsonDeserializer } from '../JsonDeserializer';
export declare class ArrayOfferDeserializer implements JsonDeserializer<Array<Offer>> {
    fromJson(json: JsonObject<Array<Offer>>): Array<Offer>;
}
