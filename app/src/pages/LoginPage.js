"use strict";
/**
 * Created by STYRLab1 on 6/6/2017.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var tabris = require("tabris");
var BasePage_1 = require("./BasePage");
//import {Page} from "tabris";
var ServiceLayer_1 = require("../ServiceLayer");
var UserPreferences_1 = require("../../../common/UserPreferences");
var LoginPage = (function (_super) {
    __extends(LoginPage, _super);
    function LoginPage() {
        return _super.call(this) || this;
    }
    LoginPage.prototype.createComponents = function () {
        var _this = this;
        console.log('TEST');
        var navigationView = new tabris.NavigationView({
            left: 0, top: 0, right: 0, bottom: 0,
            background: '#fffafd',
        }).appendTo(tabris.ui.contentView);
        this.page.appendTo(navigationView);
        this.page.background = '#37474f';
        new tabris.TextView({
            layoutData: { left: 25, top: "20%", right: 25 },
            alignment: "center",
            font: "bold 48px",
            textColor: 'yellow',
            text: "League Match"
        }).appendTo(this.page);
        this.userEmail = new tabris.TextInput({
            layoutData: { left: 25, right: 25, top: "prev() 10", height: 50 },
            message: 'Email',
            keyboard: 'email',
            textColor: 'black',
            id: 'userEmail'
        }).appendTo(this.page);
        this.userPassword = new tabris.TextInput(({
            layoutData: { left: 25, right: 25, top: "prev() 10", height: 50 },
            message: 'Password',
            type: 'password',
            id: "userPassword",
            textColor: 'black'
        })).appendTo(this.page);
        new tabris.Button({
            layoutData: { left: '25%', right: '25%', top: '80%', bottom: '10%' },
            text: 'Sign in'
        }).on('select', function () {
            var userValidation = {
                userEmail: _this.userEmail.text,
                userPassword: _this.userPassword.text
            };
            console.log(JSON.stringify(userValidation));
            ServiceLayer_1.ServiceLayer.httpPostAsync('/user/validate', userValidation, function (response) {
                console.log('yeedddde');
                if (response.success) {
                    console.log('yeee');
                }
                else {
                    console.log('noo');
                }
            });
        }).appendTo(this.page);
        new tabris.TextView({
            layoutData: { left: 0, right: 0, bottom: 0, height: 40 },
            highlightOnTouch: true,
            font: "bold 14px",
            alignment: 'center',
            text: 'Sign up!',
            textColor: 'white'
        }).on('tap', function () {
            var signUpPage = new tabris.Page({
                title: 'Create an Account!',
                background: '#b8d2ff'
            }).appendTo(navigationView);
            var usernameSignUp = new tabris.TextInput({
                layoutData: { left: 25, right: 25, top: '30%', height: 50 },
                message: 'Email'
            }).on('accept', function (_a) {
                var text = _a.text;
                new tabris.TextView({
                    layoutData: { top: '70%', right: 0, left: 0 },
                    text: text,
                    font: 'bold 12px',
                }).appendTo(signUpPage);
            }).appendTo(signUpPage);
            var usernamePasswordSignUp = new tabris.TextInput({
                layoutData: { left: 25, right: 25, top: 'prev() 20', height: 50 },
                message: 'Password'
            }).on('accept', function (_a) {
                var text = _a.text;
                new tabris.TextView({
                    layoutData: { top: '70%', right: 0, left: 0 },
                    text: text,
                    font: 'bold 12px'
                }).appendTo(signUpPage);
            }).appendTo(signUpPage);
            new tabris.Button({
                layoutData: { left: '25%', right: '25%', top: '80%', bottom: '10%' },
                text: 'Sign in'
            }).on('select', function () {
                if (usernameSignUp.text == "" || usernamePasswordSignUp.text == "") {
                    window.plugins.toast.showShortCenter('Please fill all fields to continue...');
                }
                else {
                    var userPref = {
                        userEmail: usernameSignUp.text,
                        userPref: new UserPreferences_1.UserPreferences(usernamePasswordSignUp.text, "Tell us about yourself!", 0)
                    };
                    ServiceLayer_1.ServiceLayer.httpPostAsync('/user', userPref, function (response) { });
                    signUpPage.dispose();
                }
            }).appendTo(signUpPage);
            /*let profilePic = new tabris.Composite({
                layoutData: {left: 0, right: 0, bottom: '60%', top: 0},
                background: '#0bfffa'
            }).appendTo(signUpPage);

            let imageHolder = new tabris.ImageView({
                layoutData: {left: 0, right: 0, bottom: 0, top: 0},
            }).appendTo(profilePic);

            imageHolder.set("image", {src: "http://gazettereview.com/wp-content/uploads/2016/03/facebook-avatar.jpg"});

            let profileAttributeSection = new tabris.Composite({
                layoutData: {left: 0, right: 0, bottom: 0, top: '40%'},
                background: '#5fffba'
            }).appendTo(signUpPage);

            let firstName = new tabris.TextInput({
                layoutData: {top: '50%', left: '20%'},
                message: 'First name'
            }).on('accept', ({text}) => {
                new tabris.TextView({
                    layoutData: {top: '40%', left: '20%', right: '70%'},
                    text: text,
                    font: 'bold 24px'
                }).appendTo(signUpPage);
            }).appendTo(signUpPage);

            let lastName = new tabris.TextInput({
                layoutData: {top: '50%', left: '60%'},
                message: 'Last name'
            }).on('accept', ({text}) => {
                new tabris.TextView({
                    layoutData: {top: '40%', right: '20%', left: '60%'},
                    text: text,
                    font: 'bold 24px'
                }).appendTo(signUpPage);
            }).appendTo(signUpPage);

            let bio = new tabris.TextInput({
                layoutData: {top: '60%', centerX: 0},
                message: 'Tell us about yourself...'
            }).on('accept', ({text}) => {
                new tabris.TextView({
                    layoutData: {top: '70%', right: 0, left: 0},
                    text: text,
                    font: 'bold 12px'
                }).appendTo(signUpPage);
            }).appendTo(signUpPage);


            new tabris.Button ({
                layoutData: {left: '25%', right: '25%', top: '80%', bottom: '10%'},
                text: 'Next'
            }).on('select', () => {
                if(bio.text == "" || firstName.text == "" || lastName.text == ""){
                    window.plugins.toast.showShortCenter('Please fill all fields to continue...');
                }
                else {

                    let userInformation = new tabris.Page({
                        title: 'Finish Up',
                        background: '#b8d2ff'
                    }).appendTo(navigationView);

                    let userEmailSignUp = new tabris.TextInput({
                        layoutData: {left: 25, right: 25, top: '30%', height: 50},
                        message: 'Email',
                        keyboard: 'email',
                        textColor: 'black',
                        id: 'userEmail',
                    }).appendTo(userInformation);

                    let userPasswordSignUp = new tabris.TextInput({
                        layoutData: {left: 25, right: 25, top: "prev() 10", height: 50},
                        message: 'Password',
                        type: 'password',
                        id: "userPassword",
                        textColor: 'black',
                    }).on('accept', ({emailText}) => {
                        new tabris.TextView({
                            top: 'prev() 20', left: '20%',
                            text: emailText,
                        }).appendTo(userInformation)
                    }).appendTo(userInformation);

                    let testingPassword = new tabris.TextInput({
                        layoutData: {top: '60%', centerX: 0},
                        message: 'Pass'
                    }).on('accept', ({text}) => {
                        new tabris.TextView({
                            layoutData: {top: '70%', right: 0, left: 0},
                            text: text,
                            font: 'bold 12px'
                        }).appendTo(userInformation);
                    }).appendTo(userInformation);

                    new tabris.Button ({
                        layoutData: {left: '25%', right: '25%', top: '80%', bottom: '10%'},
                        text: 'Sign in'
                    }).appendTo(userInformation);

                    let passingUserInformation = {
                        "email": userEmailSignUp.text,
                        "password": testingPassword.text,
                        "bio": bio.text,
                        "avatarId": 0
                    };

                   ServiceLayer.httpPostAsync('/user', passingUserInformation, (response: Response) => {})
                }
            }).appendTo(signUpPage);*/
        }).appendTo(this.page);
    };
    return LoginPage;
}(BasePage_1.BasePage));
exports.LoginPage = LoginPage;
var loginPage = new LoginPage();
loginPage.createComponents();
