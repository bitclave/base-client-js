import { FileMeta } from '../models/FileMeta';
export interface ClientDataRepository {
    getData(id: string, fieldKey?: string | Array<string>): Promise<Map<string, string>>;
    updateData(id: string, data: Map<string, string>): Promise<Map<string, string>>;
    getFile(id: string, fileId: number): Promise<string>;
    uploadFile(id: string, file: FileMeta, fileId?: number | null): Promise<FileMeta>;
}
