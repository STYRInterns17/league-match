import {ApprovalType} from "./ApprovalType";
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

    constructor(msg: string, submitterUser: string, submitterLeague: string, type: ApprovalType) {
        this.message = msg;
        this.submitterUser = submitterUser;
        this.submitterLeague = submitterLeague;
        this.type = type;
        this.read = false;
    }
}