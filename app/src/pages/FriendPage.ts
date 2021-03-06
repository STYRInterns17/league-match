/**
 * Created by STYRLab1 on 6/15/2017.
 */

import {BasePage} from './BasePage';
import * as tabris from 'tabris';
import {ServiceLayer} from "../util/ServiceLayer";
import {User} from "../../../common/User";
import {CustomButton} from '../components/CustomButton';
import {UserPreferences} from "../../../common/UserPreferences";
import {ColorScheme} from "../util/ColorScheme";
import {CacheManager} from "../util/CacheManager";

/**
 * Created by STYRLabs2 on 6/7/2017.
 */

export class FriendPage extends BasePage {

    public userId: number;
    public user: User;

    constructor(user) {
        super();
        this.user = user;
        this.createProfilePage();
    }

    private createProfilePage() {

        let profileAttributeSection = new tabris.Composite({
            layoutData: {left: 0, right: 0, bottom: 0, top: 0},
            background: ColorScheme.Primary,
        }).appendTo(this.page);

        new tabris.ImageView({
            layoutData: {left: 0, right: 0, top: 0, bottom: 0},
            image: 'http://www.retinaiphonewallpapers.com/wp-content/uploads/00025.jpg',
            scaleMode: 'fill'
        }).appendTo(profileAttributeSection);

        let profilePic = new tabris.ImageView({
            layoutData: {left: 0, right: 0, top: '5%', bottom: '60%'},
            image: 'assets/' + 'avatar' + (this.user.pref.avatarId + 1).toString() + '.png',
            scaleMode: 'auto',
            transform: {
                translationX: -400
            }
        }).appendTo(profileAttributeSection);
        this.animateIn(profilePic);

        new tabris.TextView({
            layoutData: {top: '50%', left: '5%', right: '5%'},
            font: 'bold 24px',
            text: "Name: " + this.user.name
        }).appendTo(this.page);

        new tabris.TextView({
            layoutData: {top: 'prev() 60', left: '5%', right: '5%'},
            font: 'bold 24px',
            text: "Bio: " + this.user.pref.bio
        }).appendTo(this.page);

        let messageInput = new tabris.TextInput({
            layoutData: {left: '5%', top: '90%', right: '40%', height: 50},
            message: 'Send your friend a message!',
            enterKeyType: 'send',
            autoCorrect: true
        }).on('accept', (event) => {
            let currentUser: User = CacheManager.getCurrentUser();
            let broadcastRequest = {
                leagueId: CacheManager.getCurrentLeagueId(),
                message: event.target.text,
                submitterName: currentUser.name
            };

            ServiceLayer.httpPostAsync('/notification/league', broadcastRequest, (response => {
                window.plugins.toast.showShortCenter(response.message);
                if(response.message === 'Message Sent') {
                    event.target.text = '';
                }
            }));
        }).appendTo(this.page);

        new CustomButton({
            top: '90%',
            left: 'prev() 45',
            height: 20,
            background: ColorScheme.Background
        }, 'Send').on('tap', (event) => {
            let currentUser: User = CacheManager.getCurrentUser();
            let broadcastRequest = {
                leagueId: CacheManager.getCurrentLeagueId(),
                message: messageInput.text,
                submitterName: currentUser.name
            };
            ServiceLayer.httpPostAsync('/notification/league', broadcastRequest, (response => {
                window.plugins.toast.showShortCenter(response.message);
                if(response.message === 'Message Sent!') {
                    messageInput.text = '';
                }
            }));
        }).changeBorderColor('#000000').appendTo(this.page);

        return this.page;
    }

    private animateIn(widget: tabris.Widget) {
        let direction: number;

        widget.animate({
            transform: {
                translationX: 0
            }
        }, {
            duration: 250,
            easing: "linear"
        });
    }

    private  animateOut(widget: tabris.Widget, outRight: boolean) {
        let direction: number;
        if (outRight) {
            direction = 1;
        } else {
            direction = -1;
        }

        widget.animate({
            transform: {
                translationX: 400 * direction
            }
        }, {
            duration: 250,
            easing: "linear"
        }).then(value => {
            widget.dispose();
        });
    }
}
