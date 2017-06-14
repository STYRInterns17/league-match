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

        // //CREATE TEXT COMP
        // let textComp = new tabris.Composite({
        //     centerX: 0
        // }).appendTo(this.page);
        // textComp.append(new tabris.TextView({
        //     text: 'Leaderboards of (League Name here)',
        //     font: 'bold 20px',
        //     textColor: '#fff'
        // }));
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
            //this.page.parent().append(new Profil('test', 'test').createAdminPage());
        });
        profileButton.appendTo(drawer);

        let notificationButton = new customButton({top: 'prev() 30', centerX: 0}, 'Notifications');
        notificationButton.appendTo(drawer);

        let leagueButton = new customButton({top: 'prev() 30', centerX: 0}, 'Leagues').on('tap', () => {
            this.page.parent().append(new LeaguePage().page);
        });
        leagueButton.appendTo(drawer);

        let signOutButton = new customButton({bottom: 30, centerX: 0, background: '#cb2431'}, 'Sign Out').on('tap', () => {
            localStorage.removeItem('userId');
            localStorage.removeItem('userObj');
            this.page.parent().append(new LoginPage().page);
            this.page.dispose();
        });
        signOutButton.appendTo(drawer);

        this.userId = parseInt(localStorage.getItem('userId'));
        ServiceLayer.httpGetAsync('/user', 'userId=' + this.userId, (response) => {
            localStorage.setItem('userObj', JSON.stringify(response));
            this.user = JSON.parse(localStorage.getItem('userObj'));
            //this part stays in HomePage///////////////////////////////////////
            let leaderBoard = new Leaderboard(this.page);
            let collectionViewLeader = leaderBoard.createLeaderBoard();
            this.page.append(collectionViewLeader);
            //////////////////////////////////////////////////////
        });

    }

}
