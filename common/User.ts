
import {UserPreferences} from "./UserPreferences";
import {IStorable} from "../server/express/src/middleware/IStorable";
/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class User implements  IStorable{
    //Unique identifier for the user for db look up
    public id: number;
    //Date the user was created, can not be changed
    public joinDate: Date;
    //List of leagues
    public leagues: number[];
    //The current MMR of the player in the same index as leagues array
    public mmr: number[];
    // User settings, bio etc
    public pref: UserPreferences;

    constructor(pref: UserPreferences) {
        this.pref = pref;
        this.joinDate = new Date(); //This will need to be updated to account for time zones
        this.leagues = [];
        this.mmr = [];
    }

}