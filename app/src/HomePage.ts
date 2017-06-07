import * as tabris from 'tabris';

import {BasePage} from './BasePage';
import {Leaderboard} from './Leaderboard';
import {customButton} from './customButton';

export class HomePage extends BasePage {
    public navigationView: tabris.NavigationView;
    constructor(){
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
            text: 'Leaderboards',
            font: 'bold 20px',
            textColor: '#fff'
        }));
        //CREATE DRAWER
        let drawer = tabris.ui.drawer;
        drawer.background = '#37474f';
        drawer.enabled = true;

        drawer.on('open', function() {
        }).on('close', function() {
        });
        //CREATE BUTTONS
        let profileButton = new customButton({top: 'prev() 10'}, 'Profile').on('tap', () => console.log('Profile Button Tapped'));
        profileButton.appendTo(drawer);

        let notificationButton = new customButton({top: 'prev() 30'}, 'Notifications');
        notificationButton.appendTo(drawer);

        let leagueButton = new customButton({top: 'prev() 30'}, 'Leagues');
        leagueButton.appendTo(drawer);
        //Add admin verification method here:
        let adminButton = new customButton({top: 'prev() 30'}, 'Administrator').on('tap', () => console.log('Admin Button Tapped'));
        adminButton.appendTo(drawer);

        let leaderBoard = new Leaderboard();
        let collectionViewLeader = leaderBoard.createLeaderBoard([['Michael', 1200, 'avatar1.png'],['Nick', 4, 'avatar1.png'],['Curt', 1200, 'avatar1.png'],['Sal', 9000, 'avatar1.png'], ['Santa', 1200, 'avatar1.png'], ['Rudolph', 1400, 'avatar1.png'], ['Gus', 900, 'avatar1.png'], ['Octocat', 400, 'avatar2.png']]);
        this.page.append(collectionViewLeader);

    }

}

let homePage = new HomePage();
homePage.createComponents();