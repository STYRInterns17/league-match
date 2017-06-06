/**
 * Created by STYRLab1 on 6/6/2017.
 */

import * as tabris from "tabris";
import {BasePage} from './BasePage';
import { NavigationView, Page, ui } from 'tabris';

export class LoginPage {

    navigationView: NavigationView;

    //constructor() { super(true); }

    private userEmail;
    private userPassword;

    public createComponents(): void {

        console.log('This is the login page');

        /*let back = new tabris.Composite({
        background: '#00FF00',
        layoutData: {left: 0, top: 0, right: 0, bottom: 0}
    }).appendTo(tabris.ui.contentView);

        let bottomHolder = new tabris.Composite({
            layoutData: {left: 0, right: 0, top: 0, bottom: 0}
        }).appendTo(back);*/

        let navigationView = new tabris.NavigationView({
            left: 0, top: 0, right: 0, bottom: 0,
            background: '#00FF00'
        }).appendTo(tabris.ui.contentView);

        new tabris.Page({
            title: 'Page'
        }).appendTo(navigationView);

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