import {BasePage} from './BasePage';
import * as tabris from 'tabris';
import {Composite} from "tabris";
import {User} from "../../../common/User";
import {ServiceLayer} from "../ServiceLayer";
import {ColorScheme} from "../ColorScheme";

/**
 * Created by STYRLabs2 on 6/7/2017.
 */

export class AdminPage extends BasePage {
    //League ID will be used when communicating with the DB
    private leagueID: number;
    private userID: number;

    constructor(leagueIdentification: number, userIdentification: number) {
        super();
        this.leagueID = leagueIdentification;
        this.userID = userIdentification;
        this.createAdminPage();
    }
    private createAdminPage() {
        this.page.title = 'Broadcast Panel';
        this.page.background = ColorScheme.Primary;

        let broadcastBackground = new tabris.Composite({
            layoutData: {left: 0, right: 0, top: 0, bottom: 0},
            background: '#b8d2ff',
        }).appendTo(this.page);

        let imageHolder = new tabris.ImageView({
            layoutData: {left: 0, right: 0, top: 0, bottom: 0},
            image: 'https://s-media-cache-ak0.pinimg.com/736x/51/17/90/5117908f2bd3aa0e0aaf4f2655cd8bfa--plain-wallpaper-girl-wallpaper.jpg',
            scaleMode: 'fill'
        }).appendTo(broadcastBackground);

        new tabris.TextInput({
            top: 20, left: '10%', right: '10%', height: 75,
            message: 'Send a league broadcast',
            enterKeyType: 'send',
            autoCorrect: true
        }).on('accept', (event) => {
            console.log(event);
            let currentUser: User = JSON.parse(localStorage.getItem('userObj'));
            let broadcastRequest = {
                leagueId: localStorage.getItem('currentLeagueId'),
                message: event.target.text,
                submitterName: currentUser.name
            };

            ServiceLayer.httpPostAsync('/notification/league', broadcastRequest, (response => {
                window.plugins.toast.showShortCenter(response.message);
            }));
        }).appendTo(this.page);
        return this.page;
    }

}