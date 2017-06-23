
/**
 * Created by STYRLabs2 on 6/7/2017.
 */
import {BasePage} from './BasePage';
import {CustomButton} from '../components/CustomButton';
import * as tabris from 'tabris';
import {LeagueCreationPage} from "./LeagueCreationPage";
import {ServiceLayer} from "../util/ServiceLayer";
import {League} from "../../../common/League";
import {User} from "../../../common/User";
import {ColorScheme} from "../util/ColorScheme";
import {CollectionView, Color, Composite, Drawer} from "tabris";
import {CacheManager} from "../util/CacheManager";
import {NotificationPage} from "./NotificationPage";
import {ProfilePage} from "./ProfilePage";
import {LogMatchPage} from "./LogMatchPage";
import {AdminPage} from "./AdminPage";
import {LoginPage} from "./LoginPage";
import {HomePage} from "./HomePage";
import {LeaguePage} from "./LeaguePage";
const IMAGE_PATH = 'assets/';




export class HomePage extends BasePage {
    private leagues;
    public adminButton: CustomButton;
    public userId: number;
    public user: User;
    public collectionView: CollectionView;
    public drawer: Drawer;

    constructor() {
        super();
        this.page.autoDispose = false;
        this.userId = CacheManager.getCurrentUserId();
        this.page.background = ColorScheme.Background;

        this.page.on('disappear', () => this.drawer.enabled = false).on('appear', () => {
            this.drawer.enabled = true;
            this.page.children().dispose();
            this.user = CacheManager.getCurrentUser();
            console.log('here 1 constructor');
            this.reloadLeagues();
        });

        this.leagues = [];
        //
        this.collectionView = new CollectionView();
        this.createComponents();

    }



    private createComponents(){

        console.log('here 3: create components');

        //CREATE DRAWER
        this.drawer = tabris.ui.drawer;
        this.drawer.enabled = true;
        this.drawer.background = ColorScheme.WigetBackground;

        //CREATE BUTTONS
        let profileButton = new CustomButton({
            top: 'prev() 16',
            left: '10%',
            right: '10%',
            background: ColorScheme.Secondary
        }, 'Profile').on('tap', () => {
            this.page.parent().append(new ProfilePage().page);

        });
        profileButton.appendTo(this.drawer);

        let notificationButton = new CustomButton({
            top: 'prev() 16',
            left: '10%',
            right: '10%',
            background: ColorScheme.Secondary
        }, 'Notifications').on('tap', () => {
            this.page.parent().append(new NotificationPage().page);
        });
        notificationButton.appendTo(this.drawer);

        let signOutButton = new CustomButton({
            bottom: 30,
            left: '10%', right: '10%',
            background: '#cb2431'
        }, 'Sign Out').on('tap', () => {
            this.page.dispose();
            CacheManager.clearCache();
            tabris.app.reload();
        });
        signOutButton.appendTo(this.drawer);


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
                console.log('Here ' + this.user);
                //user is in a league but currentLeagueId has not been set ie: logging into a new d
                if (this.user.leagues[0] != null && CacheManager.getCurrentLeagueId() == null) {
                    CacheManager.setCurrentLeagueId(this.user.leagues[0]);
                }

            }
            this.reloadLeagues();
        });
    }


    private createLeaguesView(leagueLength: number): void {

        let comp1 = new tabris.Composite({top: 0, bottom: '15%', left: 0, right: 0}).appendTo(this.page);
        let comp2 = new tabris.Composite({
            top: comp1,
            bottom: 0,
            left: 0,
            right: 0,
            background: ColorScheme.Background
        }).appendTo(this.page);

        this.collectionView = new tabris.CollectionView({
            left: 0, top: 0, right: 0, bottom: 0,
            itemCount: leagueLength,
            cellHeight: 100,
            background: ColorScheme.Background,
            //TODO let user refresh league page
            refreshEnabled: false,
            createCell: () => {
                let cell = new tabris.Composite();

                let comp = new Composite({
                    background: ColorScheme.Background,
                    left: 2,
                    right: 2,
                    top: 2,
                    bottom: 2,
                    cornerRadius: 5,
                    opacity: .96
                });
                new tabris.Composite({
                    height: 80,
                    background: '#000000',
                    left: 10,
                    right: 10,
                    cornerRadius: 5,
                    top: 'prev() 10'
                }).appendTo(cell).append(comp);
                new tabris.TextView({
                    centerY: 0,
                    centerX: 0,
                    alignment: 'center',
                    font: 'bold 20px',
                    textColor: '#000000'
                }).appendTo(comp);
                return cell;
            },
            updateCell: (cell, index) => {
                let title = this.leagues[index].pref.title;
                cell.apply({
                    TextView: {text: title + ' - ' + this.user.mmr[index]}
                });
            }
        }).on('select', ({index}) => {
            CacheManager.setCurrentLeagueId(this.leagues[index].id);
            new LeaguePage().page.appendTo(this.page.parent());
        }).appendTo(comp1);

        new CustomButton({
            centerY: 0,
            left: 10,
            right: 10,
            background: ColorScheme.Background
        }, '➕ Create a League').changeBorderColor('#000000').on('tap', () => {
            this.page.parent().append(new LeagueCreationPage(CacheManager.getCurrentUserId()).page);
        }).appendTo(comp2);

        this.page.background = ColorScheme.Primary;

    }

    private getLeagues(i) {
        let p = new Promise((resolve, reject) => {
            ServiceLayer.httpGetAsync('/league', 'leagueId=' + this.user.leagues[i].toString(), (response) => {
                resolve(response);
            });
        });
        this.leagues.push(p);
    }

    private leagueLoop(): Promise<any> {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < this.user.leagues.length; i++) {
                this.getLeagues(i);
            }
            Promise.all(this.leagues).then((leagues) => {
                this.leagues = leagues;
                this.createLeaguesView(this.leagues.length);
                resolve();
            });
        });
    };

    private reloadLeagues(){
        console.log('here 2: reload leagues');
        this.leagues = [];
        this.page.children().dispose();
        if (!Array.isArray(this.user.leagues) || !this.user.leagues.length) {
            this.page.title = 'You are not in any leagues';
            this.createLeaguesView(0);
        } else {
            this.leagueLoop();
            this.page.title = 'League Page';
        }

    }
}

