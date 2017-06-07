/**
 * Created by STYRLabs2 on 6/7/2017.
 */
import {BasePage} from './BasePage';
import * as tabris from 'tabris';
import {Composite} from "tabris";


export class LeagueCreationPage extends BasePage{
    private ownerID: string;
    constructor(userIdentification: string){
        super();
        this.ownerID = userIdentification;
    }

    public createAdminPage(){
        this.page.title = 'Administration Panel';
        new tabris.TextInput({
            top: 20, left: '10%', right: '10%',
            message: 'Send a league broadcast',
            enterKeyType: 'send',
            autoCorrect: true
        }).appendTo(this.page);
        let switchComp = new Composite({
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
        }).appendTo(this.page);
        return this.page;
    }

}