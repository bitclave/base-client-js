export interface NodeInfoRepository {
    getNodeVersion(): Promise<string>;
}
