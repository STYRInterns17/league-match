/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class Notification {
    public message: string;
    public submitterUser: string;
    public submitterLeague: string;
    public index: number;
    public read: boolean;

    constructor(msg: string, submitterUser: string, submitterLeague: string) {
        this.message = msg;
        this.submitterUser = submitterUser;
        this.submitterLeague = submitterLeague;
        this.read = false;
    }
}