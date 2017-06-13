import {UserPreferences} from "../../../../common/UserPreferences";
import {User} from "../../../../common/User";
import {DBManager} from "../db/DBManager";
import {NotificationController} from "./NotificationController";
/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class UserController {

    private static TABLE = 'Users';

    //Create a new user
    public static create(pref: UserPreferences): boolean {
        //DBManager add user to db
        DBManager.appendItemToTable(this.TABLE, new User(pref));
        // Create a notification list for the new user
        NotificationController.create();
        //Return success y/n
        return true;
    }

    //Get user by Id
    public static get(userId: number): Promise<User> {
        //DBManager get user from db
        let p = new Promise((resolve, reject) => {
            DBManager.getItemFromTable(this.TABLE, userId).then((user) => {
                resolve(user);
            });
        });

        return p;
    }

    // id, which user to update. newPref, the new preferences
    public static updatePreferences(userId: number, newPref: UserPreferences): boolean {
        //DBManager get user, update user preferences
        this.get(userId).then((user) => {
            user.pref = newPref;
            DBManager.updateItem(this.TABLE, user);
        });
        return true;
    }

    public static getPreferences(userid: number): UserPreferences {
        //DBManager get user
        //return preferences of user, not whole user
        return new UserPreferences('curt@styr.com', 'passcode', 'I like to fly kites', 1);
    }

    public static validate(email: string, password: string): boolean {
        //DBManager search through users, find matching email
        //If password === password, return true;
        //else return false;

        DBManager.getItemFromTable(this.TABLE, 0);

        return true;
    }

    public static getAssociations(userId: number, mask: string): number[] {
        //DBManager get all leagues this users is part of
        //Return list of users in those leagues which match the alphabetic mask

        //List of user Ids
        return [];
    }

    public static sendEmailInvite(email: string, leagueId: number) {
        //Use magic to send an email to the email address

        //DBManager create user with that email which is invited to the league with Id ^
    }
}