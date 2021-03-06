import * as tabris from 'tabris';
import {LoginPage} from './pages/LoginPage';
import {NotificationPage} from './pages/NotificationPage'
import {LogMatchPage} from "./pages/LogMatchPage";
import {Leaderboard} from "./components/Leaderboard";
import {HomePage} from "./pages/HomePage";
import {CacheManager} from "./util/CacheManager";
import {LeaguePage} from "./pages/LeaguePage";


// Main Function
class Main {
    private navigationView: tabris.NavigationView;

    constructor() {
        this.navigationView = new tabris.NavigationView({
            left: 0, top: 0, right: 0, bottom: 0
        }).appendTo(tabris.ui.contentView);


        if (CacheManager.getCurrentUserId() === null) {
            new LoginPage(this.navigationView).page.appendTo(this.navigationView);
        } else {
            new HomePage().page.appendTo(this.navigationView);
        }

    }
}


new Main();