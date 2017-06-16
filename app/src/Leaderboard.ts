import {Page} from "tabris";
import {User} from "../../common/User";
import {League} from "../../common/League";
import {ServiceLayer} from "./ServiceLayer";
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
        this.userObj = JSON.parse(localStorage.getItem('userObj'));
        //this.users.push(this.userObj);
        this.page = page;
        this.reloadLeaderBoard();

    }

    public reloadLeaderBoard(): void {
        console.log('ReloadingLeaderBoard');
        console.log('Current league Id =', localStorage.getItem('currentLeagueId'));
        this.page.children().dispose();
        if(localStorage.getItem('currentLeagueId') != null) {
            this.getLeague().then(value => {
                this.league = value;
                let memberIds: Array<number> = [];
                memberIds = memberIds.concat(value.adminIds).concat(value.playerIds);

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
                for (let i = 0; i < a.length - 1; i++) {
                    if (a[i].mmr[leagueId] < a[i + 1].mmr[leagueId]) {
                        let temp = a[i];
                        a[i] = a[i + 1];
                        a[i + 1] = temp;
                        swapped = true;
                    }
                }
            } while (swapped);
        }
        bubbleSortByMMR(this.users, +localStorage.getItem('currentLeagueId'));

        //The user is in at least one league
        if(this.userObj.leagues.length>0){

            //let memberIds: Array<number> = league.adminIds.concat(league.playerIds);
            this.page.title = this.league.pref.title;
            let collectionView = new CollectionView({
                left: 40, top: 40, right: 40, bottom: 40,
                itemCount: this.users.length,
                background: '#f78',
                cellHeight: 135,
                createCell: () => {
                    let cell = new Composite();
                    let imageView = new ImageView({
                        top: 16, width: 100, height: 100, right: 40
                    }).appendTo(cell);
                    new TextView({
                        left: 30, top: 50, right: [imageView, 10],
                        alignment: 'center',
                        font: 'bold 20px'
                    }).appendTo(cell);
                    return cell;
                },
                updateCell: (cell, index) => {
                    let user = this.users[index];
                    cell.apply({
                        ImageView: {image: IMAGE_PATH + 'avatar' + (user.pref.avatarId + 1).toString() + '.png'},
                        TextView: {text: user.email + '-' + user.mmr[user.leagues.indexOf(+localStorage.getItem('currentLeagueId'))]},
                    });
                }
            }).on('select', ({index}) => console.log('selected', people[index].name));
            return collectionView;
        }
    }

    private getLeague(): Promise<League> {
        let p = new Promise((resolve, reject) => {
            ServiceLayer.httpGetAsync('/league', 'leagueId=' + localStorage.getItem('currentLeagueId'), (response) => {
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
