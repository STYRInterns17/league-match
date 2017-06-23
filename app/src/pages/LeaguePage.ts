/**
 * Created by STYRLabs2 on 6/6/2017.
 */
import * as tabris from 'tabris';

import {BasePage} from './BasePage';
import {Leaderboard} from '../components/Leaderboard';
import {CustomButton} from '../components/CustomButton';
import {AdminPage} from './AdminPage';
import {LeaguePage} from "./LeaguePage";
import {ServiceLayer} from "../util/ServiceLayer";
import {User} from "../../../common/User";
import {NotificationPage} from "./NotificationPage";
import {ProfilePage} from "./ProfilePage";
import {LoginPage} from "./LoginPage";
import {LogMatchPage} from "./LogMatchPage";
import {Button, Color, Composite, Drawer, NavigationView} from "tabris";
import {ColorScheme} from "../util/ColorScheme";
import {League} from "../../../common/League";
import {CacheManager} from "../util/CacheManager";

const IMAGE_PATH = 'assets/';
export class LeaguePage extends BasePage {
    public navigationView: tabris.NavigationView;
    public userId: number;
    public user: User;
    public userLeagueIds: Array = [];
    public adminButton: CustomButton;

    constructor() {
        super();
        this.page.background = '#B4E0E1';
        console.log('new');
        this.page.on('appear', () => {
            this.reloadLeaderBoard(this.page);
            this.reloadAdminButton();
        });

        this.createComponents();
    }

    public createComponents(): void {

        this.userId = CacheManager.getCurrentUserId();
        ServiceLayer.httpGetAsync('/user', 'userId=' + this.userId, (response) => {
            //get the current user logged in
            if (response.message !== 'success') {
                console.log('Invalid UserId');
                CacheManager.clearCache();
                this.page.parent().append(new LoginPage().page);
                this.page.dispose();

            } else { //success
                CacheManager.setCurrentUser(response.user);
                this.user = CacheManager.getCurrentUser();
                //set default league to display as the first league of User - any changes to currentleagueId will be set in LeaguePage

                //user is in a league but currentLeagueId has not been set ie: logging into a new d
                if (this.user.leagues[0] != null && CacheManager.getCurrentLeagueId() == null) {
                    CacheManager.setCurrentLeagueId(this.user.leagues[0]);
                }
            }
            this.reloadLeaderBoard(this.page);
            this.reloadAdminButton();
        });

    }

    private reloadLeaderBoard(page: tabris.Page) {
        new Leaderboard(this.page);
        let buttonComp = new Composite({top: 0, bottom: 0, left: 0, right: 0, background: ColorScheme.Background});
        buttonComp.appendTo(this.page);

        let logMatchButton = new CustomButton({
            left: '10%', right: '60%',top: 10,
            background: ColorScheme.Background
        }, 'Log').on('tap', () => {
            let logmatchPage = new LogMatchPage().page.on('disappear', () => {
                logmatchPage.dispose();
            });
            this.page.parent().append(logmatchPage);
        }).changeBorderColor('#000000').append(new Composite({backgroundImage: IMAGE_PATH + 'pencil.png'}));
        logMatchButton.appendTo(buttonComp);


        this.adminButton = new CustomButton({
            left: '60%', right: '10%',top: 10,
            background: ColorScheme.Background
        }, 'Admin').on('tap', () => {
            // The '+' signifies that the string is actually a number
            this.page.parent().append(new AdminPage().page);
        }).changeBorderColor('#000000');
        this.adminButton.appendTo(buttonComp);
    }

    public reloadAdminButton() {
        if (CacheManager.getCurrentLeagueId() != null) {
            ServiceLayer.httpGetAsync('/league', 'leagueId=' + CacheManager.getCurrentLeagueId().toString(), (league: League) => {
                if (league.adminIds.indexOf(this.userId) != -1) {
                    this.adminButton.enabled = true;
                    this.adminButton.opacity = 1;
                } else {
                    this.adminButton.enabled = false;
                    this.adminButton.opacity = 0;
                }
            });
        } else {
            this.adminButton.enabled = false;
            this.adminButton.opacity = 0;
        }

    }

}



















