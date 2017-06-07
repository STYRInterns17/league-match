import {IStorable} from "../middleware/IStorable";
import {Notification} from "../models/Notification"
/**
 * Created by STYR-Curt on 6/7/2017.
 */
export class NotificationList implements IStorable {
    public id: number;
    public list: Notification[];
    constructor() {
        this.list = [];
        this.list.push(new Notification('Welcome to AmLeagues!', 'AmLeagues', 'AmLeagues the League'));
    }

}