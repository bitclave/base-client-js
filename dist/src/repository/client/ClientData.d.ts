export interface ClientData {
    getData(id: string): Promise<Map<string, string>>;
    updateData(id: string, data: Map<string, string>): Promise<Map<string, string>>;
}
