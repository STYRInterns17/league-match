import {LeaguePreferences} from "../../../../common/LeaguePreferences";
import {Match} from "../../../../common/Match";
import {League} from "../../../../common/League";
import {DBManager} from "../db/DBManager";
import {UserController} from "./UserController";
/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class LeagueController {

    private static TABLE = 'Leagues';

    public static create(ownerId: number, pref: LeaguePreferences): Promise<number> {
        //DBManager add League to db
        // DBManager.appendItemToTable(this.TABLE, new League(ownerId, pref)).then((league) => {
        //     return league.id;
        // });
        let p = new Promise((resolve, reject) => {
            let newLeague = new League(ownerId, pref);
            newLeague.playerIds.push(ownerId);
            newLeague.adminIds.push(ownerId);
            DBManager.appendItemToTable(this.TABLE, newLeague).then((league) =>{
                //console.log(league);
                resolve(league.id);

            });

        });

        return p;
    }

    public static get(leagueId: number): Promise<League> {
        //DBManager get league from db
        let p = new Promise((resolve, reject) => {
            DBManager.getItemFromTable(this.TABLE, leagueId).then((league) => {
                resolve(league);
            });

        });

        return p;
    }

    public static delete(id: number): boolean {
        //DBManager delete league from db


        return true;
    }
    //id, which league to update. newPref, the new preferences
    public static updatePreferences(id: number, newPref: LeaguePreferences): Promise<League> {
        //DBManager get league, update league preferences
        return this.get(id).then((league) => {
            league.pref = newPref;
            return league;
        }).then(updatedLeague => {
            DBManager.updateItem(this.TABLE, updatedLeague);
            return updatedLeague;
        });
    }

    public static addLeaguePlayers(leagueId: number, userId): boolean {
        //DBManager get league, update league preferences
        this.get(leagueId).then((league: League) => {
            let userInLeagueAlready = false;
            for(let i = 0; i < league.playerIds.length; i++) {
                if(league.playerIds[i] === userId) {
                    userInLeagueAlready = true;
                }
            }

            if(!userInLeagueAlready) {
                league.playerIds.push(parseInt(userId));
                DBManager.updateItem(this.TABLE, league);


                UserController.get(userId).then((user) =>{
                    user.leagues.push(leagueId);
                    user.mmr.push(5000);
                    UserController.updateUser(user) ;
                });

                return true;
            }


        });
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


}