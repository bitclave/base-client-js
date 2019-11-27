import { ClassCreator, DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';
import { JsonTransform } from './JsonTransform';

export class Pageable extends DeepCopy<Pageable> {
    public readonly sort: string | undefined;
    public readonly page: number;
    public readonly size: number;

    constructor(sort: string = '', page: number = 0, size: number = 0) {
        super();
        this.sort = sort;
        this.page = page;
        this.size = size;
    }

    public toJson(): object {
        return this;
    }

    protected getClass(): ClassCreator<Pageable> {
        return Pageable;
    }
}

export class Page<T extends JsonTransform> extends DeepCopy<Page<T>> {
    public readonly total: number;
    public readonly content: Array<T>;
    public readonly pageable: Pageable;
    public readonly numberOfElements: number;
    public readonly first: boolean;
    public readonly last: boolean;
    public readonly number: number;
    public readonly size: number;
    public readonly totalPages: number;
    public readonly totalElements: number;
    public readonly counters?: object;

    // tslint:disable-next-line:callable-types
    public static fromJson<T extends JsonTransform>(json: object, Creator: { new(): T; }): Page<T> {
        const raw = json as JsonObject<Page<T>>;
        const rawPageable = raw.pageable as JsonObject<Pageable>;
        const pageable: Pageable = new Pageable(
            rawPageable.sort as string,
            rawPageable.page as number,
            rawPageable.size as number
        );
        const content: Array<T> = (raw.content as Array<T>)
            .map((item: T) => Object.assign(new Creator(), item));
        const counters: object = raw.counters as object || {};

        return new Page<T>(
            raw.total as number,
            content,
            pageable,
            raw.numberOfElements as number,
            raw.first as boolean,
            raw.last as boolean,
            raw.number as number,
            raw.size as number,
            raw.totalPages as number,
            raw.totalElements as number,
            counters
        );
    }

    constructor(
        total: number = 0,
        content: Array<T> = [],
        pageable: Pageable = new Pageable(),
        numberOfElements: number = 0,
        first: boolean = false,
        last: boolean = false,
        // tslint:disable-next-line:variable-name
        number: number = 0,
        size: number = 0,
        totalPages: number = 0,
        totalElements: number = 0,
        counters: object = {}
    ) {
        super();
        this.total = total;
        this.content = content;
        this.pageable = pageable;
        this.numberOfElements = numberOfElements;
        this.first = first;
        this.last = last;
        this.number = number;
        this.size = size;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.counters = counters;
    }

    public toJson(): object {
        const json = JSON.parse(JSON.stringify(this));

        json.content = this.content.map(item => item.toJson());
        json.pageable = this.pageable.toJson();

        return json;
    }

    protected deepCopyFromJson(): Page<T> {
        throw new Error('method not supported');
    }

    protected getClass(): ClassCreator<Page<T>> {
        return Page;
    }
}
