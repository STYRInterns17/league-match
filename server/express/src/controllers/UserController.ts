import {UserPreferences} from "../models/UserPreferences";
import {User} from "../models/User";
/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class UserController {

    //Create a new user
    public static create(pref: UserPreferences): boolean {
        //DBManager add user to db

        //Return success y/n
        return true;
    }

    //Get user by Id
    public static get(userId: number): boolean {
        //DBManager get user from db


        return true;
    }

    // id, which user to update. newPref, the new preferences
    public static updatePreferences(userId: number, newPref: UserPreferences): boolean {
        //DBManager get user, update user preferences

        return true;
    }

    public static getPreferences(userid: number): UserPreferences {
        //DBManager get user
        //return preferences of user, not whole user
        return new UserPreferences();
    }

    public static validate(email: string, password: string): boolean {
        //DBManager search through users, find matching email
        //If password === password, return true;
        //else return false;

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