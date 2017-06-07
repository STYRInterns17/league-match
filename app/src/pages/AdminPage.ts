import {BasePage} from "./BasePage";
/**
 * Created by STYRLabs2 on 6/7/2017.
 */

export class AdminPage extends BasePage{
    //League ID will be used when communicating with the DB
    private leagueID: string;
    private userID: string;
    private adminPage: tabris.Page;
    constructor(leagueIdentification: string, userIdentification: string){
        this.leagueID = leagueIdentification;
        this.userID = userIdentification;
        super();
    }

    private createAdminPage(){
        this.adminPage = new tabris.Page({
            top: 0,
            left: 0,
            right: 0
        });
    }

    public disposeAdminPage(){

    }
}