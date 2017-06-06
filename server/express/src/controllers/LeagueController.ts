import {LeaguePreferences} from "../models/LeaguePreferences";
import {Match} from "../models/Match";
/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class LeagueController {
    public static create(ownerId: number, pref: LeaguePreferences): boolean {
        //DBManager add League to db

        //Return success y/n
        return true;
    }

    public static delete(leagueId: number): boolean {
        //DBManager remove League from db

        return true;
    }

    public static get(id: number): boolean {
        //DBManager get league from db


        return true;
    }
    //id, which league to update. newPref, the new preferences
    public static updatePreferences(id: number, newPref: LeaguePreferences): boolean {
        //DBManager get league, update league preferences

        return true;
    }

    public static getUsers(id: number): number[] {
        //DBManager get league

        //Return list of users in league

        return [];
    }

    public static getMatches(id: number, startDate: Date, endDate: Date): Match[] {
        //DBManager get league

        //Return list of matches between range of dates

        return [];
    }

    public static postMatch(leaugeId: number, match: Match): boolean {
        //DBManager get league by Id

        //Update all players MMR

        //Update all players activity history

        //Add match to match history


        return true;
    }

    public static postMatchUnapproved(leaugeId: number, submitterId: number, match: Match): boolean {
        //DBManager get league by Id

        //Notify admins in league that submitter is trying to log a match

        return true;
    }
}