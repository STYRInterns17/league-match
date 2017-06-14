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

                    //console.log("User id that is being passed to local: " + userValidation.userEmail.getItem());
                    //localStorage.setItem('userId', userValidation.userEmail.getItem());
                    window.plugins.toast.showShortCenter('Success!');
                    new HomePage().page.appendTo(this.page.parent());
                    this.page.dispose();
                }
                else {
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

                if (usernameSignUp.text == "" || usernamePasswordSignUp.text == "") {
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
