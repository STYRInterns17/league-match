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
            MapManager.createItem('emails', user.email, user.id);
            // Add User name to map
            MapManager.createItem('names', user.name, user.id);
            //Return success y/n
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

    // id, which user to update.
    public static updateUser(updatedUser: User): boolean {
        //DBManager get user, update user preferences
        DBManager.updateItem(this.TABLE, updatedUser);
        return true;
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
        return new Promise((resolve, reject) => {
            DBManager.getItemFromTable(this.TABLE, userId).then(user => {
                resolve(user.pref);
            })
        })
    }

    public static getUserByName(name: string): Promise<number> {
        // Get UserId by name
        return new Promise((resolve, reject) => {
            MapManager.getItemId('names', name).then(map => {
                resolve(map.id);
            }).catch(reason => {
                reject('User does not exist');
            })
        })
    }

    public static updateUserName(userId: number, newName: string): Promise<User> {
        return new Promise((resolve, reject) => {
            MapManager.doesItemExist('names', newName).then(doesExist => {
                if (doesExist) {
                    reject(newName + ' is already in use');
                } else {
                    UserController.get(userId).then(user => {

                        MapManager.changeItemKey('names', user.name, newName).then(value => {
                            if (value) {
                                // These promises are not changed to save computation time, trade off is they are not checked
                                // for successful write
                                user.name = newName;
                                UserController.updateUser(user);
                                resolve(User);
                            } else {
                                reject('Could not change UserName');
                            }
                        })
                    })

                }
            });
        })
    }

    public static validate(email: string, password: string): Promise<User> {
        //DBManager search through users, find matching email
        //If password === password, return true;
        //else return false;
        return new Promise((resolve, reject) => {
            MapManager.doesItemExist('emails', email).then(value => {
                if (value) {
                    MapManager.getItemId('emails', email).then(id => {
                        this.get(id.id).then(user => {
                            if (password === user.pref.password) {
                                resolve(user);
                            } else {
                                reject();
                            }
                        })
                    }).catch(reason => {
                        reject();
                    });
                }
                else{
                    reject();
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