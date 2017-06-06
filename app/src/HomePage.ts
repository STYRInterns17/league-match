import * as tabris from 'tabris';

import {BasePage} from './BasePage';
import {customButton} from './customButton';

export class HomePage extends BasePage {

    constructor() {
        super();
    }

    public createComponents(): void {
        let drawer = tabris.ui.drawer;
        drawer.background = '#37474f';
        drawer.enabled = true;

        let navigationView = new tabris.NavigationView({
            left: 0, top: 0, right: 0, bottom: 0
        }).appendTo(tabris.ui.contentView);


        this.page.appendTo(navigationView);
        this.page.background = '#37474f';

        drawer.on('open', function() {
            console.log('drawer opened');
        }).on('close', function() {
            console.log('drawer closed');
        });

        let profileButton = new customButton({}, 'Profile');
        profileButton.appendTo(drawer);

        let notificationButton = new customButton({}, 'Profile');
        profileButton.appendTo(drawer);

        let leagueButton = new customButton({}, 'Profile');
        profileButton.appendTo(drawer);

        let adminButton = new customButton({}, 'Profile');
        profileButton.appendTo(drawer);


    }

}

let homePage = new HomePage();
homePage.createComponents();