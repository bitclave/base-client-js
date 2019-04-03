import { DeepCopy } from './ObjectClone';

export default class FileMeta extends DeepCopy<FileMeta> {

    public readonly id: number;
    public readonly publicKey: string;
    public name: string;
    public mimeType: string;
    public size: number;
    public content?: string;

    constructor(
        id: number = 0,
        publicKey: string = '0x0',
        name: string = '',
        mimeType: string = '',
        size: number = 0,
        content?: string
    ) {
        super();
        this.id = id || 0;
        this.publicKey = publicKey || '0x0';
        this.name = name || '';
        this.mimeType = mimeType || '';
        this.size = size || 0;
        this.content = content;
    }

    public copyWithContent(content: string): FileMeta {
        return new FileMeta(this.id, this.publicKey, this.name, this.mimeType, this.size, content);
    }
}
