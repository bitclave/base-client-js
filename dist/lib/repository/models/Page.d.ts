import { JsonDeserializer } from '../../utils/types/json-transform';
import { ClassCreator, DeepCopy } from './DeepCopy';
import { JsonTransform } from './JsonTransform';
export declare class Pageable extends DeepCopy<Pageable> {
    readonly sort: string | undefined;
    readonly page: number;
    readonly size: number;
    constructor(sort?: string, page?: number, size?: number);
    toJson(): object;
    protected getClass(): ClassCreator<Pageable>;
}
export declare class Page<T extends JsonTransform> extends DeepCopy<Page<T>> {
    readonly total: number;
    readonly content: Array<T>;
    readonly pageable: Pageable;
    readonly numberOfElements: number;
    readonly first: boolean;
    readonly last: boolean;
    readonly number: number;
    readonly size: number;
    readonly totalPages: number;
    readonly totalElements: number;
    readonly counters?: object;
    static fromJson<T extends JsonTransform>(json: object, deserializer: JsonDeserializer<T>): Page<T>;
    constructor(total?: number, content?: Array<T>, pageable?: Pageable, numberOfElements?: number, first?: boolean, last?: boolean, number?: number, size?: number, totalPages?: number, totalElements?: number, counters?: object);
    toJson(): object;
    protected deepCopyFromJson(): Page<T>;
    protected getClass(): ClassCreator<Page<T>>;
}
