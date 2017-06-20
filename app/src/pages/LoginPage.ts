/**
 * Created by STYRLab1 on 6/6/2017.
 */

import * as tabris from "tabris";
import {BasePage} from './BasePage';
import construct = Reflect.construct;
import {ServiceLayer} from "../ServiceLayer";
import {User} from "../../../common/User";
import {UserPreferences} from "../../../common/UserPreferences";
import {HomePage} from "./HomePage";

export class LoginPage extends BasePage {

    public user: User;
    private userEmail;
    private userPassword;

    constructor() { super(); this.user = JSON.parse(localStorage.getItem('userObj')); this.createComponents(); }

    public createComponents(): void {

        this.page.title = 'Welcome to League Match';
        this.page.background = '#B4E0E1';

        let logInLanding = new tabris.Composite({
            layoutData: {left: 0, right: 0, top: 0, bottom: 0},
            background: '#b8d2ff',
        }).appendTo(this.page);

        new tabris.ImageView({
            layoutData: {left: 0, right: 0, top: 0, bottom: 0},
            image: 'https://iphonewallpapers.tips/wp-content/uploads/2017/02/iphone-wallpapers4-577x1024.jpg',
            scaleMode: 'fill'
        }).appendTo(logInLanding);

        new tabris.TextView({
            layoutData: {left: 25, top: "20%", right: 25},
            alignment: "center",
            font: "bold 48px",
            textColor: '#ffffff',
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
                console.log(response.success);
                if (response.success) {
                    localStorage.setItem('userId', response.user.id);
                    window.plugins.toast.showShortCenter('Welcome');
                    new HomePage(this.page.parent()).page.appendTo(this.page.parent());
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

            let signInLanding = new tabris.Composite({
                layoutData: {left: 0, right: 0, top: 0, bottom: 0},
                background: '#b8d2ff',
            }).appendTo(signUpPage);

            new tabris.ImageView({
                layoutData: {left: 0, right: 0, top: 0, bottom: 0},
                image: 'https://s-media-cache-ak0.pinimg.com/736x/21/c9/90/21c990af42eca5c94e4d311fb7fb70ba.jpg',
                scaleMode: 'fill'
            }).appendTo(signInLanding);

            new tabris.TextView({
                layoutData: {left: 25, top: "20%", right: 25},
                alignment: "center",
                font: "bold 44px",
                textColor: '#FFFFFF',
                text: "Create Account"
            }).appendTo(signUpPage);

            let usernameSignUp = new tabris.TextInput({
                layoutData: {left: 25, right: 25, top: '30%', height: 50},
                message: 'Email',
                keyboard: 'email'
            }).appendTo(signUpPage);

            let usernamePasswordSignUp = new tabris.TextInput({
                layoutData: {left: 25, right: 25, top: 'prev() 20', height: 50},
                message: 'Password',
                type: 'password'
            }).appendTo(signUpPage);

            new tabris.Button({
                layoutData: {left: '25%', right: '25%', top: '80%', bottom: '10%'},
                text: 'Finish'
            }).on('select', () => {

                let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                if (!regex.test(usernameSignUp.text)) {
                    window.plugins.toast.showShortCenter('Please enter a valid email');
                }
                else {
                    if ((usernamePasswordSignUp.text.length > 6)) {

                        let userPref = {
                            userEmail: usernameSignUp.text,
                            userPref: new UserPreferences(usernamePasswordSignUp.text, "Tell us about yourself!", 0)
                        };

                        ServiceLayer.httpPostAsync('/user', userPref, (response: Response) => {
                            if (response.success) {
                                window.plugins.toast.showShortCenter('Account created successfully, please log in');
                                signUpPage.dispose();
                            }
                            else {
                                window.plugins.toast.showShortCenter('Please enter a new email');
                            }
                        });
                    } else {
                        window.plugins.toast.showShortCenter('Your password must have more than 6 characters');
                    }
                }
            }).appendTo(signUpPage)
        }).appendTo(this.page);
    }
}
