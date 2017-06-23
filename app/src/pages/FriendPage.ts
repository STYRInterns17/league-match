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

    constructor() {
        super();
        this.user = CacheManager.getCurrentUser();
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


        let firstName = new tabris.TextView({
            layoutData: {top: '50%', centerX: 0},
            text: this.user.name
        }).appendTo(this.page);

        let bio = new tabris.TextView({
            layoutData: {top: '60%', centerX: 0},
           text: this.user.pref.bio
        }).appendTo(this.page);

        this.userId = CacheManager.getCurrentUserId();

        ServiceLayer.httpGetAsync('/user', 'userId=' + this.userId, (response) => {

            CacheManager.setCurrentUser(response.user);

            this.user = CacheManager.getCurrentUser();

            firstName.text = this.user.name;

            bio.text = this.user.pref.bio;

            this.page.title = this.user.name + "'s Profile Page!";

            let profileDate = new Date(this.user.joinDate);

            new tabris.TextView(({
                layoutData: {top: '41%', centerX: 0},
                text: "Date Joined: " + (profileDate.getMonth() + 1) + " " + profileDate.getDate() + ", " + profileDate.getFullYear()
            })).appendTo(this.page);

        });
        return this.page;
    }
    
    private animateIn(widget: tabris.Widget) {
        let direction: number;

        widget.animate({
            transform: {
                translationX: 0
            }
        },{
            duration: 250,
            easing: "linear"
        });
    }

    private  animateOut(widget: tabris.Widget, outRight: boolean) {
        let direction: number;
        if(outRight) {
            direction = 1;
        } else {
            direction = -1;
        }

        widget.animate({
            transform: {
                translationX: 400 * direction
            }
        },{
            duration: 250,
            easing: "linear"
        }).then(value => {
            widget.dispose();
        });
    }
}
