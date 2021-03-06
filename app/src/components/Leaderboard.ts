import {Composite, Page} from "tabris";
import {User} from "../../../common/User";
import {League} from "../../../common/League";
import {ServiceLayer} from "../util/ServiceLayer";
import {ColorScheme} from "../util/ColorScheme";
import {CacheManager} from "../util/CacheManager";
import {FriendPage} from "../pages/FriendPage";
/**
 * Created by Michael on 6/6/2017.
 */
const {CollectionView, Composite, TextView, ImageView} = require('tabris');
const IMAGE_PATH = 'assets/';



export class Leaderboard{
    page: Page;
    users: Array<User> = [];
    league: League;
    private userObj: User;

    constructor(page: Page){
        this.userObj = CacheManager.getCurrentUser();
        //this.users.push(this.userObj);
        this.page = page;
        this.reloadLeaderBoard();

    }

    public reloadLeaderBoard(): void {
        console.log('ReloadingLeaderBoard');
        console.log('Current league Id =', CacheManager.getCurrentLeagueId());
        this.page.children().dispose();
        if(CacheManager.getCurrentLeagueId() != null) {
            this.getLeague().then(value => {
                this.league = value;
                let memberIds: Array<number> = [];
                memberIds = value.playerIds;

                if (memberIds.length > 1) {
                    this.leagueLoop(memberIds).then(() => {
                        console.log('1 creating leaderboard with actual members');
                        this.createLeaderBoard().appendTo(this.page);
                    });
                } else {
                    this.leagueLoop(memberIds).then(() => {
                        console.log('2 creating leaderboard with only admin');
                        this.createLeaderBoard().appendTo(this.page);
                    });
                }
            });
        }else{
            this.page.title = 'Use the side bar to join a league!';
        }
    }


    private createLeaderBoard(): tabris.CollectionView{
        function bubbleSortByMMR(a: Array, leagueId: number)
        {
            let swapped;
            do {
                swapped = false;
                for (let i = 0; i < a.length -1; i++) {
                    if (a[i].mmr[a[i].leagues.indexOf(leagueId)] < a[i+1].mmr[a[i+1].leagues.indexOf(leagueId)]) {
                        let temp = a[i];
                        a[i] = a[i + 1];
                        a[i + 1] = temp;
                        swapped = true;
                    }
                }
            } while (swapped);
        }
        bubbleSortByMMR(this.users, CacheManager.getCurrentLeagueId());

        //The user is in at least one league
        if(this.userObj.leagues.length>0){

            //let memberIds: Array<number> = league.adminIds.concat(league.playerIds);
            this.page.title = this.league.pref.title;
            let collectionView = new CollectionView({
                left: 0, top: '20%', right: 0, bottom: 0,
                itemCount: this.users.length,
                background: ColorScheme.Background,
                cellHeight: 135,
                createCell: () => {
                    let cell = new Composite();
                    let comp = new Composite({background: ColorScheme.Background, left: 2, right: 2, top: 2, bottom: 2, cornerRadius: 5, opacity: .96});
                    new Composite({height: 100, background: '#000000', left: 10, right: 10, cornerRadius: 5, top: 'prev() 10' }).appendTo(cell).append(comp);

                    let imageView = new ImageView({
                        centerY: 0, width: 80, height: 80, right: 40
                    }).appendTo(comp);

                    new TextView({
                        left: 30, centerY: 0, right: [imageView, 10],
                        alignment: 'center',
                        font: 'bold 20px',
                        textColor: '#000000'
                    }).appendTo(comp);
                    return cell;
                },
                updateCell: (cell, index) => {
                    let user = this.users[index];
                    let i = 1;
                    cell.apply({
                        ImageView: {image: IMAGE_PATH + 'avatar' + (user.pref.avatarId + 1).toString() + '.png'},
                        TextView: {text: index + 1 + ')  ' + user.name + ' - ' + user.mmr[user.leagues.indexOf(CacheManager.getCurrentLeagueId())]},
                    });
                    i++;
                }
            }).on('select', ({index}) => {
                let user = this.users[index];
                this.page.parent().append(new FriendPage(user).page);
            });
            return collectionView;
        }
    }

    private getLeague(): Promise<League> {
        let p = new Promise((resolve, reject) => {
            ServiceLayer.httpGetAsync('/league', 'leagueId=' + CacheManager.getCurrentLeagueId(), (response) => {
                resolve(response);
            });
        });
        return p;
    }

    private getUsers(i): Promise<User> {
        let p = new Promise((resolve, reject) => {
            ServiceLayer.httpGetAsync('/user', 'userId=' + i.toString(), (response) => {
                resolve(response);
            });
        });
        return p;
    }

    private leagueLoop(memberIds: Array<number>): Promise<any>{
        return new Promise((resolve, reject) => {
            for(let i = 0;i<memberIds.length; i++){
                this.getUsers(memberIds[i]).then((User) => {
                    this.users.push(User.user);
                    if(i == memberIds.length -1){
                        resolve();
                    }

                }).catch((err) => {
                    console.log(err);
                });
            }
        });
    };


}
