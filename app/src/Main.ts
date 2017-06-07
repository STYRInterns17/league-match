import * as tabris from 'tabris';
import {LoginPage} from './pages/LoginPage';
import {NotificationPage} from './pages/NotificationPage'


// Main Function
class Main {
    private navigationView: tabris.NavigationView;

    constructor() {
        this.navigationView = new tabris.NavigationView({
            left: 0, top: 0, right: 0, bottom: 0
        }).appendTo(tabris.ui.contentView);
        console.log('Creating login page');
        new NotificationPage().page.appendTo(this.navigationView);

        //This is where you would create the drawer

        /*let drawer = tabris.ui.drawer;

        drawer.enabled = true;*/

    }
}



new Main();