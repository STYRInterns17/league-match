/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class Match {
    public team1Names: string[];
    public team2Names: string[];
    public team1Score: number;
    public team2Score: number;

    constructor(team1Names, team2Names, team1Score, team2Score) {
        this.team1Names = team1Names;
        this.team2Names = team2Names;
        this.team1Score = team1Score;
        this.team2Score = team2Score;
    }
}