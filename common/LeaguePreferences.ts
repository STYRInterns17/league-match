/**
 * Created by STYR-Curt on 6/6/2017.
 */
export class LeaguePreferences {
    public matchesApprovedByAdmin: boolean;
    public title: string;
    public timeZone; //Not sure what type this would be
    constructor(matchesApprovedByAdmin: boolean, title: string, timeZone: any) {
        this.matchesApprovedByAdmin = matchesApprovedByAdmin;
        this.title = title;
        this.timeZone = timeZone;
    }
}