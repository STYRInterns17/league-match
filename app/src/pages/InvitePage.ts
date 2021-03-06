import {BasePage} from "./BasePage";
import * as tabris from 'tabris';
import {Composite, ImageView, ScrollView, TextView, SearchAction, AlertDialog} from "tabris";
import {League} from "../../../common/League";
import {CustomButton} from "../components/CustomButton";
import {ServiceLayer} from "../util/ServiceLayer";
import {User} from "../../../common/User";
import {stripComments} from "tslint/lib/utils";
import {Notification} from "../../../common/Notification";
import {ApprovalType} from "../../../common/ApprovalType";
import {ApprovalData} from "../../../common/ApprovalData";
import {ColorScheme} from "../util/ColorScheme";
import {IStorable} from "../../../server/express/src/middleware/IStorable";
import {CacheManager} from "../util/CacheManager";
/**
 * Created by STYRLabs2 on 6/7/2017.
 */
export class InvitePage extends BasePage {
    private userObj: User;

    constructor() {
        super();
        this.userObj = CacheManager.getCurrentUser();
        this.page.title = 'Invite friends';
    }

    public createComponents(leagueInfo) {
        console.log('Invite1: ' + this.userObj.email);
        let textArray: Array<string> = [];
        let idArray: Array<number> = [];
        //this.page.title = 'Invite friends';

        // dispose of page and action search on dissappear
        this.page.on('disappear', () => {
            action.visible = false;
            action.dispose();
        });

        let comp1 = new tabris.Composite({
            top: 0,
            bottom: '15%',
            left: 0,
            right: 0,
            background: '#f74'
        }).appendTo(this.page);
        let comp2 = new tabris.Composite({
            top: comp1,
            left: 0,
            right: 0,
            background: ColorScheme.Background,
            bottom: 0
        }).appendTo(this.page);

        let scrollView = new ScrollView({
            left: 0, right: 0, top: 0, bottom: 0,
            direction: 'vertical',
            background: ColorScheme.Background
        }).appendTo(comp1);


        let action = new SearchAction({
            title: 'Search',
            image: {
                src: tabris.device.platform === 'iOS' ? 'assets/search.png' : 'assets/search.png',
                scale: 2
            }
        }).on('accept', (event) => {
            let text = event.text;
            let isMatch = false;
            if (text != this.userObj.email) {
                for (let i = 0; i < textArray.length; i++) {
                    if (textArray[i] == text) {
                        isMatch = true;
                        break;
                    }
                }
                if (isMatch == false) {
                    ServiceLayer.httpGetAsync('/user/name', 'userName=' + text.toString(), (response) => {
                        if (Number.isInteger(response)) {
                            ServiceLayer.httpGetAsync('/user', 'userId=' + response, (response2) => {
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
                                }).appendTo(innerComp).on('tap', () => {
                                    new AlertDialog({
                                        title: 'Would you like to remove this user?',
                                        buttons: {
                                            ok: 'Yes',
                                            cancel: 'No',
                                        }
                                    }).on({
                                        closeOk: () => {

                                            let index = textArray.indexOf(text);
                                            if (index > -1) {
                                                textArray.splice(index, 1);
                                            }
                                            let index2 = idArray.indexOf(response);
                                            if (index2 > -1) {
                                                idArray.splice(index2, 1);
                                            }
                                            ;
                                            comp.dispose()
                                        },
                                        closeCancel: () => console.log('NO')
                                    }).open();
                                });
                                textArray.push(text);
                                idArray.push(response);
                                console.log(idArray.length);
                                //window.plugins.toast.showShortCenter('User Added!');
                                event.target.text = '';
                            })
                        } else {
                            window.plugins.toast.showShortCenter('User does not exist!');
                        }
                    });
                }
            } else {
                window.plugins.toast.showShortCenter('You are already in the league!');
            }
        })
            .on('input', ({text}) => {
                if (text.length > 0) {
                    ServiceLayer.httpGetAsync('/user/name/prefix', 'prefix=' + text, (response) => {
                        console.log(response);
                        updateProposals(response);
                    })
                }
            })
            .appendTo(this.page.parent());
        updateProposals(['']);

        function updateProposals(array) {
            action.proposals = array;
        }

        let finishButton = new CustomButton({
            left: '10%',
            right: '10%',
            centerY: 0, background: ColorScheme.Background
        }, 'Finish').appendTo(comp2).on('tap', () => {
            //create league
            ServiceLayer.httpPostAsync('/league', leagueInfo, (response) => {
                this.userObj.leagues.push(response.id);
                this.userObj.mmr.push(5000);
                let leagueId: number = response.id;
                CacheManager.setCurrentLeagueId(response.id);
                //store new userObj
                CacheManager.setCurrentUser(this.userObj);
                //update logged in user by adding league to user leagues
                ServiceLayer.httpPostAsync('/user/update', this.userObj, (response) => {
                    console.log('user leagues array updated');
                    if (idArray.length > 0) {
                        for (let i = 0; i < idArray.length; i++) {
                            let notification = {
                                userId: idArray[i],
                                message: 'Invite to ' + leagueInfo.leaguePref.title,
                                type: ApprovalType.InviteApproval,
                                submitterName: this.userObj.email,
                                submitterLeague: leagueInfo.leaguePref.title,
                                approvalData: new ApprovalData(leagueId)
                            };
                            ServiceLayer.httpPostAsync('/notification/user', notification, () => {
                                console.log('Invite sent')
                            });
                            if (i == idArray.length - 1) {
                                this.page.dispose();
                            }
                        }
                    } else {
                        this.page.dispose();
                    }
                });
            })
        });
        finishButton.changeBorderColor('#000000');
        return this.page
    }

}


