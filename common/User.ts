
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
    //Email of the user, not a preference because protocol must be done to change it
    public email: string;
    // User settings, bio etc
    public pref: UserPreferences;
    // Used to submit matches and see your friends
    public name: string;

    // Name should be set after account creation
    constructor(pref: UserPreferences, email: string) {
        this.pref = pref;
        this.joinDate = new Date(); //This will need to be updated to account for time zones
        this.leagues = [];
        this.mmr = [];
        this.email = email;
        this.name = '';
    }

}