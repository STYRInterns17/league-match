/**
 * Created by STYR-Curt on 6/7/2017.
 */
import * as tabris from 'tabris/tabris';

export class Notification extends  tabris.Composite{
    private message: string;
    private submitterUser: string;
    private submitterLeague: string;
    // Composite already has an id number, this name can not be reused
    private db_id: number;

    constructor(config: tabris.CompositeProperties, msg: string, subUser: string, subLeague: string, id: number) {
        super(config);
        this.message = msg;
        this.submitterUser = subUser;
        this.submitterLeague = subLeague;
        this.db_id = id;
    }

    public read(): void {
        this.background = '#BDBDBD';
        // Change background color
        // Notify server that background has been changed

    }

    public dismiss(): void {
        // Dispose of this element
        // Notify server that it has been disposed of
    }



}