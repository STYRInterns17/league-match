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
//tesdkjsdjkfhskdfgjfgjfgjfgjfgj
export class HomePage extends BasePage {
    public navigationView: tabris.NavigationView;
    public userId: number;
    public user: User;
    public userLeagueIds: Array = [];
    constructor() {
        super();
        this.createComponents();

    }

    public createComponents(): void {


        this.page.background = '#37474f';


        //CREATE DRAWER
        let drawer = tabris.ui.drawer;
        drawer.enabled = true;
        drawer.background = '#37474f';
        this.page.on('disappear', () => drawer.enabled = false ).on('appear', () => drawer.enabled = true );
        //CREATE BUTTONS

        //Add admin verification method here:
        let adminButton = new customButton({top: 'prev() 30', centerX: 0}, 'Administrator').on('tap', () => {
            // The '+' signifies that the string is actually a number
            this.page.parent().append(new AdminPage(+localStorage.getItem('userId'), +localStorage.getItem('leagueId')).page);
        });
        adminButton.appendTo(drawer);

        let profileButton = new customButton({top: 'prev() 30', centerX: 0}, 'Profile').on('tap', () => {
            // TODO What is the profile page?
            //this.page.parent().append(new profile('test', 'test').createAdminPage());
            this.page.parent().append(new ProfilePage().page);
            console.log(localStorage.getItem('userId'));
        });
        profileButton.appendTo(drawer);

        let notificationButton = new customButton({top: 'prev() 30', centerX: 0}, 'Notifications').on('tap', () => {
            this.page.parent().append(new NotificationPage().page);
        });
        notificationButton.appendTo(drawer);

        let leagueButton = new customButton({top: 'prev() 30', centerX: 0}, 'Leagues').on('tap', () => {
            let leaguePage = new LeaguePage().page.on('disappear', () => {
                leaguePage.dispose();
            });
            this.page.parent().append(leaguePage);
        });
        leagueButton.appendTo(drawer);

        let signOutButton = new customButton({bottom: 30, centerX: 0, background: '#cb2431'}, 'Sign Out').on('tap', () => {
            localStorage.clear();
            tabris.app.reload();
        });
        signOutButton.appendTo(drawer);

        this.userId = parseInt(localStorage.getItem('userId'));
        ServiceLayer.httpGetAsync('/user', 'userId=' + this.userId, (response) => {
            //get the current user logged in
            localStorage.setItem('userObj', JSON.stringify(response));
            this.user = JSON.parse(localStorage.getItem('userObj'));
            //set default league to display as the first league of User - any changes to currentleagueId will be set in LeaguePage
            if(this.user.leagues[0] != null) {
                localStorage.setItem('currentLeagueId', this.user.leagues[0].toString());
            }
            // build leaderBoar
            //
            let collectionViewLeader = new Leaderboard(this.page);

            //////////////////////////////////////////////////////
        });

    }

}
