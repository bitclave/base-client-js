/**
 * Object represents the data entry stored at name service:
 * {type: [spid1, spid2, spid3...]}
 */
export default class ServiceType {
    public type: string;
    public spids: Array<string>;

    constructor(type: string) {
        this.type = type;
        this.spids = new Array();
    }
}