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
export class HomePage extends BasePage {
    public navigationView: tabris.NavigationView;
    public userId: number;
    public user: User;
    public userLeagueIds: Array = [];
    public colorScheme: string;
    public adminButton: CustomButton;

    constructor() {
        super();

        this.page.background = '#B4E0E1';
        this.page.autoDispose = false;
        console.log('new');

        this.page.on('appear', () => {
            this.reloadLeaderBoard(this.page);
            this.reloadAdminButton();
        });

        this.createComponents();
        this.colorScheme = ColorScheme.Primary;
    }

    public createComponents(): void {


        //CREATE DRAWER
        let drawer = tabris.ui.drawer;
        drawer.enabled = true;
        drawer.background = ColorScheme.WigetBackground;
        this.page.on('disappear', () => drawer.enabled = false).on('appear', () => drawer.enabled = true);
        //CREATE BUTTONS

        let profileButton = new CustomButton({
            top: 'prev() 16',
            left: '10%',
            right: '10%',
            background: ColorScheme.Secondary
        }, 'Profile').on('tap', () => {
            this.page.parent().append(new ProfilePage().page);

        }).changeBorderColor('#000000');
        profileButton.appendTo(drawer);

        let notificationButton = new CustomButton({
            top: 'prev() 16',
            left: '10%',
            right: '10%',
            background: ColorScheme.Secondary
        }, 'Notifications').on('tap', () => {
            this.page.parent().append(new NotificationPage().page);
        }).changeBorderColor('#000000');
        notificationButton.appendTo(drawer);

        let leagueButton = new CustomButton({
            top: 'prev() 16',
            left: '10%',
            right: '10%',
            background: ColorScheme.Secondary
        }, 'Leagues').on('tap', () => {
            let leaguePage = new LeaguePage().page.on('disappear', () => {
                leaguePage.dispose();
            });
            if (this.page.parent() == null) {
            }
            this.page.parent().append(leaguePage);
        }).changeBorderColor('#000000');
        leagueButton.appendTo(drawer);

        let logMatchButton = new CustomButton({
            top: 'prev() 16',
            left: '10%',
            right: '10%',
            background: ColorScheme.Secondary
        }, 'Log A Match').on('tap', () => {
            let logmatchPage = new LogMatchPage().page.on('disappear', () => {
                logmatchPage.dispose();
            });
            this.page.parent().append(logmatchPage);
        }).changeBorderColor('#000000').append(new Composite({backgroundImage: IMAGE_PATH + 'pencil.png'}));
        logMatchButton.appendTo(drawer);


        this.adminButton = new CustomButton({
            top: [logMatchButton, 16],
            left: '10%',
            right: '10%',
            background: ColorScheme.Secondary
        }, 'Admin').on('tap', () => {
            // The '+' signifies that the string is actually a number
            this.page.parent().append(new AdminPage(CacheManager.getCurrentUserId(), CacheManager.getCurrentLeagueId()).page);
        }).changeBorderColor('#000000');
        this.adminButton.appendTo(drawer);

        let signOutButton = new CustomButton({
            bottom: 30,
            left: '10%', right: '10%',
            background: '#cb2431'
        }, 'Sign Out').on('tap', () => {
            this.page.dispose();
            CacheManager.clearCache();
            tabris.app.reload();
        }).changeBorderColor('#000000');
        signOutButton.appendTo(drawer);

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
            this.reloadAdminButton();
            this.reloadLeaderBoard(this.page);
        });

    }

    private reloadLeaderBoard(page: tabris.Page) {
        new Leaderboard(this.page);
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
