/**
 * Created by STYRLab1 on 6/6/2017.
 */

import * as tabris from "tabris";
import {BasePage} from './BasePage';
import construct = Reflect.construct;
import {Page} from "tabris";

export class LoginPage extends BasePage{

    private userEmail;
    private userPassword;

    constructor(){ super(); }

    public createComponents(): void {

        console.log('TEST');
        
        let navigationView = new tabris.NavigationView({
            left: 0, top: 0, right: 0, bottom: 0,
            background: '#ffffff'
        }).appendTo(tabris.ui.contentView);

        this.page.appendTo(navigationView);
        this.page.background = '#37474f';

        new tabris.TextView({
            layoutData: {left: 25, top: "20%", right: 25},
            alignment: "center",
            font: "bold 48px",
            textColor: 'yellow',
            text: "League Match"
        }).appendTo(this.page);

        this.userEmail = new tabris.TextInput({
            layoutData: {left: 25, right: 25, top: "prev() 10", height: 50},
            message: 'Email',
            keyboard: 'email',
            textColor: 'black',
            id: 'userEmail'
        }).appendTo(this.page);

        this.userPassword = new tabris.TextInput(({
            layoutData: {left: 25, right: 25, top: "prev() 10", height: 50},
            message: 'Password',
            type: 'password',
            id: "userPassword",
            textColor: 'black'
        })).appendTo(this.page);

        new tabris.Button ({
            layoutData: {left: '25%', right: '25%', top: '80%', bottom: '10%'},
            text: 'Sign in'
        }).appendTo(this.page);

        new tabris.TextView({
            layoutData: {left: 0, right: 0, bottom: 0, height: 40},
            highlightOnTouch: true,
            font: "bold 14px",
            alignment: 'center',
            text: 'Sign up!',
            textColor: 'white'
        }).on('tap', () => {
            console.log('Working Button');
        }).appendTo(this.page);
    }

    /*
    User Email --> tabris.TextInput
     */


    /*
     User Password --> tabris.TextInput
     */


    /*
    Verification of input
     */


    /*
     Move page accordingly
     */
}
let loginPage = new LoginPage();
loginPage.createComponents();