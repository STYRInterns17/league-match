/**
 * Created by STYR-Curt on 6/7/2017.
 */
import * as tabris from 'tabris/tabris';

export class NotificationComposite extends  tabris.Composite{
    public message: string;
    public submitterUser: string;
    public submitterLeague: string;
    // Composite already has an id number, this name can not be reused
    public db_id: number;
    public wasRead: boolean;

    constructor(config: tabris.CompositeProperties) {
        super(config);
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