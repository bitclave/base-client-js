import { JsonUtils } from '../../utils/JsonUtils';
import { FieldData } from './FieldData';
import { JsonObject } from './JsonObject';

export class SharedData {
    public readonly data: Map<string, Array<FieldData>> = new Map();

    public static fromJson(json: JsonObject<object>): SharedData {
        const rawMap = JsonUtils.jsonToMap<string, Array<JsonObject<FieldData>>>(json);
        const result = new SharedData();

        rawMap.forEach((value, key) => {
            const list = value.map(item => FieldData.fromJson(item));

            result.data.set(key, list);
        });

        return result;
    }

    public get size(): number {
        return this.data.size;
    }

    public set(data: FieldData): void {
        const array = this.data.get(data.to) || [];

        const existed = array.find(item => item.key === data.key && item.from === data.from);
        if (existed) {
            existed.value = data.value;
        } else {
            array.push(data);
        }

        this.data.set(data.to, array);
    }

    public get(ancestor: string, root?: string): Map<string, FieldData> {
        const rootPk = root ? root : ancestor;
        const array = this.getDataTo(ancestor);
        const result: Map<string, FieldData> = new Map();

        array.forEach(item => {
                if (item.root === rootPk) {
                    result.set(item.key, item);
                }
            }
        );

        return result;
    }

    public getKeyValue(ancestor: string, root?: string): Map<string, string | undefined> {
        const data = this.get(ancestor, root);
        const result: Map<string, string | undefined> = new Map();

        data.forEach((value, key) => result.set(key, value.value));

        return result;
    }

    public getDataTo(to: string): Array<FieldData> {
        return this.data.get(to) || [];
    }

    public toList(): Array<FieldData> {
        if (this.data.size <= 0) {
            return [];
        }

        return Array.from(this.data.values())
            .reduce((previousValue, currentValue) => previousValue.concat(currentValue));
    }

    public extractKeysByRoot(): Map<string, Map<string, FieldData>> {
        const result: Map<string, Map<string, FieldData>> = new Map();

        this.data.forEach((fields) => {
            fields.forEach(data => {
                const keys = result.get(data.root) || new Map();
                keys.set(data.key, data);
                result.set(data.root, keys);
            });
        });

        return result;
    }
}
