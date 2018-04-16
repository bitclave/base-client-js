export class JsonUtils {

    public static jsonToMap<K, V>(json: Object): Map<K, V> {
        const map: Map<K, V> = new Map<K, V>();
        Object.keys(json).forEach((key: any) => map.set(key, json[key]));
        return map;
    }

    public static mapToJson(map: Map<any, any>): any {
        const result: any = {};

        map.forEach((value, key) => {
            result[key] = value;
        });

        return result;
    }

}
