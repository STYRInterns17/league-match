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

export class ProfilePage extends BasePage {

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
            background: ColorScheme.Primary
        }).appendTo(this.page);

        new tabris.ImageView({
            layoutData: {left: 0, right: 0, top: 0, bottom: 0},
            image: 'http://hunsci.com/data/out/119/546417.png',
            scaleMode: 'fill'
        }).appendTo(profileAttributeSection);

        new tabris.ImageView({
            layoutData: {left: 0, right: 0, top: '5%', bottom: '60%'},
            image: 'assets/' + 'avatar' + (this.user.pref.avatarId + 1).toString() + '.png',
            scaleMode: 'auto'
        }).appendTo(profileAttributeSection);

        let firstName = new tabris.TextInput({
            layoutData: {top: '50%', centerX: 0},
            message: 'Username                    '
        }).appendTo(this.page);

        let bio = new tabris.TextInput({
            layoutData: {top: '60%', centerX: 0},
            message: 'Tell us about yourself!'
        }).appendTo(this.page);

        this.userId = CacheManager.getCurrentUserId();

        new tabris.Button({
            right: 5, top: '20%',
            text: '⇨',
        }).on('select', () => {

            if (this.user.pref.avatarId <= 10)
            {
                this.user.pref.avatarId++;
            }
            else
            {
                this.user.pref.avatarId = 0;
            }

            new tabris.ImageView({
                layoutData: {left: 0, right: 0, top: '5%', bottom: '60%'},
                image: 'assets/' + 'avatar' + (this.user.pref.avatarId + 1).toString() + '.png',
                scaleMode: 'auto'
            }).appendTo(profileAttributeSection);

            CacheManager.setCurrentUser(this.user);
        }).appendTo(this.page);

        new tabris.Button({
            left: 5, top: '20%',
            text: '⇦'
        }).on('select', () => {

            if (this.user.pref.avatarId >= 0)
            {
                this.user.pref.avatarId--;
            }
            else
            {
                this.user.pref.avatarId = 10;
            }

            new tabris.ImageView({
                layoutData: {left: 0, right: 0, top: '5%', bottom: '60%'},
                image: 'assets/' + 'avatar' + (this.user.pref.avatarId + 1).toString() + '.png',
                scaleMode: 'auto'
            }).appendTo(profileAttributeSection);

            CacheManager.setCurrentUser(this.user);
        }).appendTo(this.page);

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

            let changeSettings = new CustomButton({top: 'prev() 200', centerX: 0}, '   Update   ').on('tap', () => {

                window.plugins.toast.showShortBottom('Your profile has been updated!');

                let nameUpdateRequest = {userId: this.user.id, userName: firstName.text};

                ServiceLayer.httpPostAsync('/user/name/update', nameUpdateRequest, response => {
                    window.plugins.toast.showShortBottom(response.message);
                });

                let userSettings = {
                    userId: this.user.id,
                    userPref: new UserPreferences(this.user.pref.password, bio.text, this.user.pref.avatarId)
                };
                ServiceLayer.httpPostAsync('/user/pref', userSettings, () => {
                    this.user.name = firstName.text;
                    this.user.pref.bio = bio.text;
                    this.page.title = this.user.name + "'s Profile Page!";
                    CacheManager.setCurrentUser(this.user);
                })
            });
            changeSettings.appendTo(this.page);
        });
        return this.page;
    }
}
