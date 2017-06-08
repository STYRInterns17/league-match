import {BasePage} from "./BasePage";
import * as tabris from 'tabris';
import {Composite} from "tabris";
/**
 * Created by STYRLabs2 on 6/7/2017.
 */
export class InvitePage extends BasePage{
    constructor(){
        super();
    }
    public createInvitePage(){
        this.page.title = 'Invite friends';
        let comp = new Composite({
            centerY: 0,
            left: '10%',
            right: '10%'
        });
        comp.appendTo(this.page);

         new tabris.TextInput({
            top: 20, left: '10%', right: '10%',
            message: 'Add by email',
            enterKeyType: 'done',
            autoCorrect: true
        }).on('accept', function({text}) {
             (new tabris.TextView({
                 top: 'prev() 20', left: '20%',
                 text: text + ' added!'
             }).appendTo(comp);

        }).appendTo(this.page);
        return this.page
    }

}