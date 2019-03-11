export class Pageable {
    readonly sort: string | undefined;
    readonly page: number;
    readonly size: number;

    constructor(sort: string, page: number, size: number) {
        this.sort = sort;
        this.page = page;
        this.size = size;
    }
}

export class Page<T> {
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

    public static fromJson<T>(json: any, Creator: { new(): T; }): Page<T> {
        const pageable: Pageable = new Pageable(json.pageable.sort, json.pageable.page, json.pageable.size);
        const content: Array<T> = json.content.map((item: any) => Object.assign(new Creator(), item));

        return new Page<T>(
            json.total,
            content,
            pageable,
            json.numberOfElements,
            json.first,
            json.last,
            json.number,
            json.size,
            json.totalPages,
            json.totalElements
        );
    }

    constructor(total: number,
                content: Array<T>,
                pageable: Pageable,
                numberOfElements: number,
                first: boolean,
                last: boolean,
                number: number,
                size: number,
                totalPages: number,
                totalElements: number) {
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
    }
}
