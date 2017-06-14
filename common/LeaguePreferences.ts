/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class LeaguePreferences {
    public matchesApprovedByAdmin: boolean;
    public title: string;
    public timeZone; //Not sure what type this would be
    // 0,1,2
    //0 - 0 to inf
    //1 - -inf to inf
    //2 - -inf to 0
    public scoreRange: number;
    //0,1
    //0 - wins
    //1 - loses
    public highestScore: number;
    constructor(matchesApprovedByAdmin: boolean, title: string, timeZone: any, scoreRange: number, highestScore: number) {
        this.matchesApprovedByAdmin = matchesApprovedByAdmin;
        this.title = title;
        this.timeZone = timeZone;
        this.scoreRange = scoreRange;
        this.highestScore = highestScore;
    }
}