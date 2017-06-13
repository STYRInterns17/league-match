/**
 * Created by STYRLabs2 on 6/6/2017.
 */
import * as tabris from 'tabris';
import {Notification} from "../../../common/Notification"

import {BasePage} from './BasePage';
import {ServiceLayer} from "../ServiceLayer";
import {NotificationComposite} from "../components/NotificationComposite";
import {TextView} from "tabris";
import {ColorScheme} from "../ColorScheme";

export class NotificationPage extends BasePage {
    public navigationView: tabris.NavigationView;
    private notifications: Notification[];
    private notificationView: tabris.CollectionView;

    constructor() {
        super();
        this.page.title = 'Notifications';
        this.notifications = [];
        localStorage.setItem('userId', '0');
        this.getNotifications().then((notifications) => {
            this.notifications = notifications;

            this.createComponents();
        }).catch((err) => {
            console.log(err);
        });


        this.page.on('disappear', () => {
            //Mark all active reminders as read
        })
    }

    public createComponents(): void {
        console.log(ColorScheme.Accent);
        this.page.background = ColorScheme.Background;
        let notificationContainer = new tabris.Composite({
            left: 20, right: 20, top: 0, bottom: 0,
            background: ColorScheme.Background
        }).appendTo(this.page);


        this.notificationView = new tabris.CollectionView({
            left: 0, right: 0, top: 0, bottom: 0,
            itemCount: this.notifications.length,
            cellHeight: 80,
            createCell: () => {
                let cell = new tabris.Composite({
                    top: 0, left: 0, right: 0, bottom: 0, background: ColorScheme.Secondary
                }).on('panHorizontal', event => this.handlePan(event));

                let border = new tabris.Composite({
                    top: 0, left: 2, right: 2, bottom: 2
                }).appendTo(cell);

                new TextView({
                    top: 0, left: 0, right: 0, bottom: 0, background: ColorScheme.WigetBackground,
                    lineSpacing: 1.3, alignment: 'center',
                    font: '14px monospace',
                    markupEnabled: true,
                    textColor: ColorScheme.Background,
                    maxLines: 3
                }).appendTo(border);


                return cell;
            },
            updateCell: (cell, index) => {
                let notification = this.notifications[index];
                console.log(cell.children()[0]);
                cell.apply({
                    TextView: {
                        text: notification.message + '\n' + '<i>   -' + notification.submitterUser + '@' + notification.submitterLeague + '</i>'
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
            });
        });

        return p;
    }

    private dismissNotification(index: number) {

        ServiceLayer.httpPostAsync('/notification/user/dismiss', {
            userId: localStorage.getItem('myId'),
            notificationId: index
        }, (response) => {
            // No need to do anything in callback
        });
    }


    private handlePan(event): void {
        let {target, state, translationX} = event;
        target.transform = {translationX};
        if (state === 'end') {
            this.handlePanFinished(event);
        }
    }

    private handlePanFinished(event) {
        let {target, velocityX, translationX} = event;
        let beyondCenter = Math.abs(translationX) > target.bounds.width / 2;
        let fling = Math.abs(velocityX) > 200;
        let sameDirection = this.sign(velocityX) === this.sign(translationX);
        // When swiped beyond the center, trigger dismiss if flinged in the same direction or let go.
        // Otherwise, detect a dismiss only if flinged in the same direction.
        let dismiss = beyondCenter ? sameDirection || !fling : sameDirection && fling;
        if (dismiss) {
            this.animateDismiss(event);
        } else {
            this.animateCancel(event);
        }
    }

    private  animateDismiss({target, translationX}) {
        let bounds = target.bounds;
        target.animate({
            transform: {translationX: this.sign(translationX) * bounds.width}
        }, {
            duration: 200,
            easing: 'ease-out'
        }).then(() => {
            let index = this.notifications.indexOf(target.item);
            this.notifications.splice(index, 1);
            this.notificationView.remove(index);
            this.dismissNotification(index);
        });
    }

    animateCancel({target}) {
        target.animate({transform: {translationX: 0}}, {duration: 200, easing: 'ease-out'});
    }

    sign(number) {
        return number ? number < 0 ? -1 : 1 : 0;
    }

}
