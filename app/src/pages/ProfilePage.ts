/**
 * Created by STYRLab1 on 6/15/2017.
 */

import {BasePage} from './BasePage';
import * as tabris from 'tabris';
import {Composite} from "tabris";
import {ServiceLayer} from "../ServiceLayer";

/**
 * Created by STYRLabs2 on 6/7/2017.
 */

export class ProfilePage extends BasePage{

    constructor(){ super(); this.createProfilePage(); }

    private createProfilePage(){
        this.page.title = 'Profile Page';

        ServiceLayer.httpGetAsync('/user', this.userId, (response => {

        }));

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
            layoutData: {top: '50%', left: '20%'},
            message: 'First name'
        }).on('accept', ({text}) => {
            new tabris.TextView({
                layoutData: {top: '40%', left: '20%', right: '70%'},
                text: text,
                font: 'bold 24px'
            }).appendTo(this.page);
        }).appendTo(this.page);

        let lastName = new tabris.TextInput({
            layoutData: {top: '50%', left: '60%'},
            message: 'Last name'
        }).on('accept', ({text}) => {
            new tabris.TextView({
                layoutData: {top: '40%', right: '20%', left: '60%'},
                text: text,
                font: 'bold 24px'
            }).appendTo(this.page);
        }).appendTo(this.page);

        let bio = new tabris.TextInput({
            layoutData: {top: '60%', centerX: 0},
            message: 'Tell us about yourself...'
        }).on('accept', ({text}) => {
            new tabris.TextView({
                layoutData: {top: '70%', right: 0, left: 0},
                text: text,
                font: 'bold 12px'
            }).appendTo(this.page);
        }).appendTo(this.page);

        return this.page;
    }
}
