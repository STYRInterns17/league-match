import {DBManager} from "../db/DBManager";
import {Notification} from "../../../../common/Notification"
import {NotificationList} from "../../../../common/NotificationList";
import {ApprovalType} from "../../../../common/ApprovalType";
import {ApprovalData} from "../../../../common/ApprovalData";
/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class NotificationController {

    private static TABLE = 'Notifications';

    public static create () {
        // Create an new notification array for a new user
        let notificationList:NotificationList = new NotificationList();
        let welcomeNotification = new Notification('Welcome to AmLeagues!', 'AmLeagues', 'AmLeagues the League', ApprovalType.Message, new ApprovalData(null));
        notificationList.list.push(welcomeNotification);
        DBManager.appendItemToTable(this.TABLE, notificationList);
    }
    //Send Notification to a League
    public static sendNotificationToLeague(message: string, leagueId: number, submitterName: string): boolean {
        //Get all users in a league
        //Send the same notification to all those users
        //DBManager write to notification table

        return true;
    }

    //Send Notification to a User
    public static sendNotificationToUser(message: string, userId: number, submitterName: string, submitterLeague: string, type: ApprovalType, data: ApprovalData): boolean {
        //Write to notification table at userId
        this.getNotifications(userId).then(notificationList => {
           let notification = new Notification(message, submitterName, submitterLeague, type, data);
           notificationList.list.push(notification);
           DBManager.updateItem(this.TABLE, notificationList);
        });


        return true;
    }

    //Get all of a Users pending notifications
    public static getNotifications(userId: number): Promise<NotificationList> {
        //Return DBManager get pendingNotifications at in Notification Table at userId
        let p = new Promise((resolve, reject) => {
            DBManager.getItemFromTable(this.TABLE, userId).then((notificationList) => {
                // Update indexes of notifications so that they can be properly dimissed
                for(let i = 0; i < notificationList.list.length; i++) {
                    notificationList.list[i].index = i;
                }
                resolve(notificationList);
            });
        });

        return p;
    }

    //Removes a particular notification from a user's pending list
    public static dismissNotification(userId: number, notificationId: number): boolean {
        //DBManager go to notification table at userId
        //Remove notification by notificationId
        //return success

        this.getNotifications(userId).then(notificationList => {
            notificationList.list.splice(notificationId, 1);
            DBManager.updateItem(this.TABLE, notificationList);
        });

        return true;
    }

    public static readAllNotifications(userId: number) {
        // DBManager get list of notifications
        // Mark all notifications as read
        // return success
        this.getNotifications(userId).then(notificationList => {
            for(let i = 0; i < notificationList.list.length; i++) {
                notificationList.list[i].read = true;
            }
            DBManager.updateItem(this.TABLE, notificationList);
        });

        return true;
    }


}