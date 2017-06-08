/**
 * Created by STYRLabs2 on 6/6/2017.
 */
import * as tabris from 'tabris';
import {Notification} from "../../../common/Notification"

import {BasePage} from './BasePage';
import {ServiceLayer} from "../ServiceLayer";
import {NotificationComposite} from "../components/NotificationComposite";

export class NotificationPage extends BasePage {
    public navigationView: tabris.NavigationView;
    private notifications: Notification[];

    constructor() {
        super();
        this.page.title = 'Notification Page';
        this.createComponents();

        this.page.on('disappear', () => {
            //Mark all active reminders as read
        })
    }

    public createComponents(): void {
        this.page.background = '#ffffff';

        let notificationContainer = new tabris.Composite({
            left: 40, right: 40, top: 0, bottom: 0,
            background: '#111111'
        }).appendTo(this.page);

        let notificationView = new tabris.CollectionView({
            left: 0, right: 0, top: 0, bottom: 0,
            itemCount: this.notifications.length,
            cellHeight: 256,
            createCell: () => {
                let cell = new tabris.Composite({
                    top: 0, left: 0, right: 0, bottom: 0
                });
                new NotificationComposite({
                    top: 0, left: 0, right: 0, bottom: 0
                }).appendTo(cell);

                return cell;
            },
            updateCell: (cell, index) => {
                let notification = this.notifications[index];
                cell.apply({
                    NotificationComposite: {
                        message: notification.message,
                        submitterUser: notification.submitterUser,
                        submitterLeague: notification.submitterLeague,
                        db_id: notification.index
                    }
                });


            }
        }).on('refresh', function (event) {
            this.getNotifications().then((notifications) => {
                this.notifications = notifications;
                console.log(event);
                //Still need to stop the refresh spinner
            });
        }).appendTo(notificationContainer);
    }


    private getNotifications(): Promise<Notification[]> {
        let p = new Promise((resolve, reject) => {
            let userId = localStorage.getItem('userId');

            ServiceLayer.httpGetAsync('/notification/user', 'userId=' + userId, (response) => {
                resolve(response);
            })
        });

        return p;
    }

    private dismissNotification(index: number) {

        ServiceLayer.httpPostAsync('/notification/user/dismiss', {userId: localStorage.getItem('myId'), notificationId: index}, (response) => {
           // No need to do anything in callback
        });
    }

}
