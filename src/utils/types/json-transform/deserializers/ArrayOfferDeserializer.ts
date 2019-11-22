import { JsonObject } from '../../../../repository/models/JsonObject';
import Offer from '../../../../repository/models/Offer';
import { JsonDeserializer } from '../JsonDeserializer';

export class ArrayOfferDeserializer implements JsonDeserializer<Array<Offer>> {

    public fromJson(json: JsonObject<Array<Offer>>): Array<Offer> {
        return json.map(item => Offer.fromJson(item));
    }
}
