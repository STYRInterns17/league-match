/**
 * Created by STYRLabs2 on 6/7/2017.
 */
import {BasePage} from './BasePage';
import {customButton} from '../customButton';
import * as tabris from 'tabris';
import {LeagueCreationPage} from "./LeagueCreationPage";

export class LeaguePage extends BasePage{
    public navigationView: tabris.NavigationView;
    constructor(navView: tabris.NavigationView){
        super();
        this.navigationView = navView;
    }
    public createLeaguePage(){
        let comp1 = new tabris.Composite({top: 0, bottom: '15%', left: 0, right: 0}).appendTo(this.page);
        let comp2 = new tabris.Composite({top: comp1, bottom: 0, left: 0, right: 0}).appendTo(this.page);
        this.page.title = 'Leagues';
        let userObj = JSON.parse(localStorage.getItem('userObj'));

        let collectionView = new tabris.CollectionView({
            left: 0, top: 0, right: 0, bottom: 0,
            itemCount: userObj.leagues.length,
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
            //let person = people[index];
            cell.apply({
                Button: {text: 'TEST!!dfhdf'}
            });
        }
        }).on('refresh', () => console.log('IM REFRESHING!'));

        comp1.append(collectionView);
        comp2.append(new customButton({centerY: 0}, '➕ Create a League' ).on('tap', () => this.navigationView.append(new LeagueCreationPage('test').createAdminPage())));
        return this.page;
    }

}
