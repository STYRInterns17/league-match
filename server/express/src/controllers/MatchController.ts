import {Match} from "../../../../common/Match";
import {LeagueController} from "./LeagueController";
import {UserController} from "./UserController";
import {User} from "../../../../common/User";
/**
 * Created by STYR-Curt on 6/14/2017.
 */
export class MatchController {

    private static TABLE = 'MMRHistory'

    public static getMatches(id: number, startDate: Date, endDate: Date): Match[] {
        //DBManager get league

        //Return list of matches between range of dates

        return [];
    }

    // TODO What if duplicate users?

    public static logMatch(leaugeId: number, match: Match): Promise<string> {

        return new Promise((resolve, reject) => {

            //DBManager get league by Id
            LeagueController.get(leaugeId).then(league => {

                let getUserPromises: Promise<{ user: User, team: number }>[] = [];
                // Push users in match to respective arrays
                for (let i = 0; i < match.team1Names.length; i++) {
                    // Team 1
                    getUserPromises.push(UserController.getUserByName(match.team1Names[i]).then(userId => {
                        return UserController.get(userId);
                    }).then(user => {
                        return {user: user, team: 1};
                    }));

                    // Team 2
                    getUserPromises.push(UserController.getUserByName(match.team2Names[i]).then(userId => {
                        return UserController.get(userId);
                    }).then(user => {
                        return {user: user, team: 2};
                    }));

                }

                // Once all Users have been retrieved from database
                Promise.all(getUserPromises).then(value => {


                    let team1: User[] = [];
                    let team2: User[] = [];


                    for (let i = 0; i < value.length; i++) {

                        if (value[i].team === 1) {
                            team1.push(value[i].user)
                        } else if (value[i].team === 2) {
                            team2.push(value[i].user)
                        }

                    }

                    let team1AverageMMR: number = 0;
                    let team2AverageMMR: number = 0;

                    for (let i = 0; i < team1.length; i++) {
                        team1AverageMMR += team1[i].mmr[team1[i].leagues.indexOf(leaugeId)];
                        team2AverageMMR += team2[i].mmr[team2[i].leagues.indexOf(leaugeId)];
                    }

                    // Average MMRs are now calculated
                    team1AverageMMR = team1AverageMMR / team1.length;
                    team2AverageMMR = team2AverageMMR / team2.length;

                    // If MMROffsets is not changed it was a tie
                    let MMROffsets = {winnerOffset: 0, loserOffset: 0};
                    let team1wins: boolean;

                    // If high score wins
                    if (league.pref.highestScore === 0) {
                        if (match.team1Score > match.team2Score) {
                            MMROffsets = this.getMMROffset(team1AverageMMR, team2AverageMMR);
                            team1wins = true;
                        } else if (match.team1Score < match.team2Score) {
                            MMROffsets = this.getMMROffset(team2AverageMMR, team1AverageMMR);
                            team1wins = false;
                        }
                    }

                    // If lower score wins
                    else if (league.pref.highestScore === 1) {
                        if (match.team1Score > match.team2Score) {
                            MMROffsets = this.getMMROffset(team2AverageMMR, team1AverageMMR);
                            team1wins = false;
                        } else if (match.team1Score < match.team2Score) {
                            MMROffsets = this.getMMROffset(team1AverageMMR, team2AverageMMR);
                            team1wins = true;
                        }
                    } else {
                        reject('Invalid league.pref.highestScore');
                    }

                    // Update the MMR of all User Objects
                    for (let i = 0; i < team1.length; i++) {
                        if (team1wins) {
                            team1[i].mmr[team1[i].leagues.indexOf(leaugeId)] += MMROffsets.winnerOffset;
                            team2[i].mmr[team2[i].leagues.indexOf(leaugeId)] += MMROffsets.loserOffset;
                        } else {
                            team1[i].mmr[team1[i].leagues.indexOf(leaugeId)] += MMROffsets.loserOffset;
                            team2[i].mmr[team2[i].leagues.indexOf(leaugeId)] += MMROffsets.winnerOffset;
                        }

                        // Write User back to server
                        UserController.updateUser(team1[i]);
                        UserController.updateUser(team2[i]);
                    }
                    resolve('Match logged successfully');
                }).catch(reason => {
                    console.log(reason);
                    reject(reason);
                });
            }).catch(reason => {
                reject(reason);
            });
        });

    }


    public static postMatchUnapproved(leaugeId: number, submitterId: number, match: Match): boolean {
        //DBManager get league by Id

        //Notify admins in league that submitter is trying to log a match

        return true;
    }


    public static getMMROffset(winningPlayerMMR: number, losingPlayerMMR: number): { winnerOffset: number, loserOffset: number } {

        // On average a player should gain 25 or lose 25 from a match


        let difference: number = losingPlayerMMR - winningPlayerMMR;
        let winnerOffset: number = 25;
        let loserOffset: number = -25;


        if (winningPlayerMMR > losingPlayerMMR) {
            winnerOffset += Math.floor(difference / 20);
            loserOffset += -Math.floor(difference / 20);
        } else {
            winnerOffset += Math.floor(difference / 20);
            loserOffset += -Math.floor(difference / 20);
        }

        if (winnerOffset < 1) {
            winnerOffset = 1;
        }
        if (loserOffset > -1) {
            loserOffset = -1
        }
        if (winnerOffset > 75) {
            winnerOffset = 75;
        }
        if (loserOffset < -75) {
            loserOffset = -75;
        }

        return {winnerOffset, loserOffset}
    }
}