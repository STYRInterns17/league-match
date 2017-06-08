/**
 * Created by STYRLabs2 on 6/6/2017.
 */
const {CollectionView, Composite, TextView, ImageView} = require('tabris');
const IMAGE_PATH = 'assets/';
export class Leaderboard{

    public createLeaderBoard(users: Array): tabris.CollectionView{
        let people = users.map(([name, mmr, image]) => ({name, mmr, image: IMAGE_PATH + image }));
        localStorage.setItem('userId', '0');
        console.log(localStorage.getItem('userId'));
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
            left: 0, top: 40, right: 0, bottom: 0,
            itemCount: people.length,
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
