import {UserPreferences} from "./UserPreferences";
/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class User {
    public id: number;
    public pref: UserPreferences;
    public email: string;
    public joinDate: Date;
}