/**
 * Created by STYRLabs2 on 6/6/2017.
 */
import * as tabris from 'tabris';

import {BasePage} from './BasePage';

export class NotificationPage extends BasePage {
    public navigationView: tabris.NavigationView;
    constructor(){
        super();
        this.page.title = 'Notification Page';
        this.createComponents();
    }

    public createComponents(): void {
        this.page.background = '#ffffff';

        let notificationContainer = new tabris.Composite({
            left: 40, right: 40, top: 0, bottom: 0,
            background: '#111111'
        }).appendTo(this.page);

        let notifications = new tabris.CollectionView({
            left: 0, right: 0, top: 0, bottom: 0
        }).appendTo(notificationContainer);

    }

}
