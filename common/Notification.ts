import {ApprovalType} from "./ApprovalType";
import {ApprovalData} from "./ApprovalData";
/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class Notification {
    public message: string;
    public submitterUser: string;
    public submitterLeague: string;
    public index: number;
    public read: boolean;
    public type: ApprovalType;
    public data: ApprovalData;

    constructor(msg: string, submitterUser: string, submitterLeague: string, type: ApprovalType, data: ApprovalData) {
        this.message = msg;
        this.submitterUser = submitterUser;
        this.submitterLeague = submitterLeague;
        this.type = type;
        this.data = data;
        this.read = false;
    }
}