/**
 * Object represents the data entry stored at name service:
 * {type: [spid1, spid2, spid3...]}
 */
export default class ServiceType {
    type: string;
    spids: Array<string>;
    constructor(type: string);
}
