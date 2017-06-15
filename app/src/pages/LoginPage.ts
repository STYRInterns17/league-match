/**
 * Created by STYRLab1 on 6/6/2017.
 */

import * as tabris from "tabris";
import {BasePage} from './BasePage';
import construct = Reflect.construct;
//import {Page} from "tabris";
import {ServiceLayer} from "../ServiceLayer";
import {UserPreferences} from "../../../common/UserPreferences";
import {UserController} from "../../../server/express/src/controllers/UserController";
import {User} from "../../../common/User";
import {HomePage} from "./HomePage";
import {DBManager} from "../../../server/express/src/db/DBManager";

// TODO Store UserId in cashe on sign in
//localStorage.setItem('userId', id);
export class LoginPage extends BasePage {

    private userEmail;
    private userPassword;

    constructor() {
        super();

        this.createComponents();
    }

    public createComponents(): void {

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

        new tabris.Button({
            layoutData: {left: '25%', right: '25%', top: '80%', bottom: '10%'},
            text: 'Sign in'
        }).on('select', () => {

            let userValidation = {
                userEmail: this.userEmail.text,
                userPassword: this.userPassword.text
            };

            ServiceLayer.httpPostAsync('/user/validate', userValidation, (response) => {
                if (response.success) {
                    localStorage.setItem('userId', response.user.id);
                    window.plugins.toast.showShortCenter('Success!');
                    new HomePage().page.appendTo(this.page.parent());
                    this.page.dispose();
                } else {
                    window.plugins.toast.showShortCenter('Login Invalid');
                }
            });

        }).appendTo(this.page);

        new tabris.TextView({
            layoutData: {left: 0, right: 0, bottom: 0, height: 40},
            highlightOnTouch: true,
            font: "bold 14px",
            alignment: 'center',
            text: 'Sign up!',
            textColor: 'white'
        }).on('tap', () => {

            let signUpPage = new tabris.Page({
                title: 'Create an Account!',
                background: '#b8d2ff'
            }).appendTo(this.page.parent());

            let usernameSignUp = new tabris.TextInput({
                layoutData: {left: 25, right: 25, top: '30%', height: 50},
                message: 'Email'
            }).on('accept', ({text}) => {
                new tabris.TextView({
                    layoutData: {top: '70%', right: 0, left: 0},
                    text: text,
                    font: 'bold 12px',
                }).appendTo(signUpPage);
            }).appendTo(signUpPage);

            let usernamePasswordSignUp = new tabris.TextInput({
                layoutData: {left: 25, right: 25, top: 'prev() 20', height: 50},
                message: 'Password'
            }).on('accept', ({text}) => {
                new tabris.TextView({
                    layoutData: {top: '70%', right: 0, left: 0},
                    text: text,
                    font: 'bold 12px'
                }).appendTo(signUpPage);
            }).appendTo(signUpPage);

            new tabris.Button({
                layoutData: {left: '25%', right: '25%', top: '80%', bottom: '10%'},
                text: 'Sign in'
            }).on('select', () => {

                if (usernameSignUp.text == "" || usernamePasswordSignUp.text == "" || usernameSignUp.text == null || usernamePasswordSignUp.text == null || usernameSignUp.text.indexOf(' ') >=0 || usernamePasswordSignUp.text.indexOf(' ') >=0) {
                    window.plugins.toast.showShortCenter('Please fill all fields to continue...');
                }
                else {
                    let userPref = {
                        userEmail: usernameSignUp.text,
                        userPref: new UserPreferences(usernamePasswordSignUp.text, "Tell us about yourself!", 0)
                    };

                    ServiceLayer.httpPostAsync('/user', userPref, (response: Response) => {
                    });
                    signUpPage.dispose();
                }
            }).appendTo(signUpPage)
        }).appendTo(this.page);
    }
}
