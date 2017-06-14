import * as tabris from 'tabris';
import {LoginPage} from './pages/LoginPage';
import {NotificationPage} from './pages/NotificationPage'
import {LogMatchPage} from "./pages/LogMatchPage";
import {Leaderboard} from "./Leaderboard";
import {HomePage} from "./pages/HomePage";


// Main Function
class Main {
    private navigationView: tabris.NavigationView;

    constructor() {
        this.navigationView = new tabris.NavigationView({
            left: 0, top: 0, right: 0, bottom: 0
        }).appendTo(tabris.ui.contentView);

        // Use this line to clear your userId in cashe
        // localStorage.removeItem('userId');
        if (localStorage.getItem('userId') === null) {
            new LoginPage().page.appendTo(this.navigationView);
        } else {
            new HomePage().page.appendTo(this.navigationView);
        }


        //This is where you would create the drawer

        /*let drawer = tabris.ui.drawer;

         drawer.enabled = true;*/

    }
}


new Main();