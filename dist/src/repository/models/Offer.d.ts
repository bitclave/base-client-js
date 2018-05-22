import { CompareAction } from './CompareAction';
export default class Offer {
    readonly id: number;
    readonly owner: string;
    description: string;
    title: string;
    imageUrl: string;
    worth: string;
    tags: Map<String, String>;
    compare: Map<String, String>;
    rules: Map<String, CompareAction>;
    static fromJson(json: any): Offer;
    constructor(description?: string, title?: string, imageUrl?: string, worth?: string, tags?: Map<String, String>, compare?: Map<String, String>, rules?: Map<String, CompareAction>);
    toJson(): any;
}
