import {LeaguePreferences} from "./LeaguePreferences";
import {IStorable} from "../middleware/IStorable";
/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class League implements  IStorable{
    //The unique identifier for league lookup in db
    public id: number;
    //Leagues can only have one owner, ownership can not be transferred
    public ownerId: number;
    //Admins are players with settings privileges
    public adminIds: number[];
    //All player Ids, owner, and admins are included
    public playerIds: number[];

    public pref: LeaguePreferences;

}
