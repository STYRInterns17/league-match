/**
 * Created by STYRLabs2 on 6/6/2017.
 */
import * as tabris from 'tabris';

import {BasePage} from './BasePage';
import {Leaderboard} from '../Leaderboard';
import {customButton} from '../customButton';
import {AdminPage} from './AdminPage';
import {LeaguePage} from "./LeaguePage";
import {ServiceLayer} from "../ServiceLayer";
import {User} from "../../../common/User";
import {NotificationPage} from "./NotificationPage";
import {ProfilePage} from "./ProfilePage";
import {LoginPage} from "./LoginPage";
import {LogMatchPage} from "./LogMatchPage";
import {Button, Color, Composite, NavigationView} from "tabris";
import {ColorScheme} from "../ColorScheme";

const IMAGE_PATH = 'assets/';
export class HomePage extends BasePage {
    public navigationView: tabris.NavigationView;
    public userId: number;
    public user: User;
    public userLeagueIds: Array = [];
    public colorScheme: string;

    constructor() {
        super();
        this.createComponents();
        console.log('Page' + this.page);
        console.log('Page parent' + this.page.parent());
        this.colorScheme =  ColorScheme.Primary;
    }

    public createComponents(): void {

        this.page.background =  '#B4E0E1';

        this.page.on('appear', () => {
            this.reloadLeaderBoard(this.page);
        });

        //CREATE DRAWER
        let drawer = tabris.ui.drawer;
        drawer.enabled = true;
        drawer.background = ColorScheme.WigetBackground;
        this.page.on('disappear', () => drawer.enabled = false).on('appear', () => drawer.enabled = true);
        //CREATE BUTTONS

        //Add admin verification method here:
        let adminButton = new customButton({top: 'prev() 16', left: '10%', right: '10%', background: ColorScheme.Secondary}, 'Broadcast').on('tap', () => {
            // The '+' signifies that the string is actually a number
            this.page.parent().append(new AdminPage(+localStorage.getItem('userId'), +localStorage.getItem('leagueId')).page);
        }).changeBorderColor('#000000');
        adminButton.appendTo(drawer);

        let profileButton = new customButton({top: 'prev() 16',left: '10%', right: '10%', background: ColorScheme.Secondary}, 'Profile').on('tap', () => {
            this.page.parent().append(new ProfilePage().page);

        }).changeBorderColor('#000000');
        profileButton.appendTo(drawer);

        let notificationButton = new customButton({top: 'prev() 16', left: '10%', right: '10%', background: ColorScheme.Secondary}, 'Notifications').on('tap', () => {
            this.page.parent().append(new NotificationPage().page);
        }).changeBorderColor('#000000');
        notificationButton.appendTo(drawer);

        let leagueButton = new customButton({top: 'prev() 16', left: '10%', right: '10%', background: ColorScheme.Secondary}, 'Leagues').on('tap', () => {
            let leaguePage = new LeaguePage().page.on('disappear', () => {
                leaguePage.dispose();
            });
            if(this.page.parent() == null){
            }
            this.page.parent().append(leaguePage);
        }).changeBorderColor('#000000');
        leagueButton.appendTo(drawer);

        let logMatchButton = new customButton({top: 'prev() 16', left: '10%', right: '10%', background: ColorScheme.Secondary }, 'Log A Match').on('tap', () => {
            let logmatchPage = new LogMatchPage().page.on('disappear', () => {
                logmatchPage.dispose();
            });
            this.page.parent().append(logmatchPage);
        }).changeBorderColor('#000000').append(new Composite({backgroundImage: IMAGE_PATH + 'pencil.png'}));
        logMatchButton.appendTo(drawer);

        let signOutButton = new customButton({
            bottom: 30,
            left: '10%', right: '10%',
            background: '#cb2431'
        }, 'Sign Out').on('tap', () => {
            localStorage.clear();
            tabris.app.reload();
        }).changeBorderColor('#000000');
        signOutButton.appendTo(drawer);

        this.userId = parseInt(localStorage.getItem('userId'));
        ServiceLayer.httpGetAsync('/user', 'userId=' + this.userId, (response) => {
            //get the current user logged in
            if (response.message !== 'success') {
                console.log('Invalid UserId');
                localStorage.clear();
                this.page.parent().append(new LoginPage().page);
                this.page.dispose();

            } else {
                localStorage.setItem('userObj', JSON.stringify(response.user));
                this.user = JSON.parse(localStorage.getItem('userObj'));
                //set default league to display as the first league of User - any changes to currentleagueId will be set in LeaguePage
                if (this.user.leagues[0] != null) {
                    localStorage.setItem('currentLeagueId', this.user.leagues[0].toString());
                }

                this.reloadLeaderBoard(this.page);
            }
        });

    }

    private reloadLeaderBoard(page: tabris.Page) {
        new Leaderboard(this.page);
    }

}
