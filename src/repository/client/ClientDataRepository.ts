import FileMeta from "../models/FileMeta";

export interface ClientDataRepository {

    getData(id: string): Promise<Map<string, string>>;

    updateData(id: string, data: Map<string, string>): Promise<Map<string, string>>;

    getFile(id: string, fileId: number): Promise<Buffer>;

    uploadFile(id: string, file: File, fileId?: number): Promise<FileMeta>;

}
