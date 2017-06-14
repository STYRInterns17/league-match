import {UserPreferences} from "../../../../common/UserPreferences";
import {User} from "../../../../common/User";
import {DBManager} from "../db/DBManager";
import {NotificationController} from "./NotificationController";
import {MapManager} from "../db/MapManager";
/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class UserController {

    private static TABLE = 'Users';

    //Create a new user
    public static create(pref: UserPreferences, email: string): boolean {
        //DBManager add user to db
        DBManager.appendItemToTable(this.TABLE, new User(pref, email)).then(user => {
            // Create a notification list for the new user
            NotificationController.create();
            // Add User email to map
            MapManager.createItem('emails',user.email, user.id);
            //Return success y/n
            console.log('true');
            return true;
        }).catch(reason => {
            return false;
        });
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

    public static getPreferences(userId: number): Promise<UserPreferences> {
        //DBManager get user
        //return preferences of user, not whole user
        console.log('userId: ' + userId);
        return new Promise((resolve, reject) => {
            DBManager.getItemFromTable(this.TABLE, userId).then(user => {
                console.log(user);
                resolve(user.pref)
            })
        })
    }

    public static validate(email: string, password: string): Promise<boolean> {
        //DBManager search through users, find matching email
        //If password === password, return true;
        //else return false;

        return new Promise((resolve, reject) => {
            MapManager.doesItemExist('emails', email).then(value => {
                if (value) {
                    MapManager.getItemId('emails', email).then(id => {
                        console.log("Id: " + id.id);
                        this.getPreferences(id.id).then(pref => {
                            if (password === pref.password) {
                                console.log("Password match found!");
                                resolve(true);
                            }
                            else {
                                console.log("Password match NOT found!");
                                resolve(false);
                            }
                        })
                    }).catch(reason => {
                        return false;
                    });
                }
                else{
                    console.log('2');
                    resolve(false);
                }
            })
        })
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