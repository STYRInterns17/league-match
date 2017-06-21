import {BasePage} from "./BasePage";
import * as tabris from 'tabris';
import {Composite, ImageView, ScrollView, TextView, SearchAction} from "tabris";
import {League} from "../../../common/League";
import {customButton} from "../customButton";
import {ServiceLayer} from "../ServiceLayer";
import {User} from "../../../common/User";
import {stripComments} from "tslint/lib/utils";
import {Notification} from "../../../common/Notification";
import {ApprovalType} from "../../../common/ApprovalType";
import {ApprovalData} from "../../../common/ApprovalData";
import {ColorScheme} from "../ColorScheme";
/**
 * Created by STYRLabs2 on 6/7/2017.
 */
export class InvitePage extends BasePage{
    private userObj: User;
    constructor(){
        super();
        this.userObj = JSON.parse(localStorage.getItem('userObj'));
        this.page.title = 'Invite friends';
    }
    public createInvitePage(leagueInfo){
        console.log('Invite1: ' + this.userObj.email);
         let textArray: Array<string> = [];
         let idArray: Array<number> = [];
         //this.page.title = 'Invite friends';

        let comp = new Composite({
            top:0,
            left: 0,
            right: 0,
            bottom: '90%',
            background: ColorScheme.Background
        });
        comp.appendTo(this.page);
        let comp1 = new tabris.Composite({top: comp, bottom: '15%', left: 0, right: 0, background: '#f74'}).appendTo(this.page);
        let comp2 = new tabris.Composite({top: comp1, left: 0, right: 0, background: ColorScheme.Background, bottom: 0}).appendTo(this.page);

        let scrollView = new ScrollView({
            left: 0, right: 0, top: 0, bottom: 0,
            direction: 'vertical',
            background: ColorScheme.Background
        }).appendTo(comp1);


        new tabris.TextInput({
            centerY: 0, left: '10%', right: '10%', alignment: 'center',
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
                            ServiceLayer.httpGetAsync('/user', 'userId=' + response, (response2 )=>{
                                let user = response2.user;
                                let comp = new Composite({
                                    left: 10,
                                    right: 10,
                                    height: 100,
                                    top: 'prev() 10',
                                    background: '#000000',
                                    cornerRadius: 5
                                }).appendTo(scrollView);
                                let innerComp = new Composite({
                                    left: 2,
                                    right: 2,
                                    top: 2,
                                    bottom: 2,
                                    background: ColorScheme.Background,
                                    cornerRadius: 5
                                }).appendTo(comp);
                                let imageView = new ImageView({
                                    centerY: 0, width: 80, height: 80, right: 40,
                                    image: 'assets/' + 'avatar' + (user.pref.avatarId + 1).toString() + '.png'
                                }).appendTo(innerComp);
                                new TextView({
                                    centerY: 0,
                                    right: [imageView, 30],
                                    alignment: 'center',
                                    font: 'bold 20px',
                                    textColor: '#000000',
                                    text: text
                                }).appendTo(innerComp);
                                textArray.push(text);
                                idArray.push(response);
                                console.log(idArray.length);
                                window.plugins.toast.showShortCenter('User Added!');
                            })} else {
                            window.plugins.toast.showShortCenter('User does not exist!');
                        }
                    });
                }
            }else{
                window.plugins.toast.showShortCenter('You are already in the league!');
            }
        }).appendTo(comp);

        const PROPOSALS = ['baseball', 'batman', 'battleship', 'bangkok', 'bangladesh', 'banana', 'b@b.com'];

        let page = new tabris.Page({
            title: 'Search action'
        }).appendTo(this.page.parent());

        let searchBox = new Composite({
            centerX: 0, centerY: 0
        }).appendTo(page);

        let textView = new TextView().appendTo(searchBox);

        let action = new SearchAction({
            title: 'Search',
            image: {
                src: device.platform === 'iOS' ? 'images/search-black-24dp@3x.png' : 'images/search-white-24dp@3x.png',
                scale: 3
            }
        }).on('select', ({target}) => target.text = '')
            .on('input', ({text}) => updateProposals(text))
            .on('accept', ({text}) =>
            {
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
                                ServiceLayer.httpGetAsync('/user', 'userId=' + response, (response2 )=>{
                                    let user = response2.user;

                                    let comp = new Composite({
                                        left: 10,
                                        right: 10,
                                        height: 100,
                                        top: 'prev() 10',
                                        background: '#000000',
                                        cornerRadius: 5
                                    }).appendTo(scrollView);
                                    let innerComp = new Composite({
                                        left: 2,
                                        right: 2,
                                        top: 2,
                                        bottom: 2,
                                        background: ColorScheme.Background,
                                        cornerRadius: 5
                                    }).appendTo(comp);
                                    let imageView = new ImageView({
                                        centerY: 0, width: 80, height: 80, right: 40,
                                        image: 'assets/' + 'avatar' + (user.pref.avatarId + 1).toString() + '.png'
                                    }).appendTo(innerComp);
                                    new TextView({
                                        centerY: 0,
                                        right: [imageView, 30],
                                        alignment: 'center',
                                        font: 'bold 20px',
                                        textColor: '#000000',
                                        text: text
                                    }).appendTo(innerComp);
                                    textArray.push(text);
                                    idArray.push(response);
                                    console.log(idArray.length);
                                    window.plugins.toast.showShortCenter('User Added!');
                                })} else {
                                window.plugins.toast.showShortCenter('User does not exist!');
                            }
                        });
                    }
                }else{
                    window.plugins.toast.showShortCenter('You are already in the league!');
                }
            }).appendTo(this.page.parent());

        updateProposals('');

        new tabris.Button({
            text: 'Open Search',
            centerX: 0,
            top: 'prev() 10'
        }).on('select', () => action.open())
            .appendTo(searchBox);

        function updateProposals(query) {
            action.proposals = PROPOSALS.filter(proposal => proposal.indexOf(query.toLowerCase()) !== -1);
        }

        let finishButton = new customButton({
            left: '10%',
            right: '10%',
            centerY: 0, background: ColorScheme.Background}, 'Finish').appendTo(comp2).on('tap', ()=>{
            //create league
            ServiceLayer.httpPostAsync('/league', leagueInfo, (response) => {
                this.userObj.leagues.push(response.id);
                this.userObj.mmr.push(5000);
                let leagueId: number = response.id;
                localStorage.setItem('currentLeagueId', response.id);
                //store new userObj
                localStorage.removeItem('userObj');
                localStorage.setItem('userObj', JSON.stringify(this.userObj));
                //update logged in user by adding league to user leagues
                ServiceLayer.httpPostAsync('/user/update', this.userObj ,(response) =>{
                    console.log('user leagues array updated');
                    if(idArray.length>0){
                        for(let i =0; i<idArray.length; i++){
                            let notification = {userId: idArray[i],
                            message: 'Invite to ' + leagueInfo.leaguePref.title,
                                type: ApprovalType.InviteApproval,
                                submitterName: this.userObj.email,
                            submitterLeague: leagueInfo.leaguePref.title,
                            approvalData: new ApprovalData(leagueId)
                            };
                            ServiceLayer.httpPostAsync('/notification/user', notification, () =>{
                                console.log('Invite sent')
                            });
                            if(i == idArray.length - 1 ){
                                this.page.dispose();
                            }
                        }
                    }else{
                        this.page.dispose();
                    }
                });
            })
        });
        finishButton.changeBorderColor('#000000');
        return this.page
    }

}

