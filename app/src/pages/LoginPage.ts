/**
 * Created by STYRLab1 on 6/6/2017.
 */

import * as tabris from "tabris";
import {BasePage} from './BasePage';
import {ServiceLayer} from "../util/ServiceLayer";
import {User} from "../../../common/User";
import {HomePage} from "./HomePage";
import {SignUpPage} from "./SignUpPage";
import {CacheManager} from "../util/CacheManager";
import {League} from "../../../common/League";
import {LeaguePage} from "./LeaguePage";

export class LoginPage extends BasePage {

    public user: User;
    private userEmail;
    private userPassword;
    private navigationView;
    constructor(navView) {
        super();
        this.user = CacheManager.getCurrentUser();
        this.navigationView = navView;
        this.createComponents();
    }

    private createComponents(): void {

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


        new tabris.TextView({
            layoutData: {left: 0, right: 0, bottom: 0, height: 40},
            highlightOnTouch: true,
            font: "bold 14px",
            alignment: 'center',
            text: 'Sign up!',
            textColor: 'white'
        }).on('tap', () => {

            // Create SignUp Page
            new SignUpPage().page.appendTo(this.page.parent());

        }).appendTo(this.page);

        new tabris.Button({
            layoutData: {left: '25%', right: '25%', height: 40, bottom: 'prev()'},
            text: 'Sign in'
        }).on('select', () => {

            let userValidation = {
                userEmail: this.userEmail.text,
                userPassword: this.userPassword.text
            };

            ServiceLayer.httpPostAsync('/user/validate', userValidation, (response) => {
                console.log(response.success);
                if (response.success) {
                    CacheManager.setCurrentUserId(response.user.id);
                    window.plugins.toast.showShortCenter('Welcome');
                    this.page.dispose();
                    new HomePage().page.appendTo(this.navigationView);
                } else {
                    window.plugins.toast.showShortCenter('Login Invalid');
                }
            });
        }).appendTo(this.page);
    }
}

//THIS IS MY TEST OF BRANCHES