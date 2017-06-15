import {BasePage} from "./BasePage";
import * as tabris from 'tabris';
import {Composite, ScrollView, TextView} from "tabris";
import {League} from "../../../common/League";
import {customButton} from "../customButton";
import {ServiceLayer} from "../ServiceLayer";
import {User} from "../../../common/User";
import {stripComments} from "tslint/lib/utils";
import {Notification} from "../../../common/Notification";
import {ApprovalType} from "../../../common/ApprovalType";
import {ApprovalData} from "../../../common/ApprovalData";
/**
 * Created by STYRLabs2 on 6/7/2017.
 */
export class InvitePage extends BasePage{
    private userObj: User;
    constructor(){
        super();
        this.userObj = JSON.parse(localStorage.getItem('userObj'));
    }
    public createInvitePage(leagueInfo){
        console.log('Invite1: ' + this.userObj.email);
        let textArray: Array<string> = [];
        let idArray: Array<number> = [];
        this.page.title = 'Invite friends';

        let comp = new Composite({
            top:20,
            left: '10%',
            right: '10%'
        });
        comp.appendTo(this.page);
        let comp1 = new tabris.Composite({top: comp, bottom: '10%', left: 0, right: 0, background: '#f74'}).appendTo(this.page);
        let comp2 = new tabris.Composite({top: comp1, height: 40, left: 0, right: 0}).appendTo(this.page);

        let scrollView = new ScrollView({
            left: 0, right: 0, top: 0, bottom: 0,
            direction: 'vertical',
            background: '#234'
        }).appendTo(comp1);


        new tabris.TextInput({
            top: 0, left: '10%', right: '10%',
            message: 'Add by email',
            enterKeyType: 'done',
            autoCorrect: true
        }).on('accept', ({text}) => {
            console.log('Invite2: ' + this.userObj.email);
            let isMatch = false;
            if(text != this.userObj.email) {
                for (let i = 0; i < textArray.length; i++) {
                    if (textArray[i] == text) {
                        isMatch = true;
                        break;
                    }
                }
                if (isMatch == false) {
                    ServiceLayer.httpGetAsync('/user/name', 'userName=' + text, (response) => {
                        if (Number.isInteger(response)) {
                            new TextView({
                                top: 'prev() 20',
                                centerX: 0,
                                textColor: 'white',
                                text: text
                            }).appendTo(scrollView);
                            textArray.push(text);
                            idArray.push(response);
                            window.plugins.toast.showShortCenter('User Added!');
                        } else {
                            window.plugins.toast.showShortCenter('User does not exist!');
                        }
                    });
                }
            }else{
                window.plugins.toast.showShortCenter('You are already in the league!');
            }
        }).appendTo(comp);



        let finishButton = new customButton({
            left: '10%',
            right: '10%',

            centerY: 0,
        }, 'Finish').appendTo(comp2).on('tap', ()=>{
            ServiceLayer.httpPostAsync('/league', leagueInfo, (response) => {
                this.userObj.leagues.push(response.id);
                let leagueId: number = response.id;
                //store new userObj
                localStorage.removeItem('userObj');
                localStorage.setItem('userObj', JSON.stringify(this.userObj));
                ServiceLayer.httpPostAsync('/user/update', this.userObj ,(response) =>{
                    console.log('user leagues array updated');
                    for(let i =0; i<idArray.length; i++){
                        let notification = new Notification('Invite to ' + leagueInfo.leaguePref.title,
                            this.userObj.email,
                            leagueInfo.leaguePref.title,
                            ApprovalType.InviteApproval,
                            new ApprovalData(leagueId));
                        ServiceLayer.httpPostAsync('/notification/user', notification, () =>{
                            this.page.dispose();
                            console.log('Invite sent')
                        });
                    }
                });
            })
        });
        return this.page
    }

}

