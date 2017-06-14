/**
 * Created by STYRLabs2 on 6/7/2017.
 */
import {BasePage} from './BasePage';
import {customButton} from '../customButton';
import * as tabris from 'tabris';
import {LeagueCreationPage} from "./LeagueCreationPage";
import {ServiceLayer} from "../ServiceLayer";
import {League} from "../../../common/League";

let userObj = JSON.parse(localStorage.getItem('userObj'));

export class LeaguePage extends BasePage {
    private leagues: League[];
    public navigationView: tabris.NavigationView;

    constructor() {
        super();
        this.leagues = [];
        if(userObj.leagues.length>0) {
            this.leagueLoop().then(value => {
                console.log('Here' + userObj.leagues.length);
                this.createLeaguePage();
            })
        }else{
            this.createLeaguePage();
        }
    }

    public createLeaguePage(): void {

        let comp1 = new tabris.Composite({top: 0, bottom: '15%', left: 0, right: 0}).appendTo(this.page);
        let comp2 = new tabris.Composite({top: comp1, bottom: 0, left: 0, right: 0}).appendTo(this.page);
        this.page.title = 'Leagues';


        let collectionView = new tabris.CollectionView({
            left: 0, top: 0, right: 0, bottom: 0,
            itemCount: this.leagues.length,
            cellHeight: 100,
            refreshEnabled: true,
            createCell: () => {
                let cell = new tabris.Composite();

                new tabris.Button({
                    top: 16, left: '10%', right: '10%', height: 80
                }).appendTo(cell);
                return cell;
            },
            updateCell: (cell, index) => {
                let title = this.leagues[index].pref.title;
                cell.apply({
                    Button: {text: title}
                });
            }
        });

        comp1.append(collectionView);
        new customButton({centerY: 0}, '➕ Create a League').on('tap', () => {
            this.page.parent().append(new LeagueCreationPage(+localStorage.getItem('userId')).page);
        }).appendTo(comp2);

    }

    private getLeagues(i): Promise<League> {
             let p = new Promise((resolve, reject) => {
                 ServiceLayer.httpGetAsync('/league', 'leagueId=' + userObj.leagues[i].toString(), (response) => {
                      resolve(response);
                 });
             });
        return p;
    }

 private leagueLoop(): Promise<any>{
    return new Promise((resolve, reject) => {
        for(let i = 0;i<userObj.leagues.length; i++){
        this.getLeagues(i).then((League) => {
            this.leagues.push(League);
            if(i == userObj.leagues.length -1){
                resolve();
            }

        }).catch((err) => {
            console.log(err);
        });
        }
    });
};
}
