import { ClassCreator, DeepCopy } from './DeepCopy';
export default class SearchRequest extends DeepCopy<SearchRequest> {
    readonly id: number;
    readonly owner: string;
    tags: Map<string, string>;
    createdAt: Date;
    updatedAt: Date;
    static fromJson(json: object): SearchRequest;
    constructor(tags?: Map<string, string>);
    toJson(): any;
    protected deepCopyFromJson(): SearchRequest;
    protected getClass(): ClassCreator<SearchRequest>;
}
