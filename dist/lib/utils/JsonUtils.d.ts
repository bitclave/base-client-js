export declare class JsonUtils {
    static jsonToMap<K, V>(json: object): Map<K, V>;
    static mapToJson<T>(map: Map<string, any>): T;
    static jsonDateToDate(value: any): Date;
}
