/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class NotificationController {

    //Send Notification to a League
    public static sendNotificationToLeague(message: string, leagueId: number, submitterName: string): boolean {
        //Get all users in a league
        //Send the same notification to all those users
        //DBManager write to notification table

        return true;
    }

    //Send Notification to a User
    public static sendNotificationToUser(message: string, userId: number, submitterName: string): boolean {
        //Write to notification table at userId

        return true;
    }

    //Get all of a Users pending notifications
    public static getNotifications(userId: number ): Notification[] {
        //Return DBManager get pendingNotifications at in Notification Table at userId

        return [];
    }

    //Removes a particular notification from a user's pending list
    public static dismissNotification(userId: number, notificationId: number): boolean {
        //DBManager go to notification table at userId
        //Remove notification by notificationId
        //return success

        return true;
    }


}