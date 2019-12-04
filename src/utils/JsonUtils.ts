export class JsonUtils {

    public static jsonToMap<K, V>(objMap: object): Map<K, V> {
        if (objMap instanceof Map) {
            return objMap;
        }

        const map: Map<K, V> = new Map<K, V>();
        // tslint:disable-next-line:no-any
        Object.keys(objMap).forEach((key: any) => map.set(key, objMap[key]));

        return map;
    }

// tslint:disable-next-line:no-any
    public static mapToJson<T>(map: Map<string, any>): T {
        const result = {};

        map.forEach((value, key) => {
            result[key] = value;
        });

        return result as T;
    }

    // tslint:disable-next-line:no-any
    public static jsonDateToDate(value: any): Date {
        if (value instanceof Date) {
            return value;
        }

        return value ? new Date(value.toString()) : new Date();
    }
}
