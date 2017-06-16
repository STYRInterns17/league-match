import {BasePage} from './BasePage';
import * as tabris from 'tabris';
import {Composite} from "tabris";
import {User} from "../../../common/User";
import {ServiceLayer} from "../ServiceLayer";

/**
 * Created by STYRLabs2 on 6/7/2017.
 */

export class AdminPage extends BasePage {
    //League ID will be used when communicating with the DB
    private leagueID: number;
    private userID: number;

    constructor(leagueIdentification: number, userIdentification: number) {
        super();
        this.leagueID = leagueIdentification;
        this.userID = userIdentification;

        this.createAdminPage();
    }

    private createAdminPage() {
        this.page.title = 'Administration Panel';
        new tabris.TextInput({
            top: 20, left: '10%', right: '10%',
            message: 'Send a league broadcast',
            enterKeyType: 'send',
            autoCorrect: true
        }).on('accept', (event) => {
            console.log(event);
            let currentUser: User = JSON.parse(localStorage.getItem('userObj'));
            let broadcastRequest = {
                leagueId: localStorage.getItem('currentLeagueId'),
                message: event.target.text,
                submitterName: currentUser.name
            };

            ServiceLayer.httpPostAsync('/notification/league', broadcastRequest, (response => {
                window.plugins.toast.showShortCenter(response.message);
            }));
        }).appendTo(this.page);
        /*let switchComp = new Composite({
         top: 'prev() 40',
         left: 0,
         right: 0
         }).appendTo(this.page);
         switchComp.append(new tabris.TextView({
         text: 'Matches must be approved by admin',
         left: '10%',
         centerY: 0
         }));
         switchComp.append(new tabris.Switch({
         left: 'prev() 10' ,
         id: 'switch',
         centerY: 0,
         checked: true
         }));
         new tabris.TextInput({
         top: 'prev() 40', left: '10%', right: '10%',
         message: 'League Name',
         enterKeyType: 'done',
         autoCorrect: true,

         }).appendTo(this.page);

         new tabris.Button({
         top: 'prev() 80',
         left: '10%',
         right: '10%',
         text: 'Invite...'
         }).appendTo(this.page);


         new tabris.Button({
         top: 'prev() 50',
         left: '10%',
         right: '10%',
         text: 'DELETE LEAGUE',
         background: '#cb2431'
         }).appendTo(this.page);*/
        return this.page;
    }

}