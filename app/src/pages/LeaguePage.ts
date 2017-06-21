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
import {Composite} from "tabris";
const IMAGE_PATH = 'assets/';


export class LeaguePage extends BasePage {
    private leagues: League[];
    private userObj: User;
    constructor() {
        super();
        this.userObj = JSON.parse(localStorage.getItem('userObj'));
        this.leagues = [];

        if(!Array.isArray(this.userObj.leagues) || !this.userObj.leagues.length) {
            this.page.title = 'You are not in any leagues';
            this.createLeaguePage(0);
        }else{
            this.leagueLoop().then(value => {
                this.createLeaguePage(this.userObj.leagues.length);
            });
            this.page.title = 'League Page';
        }
    }

    private createLeaguePage(leagueLength: number): void {

        let comp1 = new tabris.Composite({top: 0, bottom: '15%', left: 0, right: 0}).appendTo(this.page);
        let comp2 = new tabris.Composite({top: comp1, bottom: 0, left: 0, right: 0, background: ColorScheme.Background}).appendTo(this.page);


        let collectionView = new tabris.CollectionView({
            left: 0, top: 0, right: 0, bottom: 0,
            itemCount: leagueLength,
            cellHeight: 100,
            background: ColorScheme.Background,
            //TODO let user refresh league page
            refreshEnabled: false,
            createCell: () => {
                let cell = new tabris.Composite();
                let comp = new Composite({background: ColorScheme.Background, left: 2, right: 2, top: 2, bottom: 2, cornerRadius: 5, opacity: .96});
                new tabris.Composite({height: 80, background: '#000000', left: 10, right: 10, cornerRadius: 5, top: 'prev() 10' }).appendTo(cell).append(comp);
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
                    TextView: {text: title}
                });
            }
        }).on('select', ({index}) =>{
            //console.log('selected', index);
            localStorage.setItem('currentLeagueId', this.userObj.leagues[index].toString());
        window.plugins.toast.showShortCenter('League changed to ' + this.leagues[index].pref.title)}).appendTo(comp1);

        new CustomButton({centerY: 0, left: 10, right: 10, background: ColorScheme.Background}, '➕ Create a League').changeBorderColor('#000000').on('tap', () => {
            this.page.parent().append(new LeagueCreationPage(+localStorage.getItem('userId')).page);
        }).appendTo(comp2);

        this.page.background = ColorScheme.Primary;

    }

    private getLeagues(i): Promise<League> {
             let p = new Promise((resolve, reject) => {
                 ServiceLayer.httpGetAsync('/league', 'leagueId=' + this.userObj.leagues[i].toString(), (response) => {
                      resolve(response);
                 });
             });
        return p;
    }

 private leagueLoop(): Promise<any>{
    return new Promise((resolve, reject) => {
        for(let i = 0;i<this.userObj.leagues.length; i++){
        this.getLeagues(i).then((League) => {
            this.leagues.push(League);
            if(i == this.userObj.leagues.length -1){
                resolve();
            }

        }).catch((err) => {
            console.log(err);
        });
        }
    });
};
}
