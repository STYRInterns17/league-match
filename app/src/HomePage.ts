import * as tabris from 'tabris';

import {BasePage} from './BasePage';
import {customButton} from './customButton';

export class HomePage extends BasePage {

    constructor() {
        super(true);

    }

    public createComponents(): void {
        var drawer = tabris.ui.drawer;
        drawer.background = '#37474f';
        drawer.enabled = true;

        drawer.on('open', function() {
            console.log('drawer opened');
        }).on('close', function() {
            console.log('drawer closed');
        });

        let button = new tabris.Button({
            centerX: 0,
            text: 'Profile'
            top: 'prev() 10',
            background: '#448aff'
        });
        drawer.append(button);

        let button1 = new tabris.Button({
            centerX: 0,
            text: 'Profile'
            top: 'prev() 20',
            background: '#448aff'
        });
        drawer.append(button1);

        let button2 = new tabris.Button({
            centerX: 0,
            text: 'Profile'
            top: 'prev() 20',
            background: '#448aff'
        });
        drawer.append(button2);

        let button3 = new tabris.Button({
            centerX: 0,
            text: 'Profile'
            top: 'prev() 20',
            background: '#448aff'
        });
        drawer.append(button3);
    }

}

let homePage = new HomePage();
homePage.createComponents();