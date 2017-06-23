import {BasePage} from "./BasePage";
import * as tabris from "tabris/tabris";
import {ServiceLayer} from "../util/ServiceLayer";
import {UserPreferences} from "../../../common/UserPreferences";
/**
 * Created by STYR-Curt on 6/21/2017.
 */
export class SignUpPage extends  BasePage{
    constructor() {
        super();
        this.page.title = 'Create an Account!';
        this.page.background = '#b8d2ff';
        this.createComponents();
        this.page.on('disappear', () =>{
            this.page.dispose();
        })
    }

    private createComponents(): void {
        let signInLanding = new tabris.Composite({
            layoutData: {left: 0, right: 0, top: 0, bottom: 0},
            background: '#b8d2ff',
        }).appendTo(this.page);

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
        }).appendTo(this.page);

        let usernameSignUp = new tabris.TextInput({
            layoutData: {left: 25, right: 25, top: '30%', height: 50},
            message: 'Email',
            keyboard: 'email'
        }).appendTo(this.page);

        let usernamePasswordSignUp = new tabris.TextInput({
            layoutData: {left: 25, right: 25, top: 'prev() 20', height: 50},
            message: 'Password',
            type: 'password'
        }).appendTo(this.page);

        new tabris.Button({
            layoutData: {left: '25%', right: '25%', height: 40, bottom: '10%'},
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
                            this.page.dispose();
                        }
                        else {
                            window.plugins.toast.showShortCenter('Please enter a new email');
                        }
                    });
                } else {
                    window.plugins.toast.showShortCenter('Your password must have more than 6 characters');
                }
            }
        }).appendTo(this.page)
    }
}