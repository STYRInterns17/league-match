import {Match} from "../../../../common/Match";
import {LeagueController} from "./LeagueController";
import {UserController} from "./UserController";
import {User} from "../../../../common/User";
/**
 * Created by STYR-Curt on 6/14/2017.
 */
export  class MatchController {

    private static TABLE = 'MMRHistory'
    public static getMatches(id: number, startDate: Date, endDate: Date): Match[] {
        //DBManager get league

        //Return list of matches between range of dates

        return [];
    }

    // TODO What if duplicate users?

    public static logMatch(leaugeId: number, match: Match): boolean {
        let team1:User[];
        let team2:User[];

        //DBManager get league by Id
        LeagueController.get(leaugeId).then(league => {
            // Push users in match to respective arrays
            for(let i = 0; i < match.team1Names.length; i++) {
                UserController.getUserByName(match.team1Names[i]).then(userId => {
                    UserController.get(userId).then(user => {
                        team1.push(user);
                    });
                });

                UserController.getUserByName(match.team2Names[i]).then(userId => {
                    UserController.get(userId).then(user => {
                        team2.push(user);
                    });
                });
            }

            let team1AverageMMR: number = 0;
            let team2AverageMMR: number = 0;

            for(let i = 0; i < team1.length; i++) {
                team1AverageMMR += team1[i].mmr[team1[i].leagues.indexOf(leaugeId)];
                team2AverageMMR += team2[i].mmr[team2[i].leagues.indexOf(leaugeId)];
            }

            // Average MMRs are now calculated
            team1AverageMMR = team1AverageMMR / team1.length;
            team2AverageMMR = team2AverageMMR / team2.length;



        });

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


    public static add
}