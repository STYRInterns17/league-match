import {BasePage} from './BasePage';
import * as tabris from 'tabris';
import {Composite} from "tabris";
import {User} from "../../../common/User";
import {ServiceLayer} from "../ServiceLayer";
import {ColorScheme} from "../ColorScheme";
import {League} from "../../../common/League";
import {customButton} from "../customButton";
import {LeaguePreferences} from "../../../common/LeaguePreferences";
import {AdminInvitePage} from "./AdminInvitePage";

/**
 * Created by STYRLabs2 on 6/7/2017.
 */

export class AdminPage extends BasePage {
    //League ID will be used when communicating with the DB
    private leagueID: number;
    private userID: number;

    private league: League;

    constructor(leagueIdentification: number, userIdentification: number) {
        super();
        this.leagueID = leagueIdentification;
        this.userID = userIdentification;


        this.getLeague().then(league => {
            this.league = league;
            this.createComponents();
        })

    }

    private createComponents() {
        console.log('creating components');
        this.page.title = 'League Settings';
        this.page.background = ColorScheme.Background;


        let leagueTitle = new tabris.TextInput({
            top: 'prev() 20', left: '10%', right: '10%', height: 60,
            message: 'League Title',
            enterKeyType: 'done',
            autoCorrect: true,
            text: this.league.pref.title

        }).appendTo(this.page);

        new tabris.TextInput({
            top: 'prev() 20', left: '10%', right: '10%', height: 60,
            message: 'Broadcast to the league',
            enterKeyType: 'send',
            autoCorrect: true
        }).on('accept', (event) => {
            let currentUser: User = JSON.parse(localStorage.getItem('userObj'));
            let broadcastRequest = {
                leagueId: localStorage.getItem('currentLeagueId'),
                message: event.target.text,
                submitterName: currentUser.name
            };



            ServiceLayer.httpPostAsync('/notification/league', broadcastRequest, (response => {
                window.plugins.toast.showShortCenter(response.message);
                if(response.message === 'Broadcast Sent') {
                    event.target.text = '';
                }
            }));
        }).appendTo(this.page);



        let switchComp = new Composite({
            top: 'prev() 40',
            left: '10%',
            right: '10%',
            height: 60,
            cornerRadius: 5,
            background: ColorScheme.Background,

        }).appendTo(this.page);

        new tabris.TextView({
            text: 'Matches must be approved by an admin',
            left: 2,
            right: '20%',
            top: 0,
            bottom: 0,
            font: 'bold 20px',
            textColor: '#ffffff',
            alignment: 'center'

        }).appendTo(switchComp);

        let approvedByadminSwitch = new tabris.Switch({
            left: 'prev() 10',
            top: 0,
            bottom: 0,
            right: 2,
            checked: this.league.pref.matchesApprovedByAdmin
        }).appendTo(switchComp);

        switchComp.visible = false;


        new customButton({
            top: 'prev() 120',
            left: '10%',
            right: '10%',
            background: ColorScheme.Background
        }, 'Invite Players').on('tap', (event) => {

            let invitePage = new AdminInvitePage();

            this.page.parent().append(invitePage.page);
            invitePage.createInvitePage(this.league);
        }).changeBorderColor('#000000').appendTo(this.page);

        new customButton({
            top: 'prev() 80',
            left: '10%',
            right: '10%',
            background: ColorScheme.Background
        }, 'Apply').on('tap', (event) => {

            let newPref = new LeaguePreferences(approvedByadminSwitch.checked, leagueTitle.text, this.league.pref.timeZone, this.league.pref.scoreRange, this.league.pref.highestScore)
            let updateRequest = {leagueId: this.leagueID, leaguePref: newPref};
            ServiceLayer.httpPostAsync('/league/update', updateRequest, response => {
                console.log(response);
                window.plugins.toast.showShortCenter(response.message);
            })
        }).changeBorderColor('#000000').appendTo(this.page);


        /*new tabris.Button({
         top: 'prev() 50',
         left: '10%',
         right: '10%',
         text: 'DELETE LEAGUE',
         background: '#cb2431'
         }).appendTo(this.page);*/
        return this.page;
    }

    private getLeague(): Promise<League> {
        let p = new Promise((resolve, reject) => {
            ServiceLayer.httpGetAsync('/league', 'leagueId=' + localStorage.getItem('currentLeagueId'), (response) => {
                resolve(response);
            });
        });
        return p;
    }

}