export default class SearchRequest {
    readonly id: number;
    readonly owner: string;
    tags: Map<String, String>;
    static fromJson(json: any): SearchRequest;
    constructor(tags?: Map<String, String>);
    toJson(): any;
}
