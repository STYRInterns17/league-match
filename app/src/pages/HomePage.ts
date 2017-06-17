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
import {NavigationView} from "tabris";
import {ColorScheme} from "../ColorScheme";

export class HomePage extends BasePage {
    public navigationView: tabris.NavigationView;
    public userId: number;
    public user: User;
    public userLeagueIds: Array = [];

    constructor(navView: NavigationView) {
        super();
        this.createComponents();
        console.log('Page' + this.page);
        console.log('Page parent' + this.page.parent());
            this.navigationView = navView

    }

    public createComponents(): void {

        this.page.background = '#B4E0E1';

        this.page.on('appear', () => {
            this.reloadLeaderBoard(this.page);
        });

        //CREATE DRAWER
        let drawer = tabris.ui.drawer;
        drawer.enabled = true;
        drawer.background = ColorScheme.Accent;
        this.page.on('disappear', () => drawer.enabled = false).on('appear', () => drawer.enabled = true);
        //CREATE BUTTONS

        //Add admin verification method here:
        let adminButton = new customButton({top: 'prev() 30', centerX: 0}, 'Broadcast').on('tap', () => {
            // The '+' signifies that the string is actually a number
            this.page.parent().append(new AdminPage(+localStorage.getItem('userId'), +localStorage.getItem('leagueId')).page);
        });
        adminButton.appendTo(drawer);

        let profileButton = new customButton({top: 'prev() 30', centerX: 0}, 'Profile').on('tap', () => {
            this.page.parent().append(new ProfilePage().page);

        });
        profileButton.appendTo(drawer);

        let notificationButton = new customButton({top: 'prev() 30', centerX: 0}, 'Notification').on('tap', () => {
            this.page.parent().append(new NotificationPage().page);
        });
        notificationButton.appendTo(drawer);

        let leagueButton = new customButton({top: 'prev() 30', centerX: 0}, 'Leagues').on('tap', () => {
            let leaguePage = new LeaguePage().page.on('disappear', () => {
                leaguePage.dispose();
            });
            if(this.page.parent() == null){
            }
            this.page.parent().append(leaguePage);
        });
        leagueButton.appendTo(drawer);

        let logMatchButton = new customButton({top: 'prev() 30', centerX: 0}, 'Log A Match').on('tap', () => {
            let logmatchPage = new LogMatchPage().page.on('disappear', () => {
                logmatchPage.dispose();
            });
            this.page.parent().append(logmatchPage);
        });
        logMatchButton.appendTo(drawer);

        let signOutButton = new customButton({
            bottom: 30,
            centerX: 0,
            background: ColorScheme.Secondary
        }, 'Sign Out').on('tap', () => {
            localStorage.clear();
            tabris.app.reload();
        });
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
