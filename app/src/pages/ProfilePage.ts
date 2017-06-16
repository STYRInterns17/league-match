/**
 * Created by STYRLab1 on 6/15/2017.
 */

import {BasePage} from './BasePage';
import * as tabris from 'tabris';
import {ServiceLayer} from "../ServiceLayer";
import {User} from "../../../common/User";
import {customButton} from '../customButton';
import {UserPreferences} from "../../../common/UserPreferences";

/**
 * Created by STYRLabs2 on 6/7/2017.
 */

export class ProfilePage extends BasePage{

    public userId: number;
    public user: User;

    constructor(){ super(); this.createProfilePage(); }

    private createProfilePage(){

        let profilePic = new tabris.Composite({
            layoutData: {left: 0, right: 0, bottom: '60%', top: 0},
            background: '#0bfffa'
        }).appendTo(this.page);

        let imageHolder = new tabris.ImageView({
            layoutData: {left: 0, right: 0, bottom: 0, top: 0},
        }).appendTo(profilePic);

        imageHolder.set("image", {src: "http://gazettereview.com/wp-content/uploads/2016/03/facebook-avatar.jpg"});

        let profileAttributeSection = new tabris.Composite({
            layoutData: {left: 0, right: 0, bottom: 0, top: '40%'},
            background: '#5fffba'
        }).appendTo(this.page);

        let firstName = new tabris.TextInput({
            layoutData: {top: '45%', centerX: 0},
            message: 'Username                    '
        }).appendTo(this.page);

        let bio = new tabris.TextInput({
            layoutData: {top: '55%', centerX: 0},
            message: 'Tell us about yourself!'
        }).appendTo(this.page);

        this.userId = parseInt(localStorage.getItem('userId'));

        ServiceLayer.httpGetAsync('/user', 'userId=' + this.userId, (response) => {

            localStorage.setItem('userObj', JSON.stringify(response.user));

            this.user = JSON.parse(localStorage.getItem('userObj'));

            firstName.text = this.user.pref.name;

            bio.text = this.user.pref.bio;

            this.page.title = this.user.pref.name + "'s Profile Page!";

            let profileDate = new Date(this.user.joinDate);

            new tabris.TextView(({
                layoutData: {top: '90%', left: '59%'},
                text: "Date Joined: " + (profileDate.getMonth() + 1) + " " + profileDate.getDate() + ", " + profileDate.getFullYear()
            })).appendTo(profilePic);

            let changeSettings = new customButton({top: 'prev() 200', centerX: 0}, '   Update   ').on('tap', () => {

                window.plugins.toast.showShortBottom('Your profile has been updated!');

                let userSettings = {
                    userId: this.user.id,
                    userPref: new UserPreferences(this.user.pref.password, bio.text, 0, firstName.text)
                };

                ServiceLayer.httpPostAsync('/user/pref',userSettings, (response) => {
                    this.user.name = firstName.text;
                    this.user.pref.name = firstName.text;
                    this.user.pref.bio = bio.text;
                    this.page.title = this.user.name + "'s Profile";
                    localStorage.removeItem('userObj');
                    localStorage.setItem('userObj', JSON.stringify(this.user));
                })
            });
            changeSettings.appendTo(this.page);
        }); return this.page;
    }
}
