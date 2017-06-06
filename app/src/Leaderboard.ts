/**
 * Created by STYRLabs2 on 6/6/2017.
 */
const {CollectionView, Composite, TextView} = require('tabris');

let users = [['Michael', 1200],['Nick', 4],['Curt', 1200],['Sal', 9000], ['Santa', 1200], ['Rudolph', 1400], ['Gus', 900], ['Octocat', 400]].map(([name, mmr]) => ({name, mmr}));


export class Leaderboard{
    public createLeaderBoard(): tabris.CollectionView{
        let collectionView = new CollectionView({
            left: 0, top: 40, right: 0, bottom: 0,
            itemCount: users.length,
            cellHeight: 100,
            createCell: () => {
                let cell = new Composite();
                // new ImageView({
                //     top: 16, centerX: 0, width: 200, height: 200
                // }).appendTo(cell);
                new TextView({
                    left: 30, top: 16, right: 30,
                    alignment: 'center',
                    font: 'bold 20px'
                }).appendTo(cell);
                return cell;
            },
            updateCell: (cell, index) => {
                let person = users[index];
                cell.apply({
                    TextView: {text: person.name + ' ' + person.mmr},
                });
            }
        }).on('select', ({index}) => console.log('selected', users[index].name));
        return collectionView;
    }
}