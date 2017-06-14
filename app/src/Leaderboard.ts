import {Page} from "tabris";
import {User} from "../../common/User";
/**
 * Created by STYRLabs2 on 6/6/2017.
 */
const {CollectionView, Composite, TextView, ImageView} = require('tabris');
const IMAGE_PATH = 'assets/';
const userObj: User = JSON.parse(localStorage.getItem('userObj'));
export class Leaderboard{
    page: Page;
    constructor(page: Page){
        this.page = page
    }

    public createLeaderBoard(): tabris.CollectionView{
        let people = [];
        if(userObj.leagues.length > 0){
            this.page.title = 'This is a test';
        }else{
            this.page.title = 'Its empty in here :(';
        }
        function bubbleSortByMMR(a: Array)
        {
            let swapped;
            do {
                swapped = false;
                for (let i = 0; i < a.length - 1; i++) {
                    if (a[i].mmr < a[i + 1].mmr) {
                        let temp = a[i];
                        a[i] = a[i + 1];
                        a[i + 1] = temp;
                        swapped = true;
                    }
                }
            } while (swapped);
        }

        bubbleSortByMMR(people);

        let collectionView = new CollectionView({
            left: 40, top: 40, right: 40, bottom: 40,
            itemCount: people.length, background: '#f78',
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
                let person = people[index];
                cell.apply({
                    ImageView: {image: person.image},
                    TextView: {text: person.name + ' ' + person.mmr}
                });
            }
        }).on('select', ({index}) => console.log('selected', people[index].name));
        return collectionView;
    }

}
