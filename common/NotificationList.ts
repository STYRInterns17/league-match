import {IStorable} from "../server/express/src/middleware/IStorable";
import {Notification} from "./Notification"
/**
 * Created by STYR-Curt on 6/7/2017.
 */
export class NotificationList implements IStorable {
    public id: number;
    public list: Notification[];
    constructor() {
        this.list = [];
    }

}