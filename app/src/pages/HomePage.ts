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
//tesdkjsdjkfhskdfgjfgjfgjfgjfgj
export class HomePage extends BasePage {
    public navigationView: tabris.NavigationView;
    public userId: string;
    public user: User;
    public userLeagueIds: Array = [];
    constructor() {
        super();
        this.navigationView = new tabris.NavigationView({
            left: 0, top: 0, right: 0, bottom: 0
        }).appendTo(tabris.ui.contentView);

    }

    public createComponents(): void {

        this.page.appendTo(this.navigationView);
        this.page.background = '#37474f';

        //CREATE TEXT COMP
        let textComp = new tabris.Composite({
            centerX: 0
        }).appendTo(this.page);
        textComp.append(new tabris.TextView({
            text: 'Leaderboards of (League Name here)',
            font: 'bold 20px',
            textColor: '#fff'
        }));
        //CREATE DRAWER
        let drawer = tabris.ui.drawer;
        drawer.enabled = true;
        drawer.background = '#37474f';
        this.page.on('disappear', () => drawer.enabled = false ).on('appear', () => drawer.enabled = true );
        //CREATE BUTTONS

        // TODO Added all button links
        //Add admin verification method here:
        let adminButton = new customButton({top: 'prev() 30', centerX: 0}, 'Administrator').on('tap', () => {
            this.page.parent().append(new AdminPage('test', 'test').createAdminPage());
        });
        adminButton.appendTo(drawer);

        let profileButton = new customButton({top: 'prev() 30', centerX: 0}, 'Profile').on('tap', () => console.log('Profile Button Tapped'));
        profileButton.appendTo(drawer);

        let notificationButton = new customButton({top: 'prev() 30', centerX: 0}, 'Notifications');
        notificationButton.appendTo(drawer);

        let leagueButton = new customButton({top: 'prev() 30', centerX: 0}, 'Leagues').on('tap', () => this.navigationView.append(new LeaguePage(this.navigationView).page));
        leagueButton.appendTo(drawer);




        this.userId = localStorage.getItem('userId');
        ServiceLayer.httpGetAsync('/user', 'userId=' + this.userId, (response) => {
            localStorage.setItem('userObj', JSON.stringify(response));
            this.user = JSON.parse(localStorage.getItem('userObj'));

            //
            for(let i = 0; i<this.user.leagues.length; i++){
                this.userLeagueIds.push(this.user.leagues[i])
            }
            localStorage.setItem('userLeagueId', this.userLeagueIds.toString());

            //this part stays in HomePage///////////////////////////////////////
            let leaderBoard = new Leaderboard();
            let collectionViewLeader = leaderBoard.createLeaderBoard([['Michael', 1200, 'avatar1.png'],['Nick', 4, 'avatar1.png'],['Curt', 1200, 'avatar1.png'],['Sal', 9000, 'avatar1.png'], ['Santa', 1200, 'avatar1.png'], ['Rudolph', 1400, 'avatar1.png'], ['Gus', 900, 'avatar1.png'], ['Octocat', 400, 'avatar2.png']]);
            this.page.append(collectionViewLeader);
            //////////////////////////////////////////////////////
        });

    }

}

let homePage = new HomePage();
homePage.createComponents();