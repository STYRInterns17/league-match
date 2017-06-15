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
import {customButton} from "../customButton";

export class NotificationPage extends BasePage {
    private notifications: Notification[];
    private notificationButtons: NotificationComposite[];
    private notificationView: tabris.ScrollView;

    constructor() {
        super();
        this.page.title = 'Notifications';
        this.notifications = [];
        this.notificationButtons = [];

        this.getNotifications().then((notifications) => {
            this.notifications = notifications;
            this.createComponents();
        }).catch((err) => {
            console.log(err);
        });


    }

    public createComponents(): void {
        this.page.background = ColorScheme.Background;
        let notificationContainer = new tabris.Composite({
            left: 20, right: 20, top: 0, bottom: 0,
            background: ColorScheme.Background
        }).appendTo(this.page);

        this.notificationView = new tabris.ScrollView({
            left: 0, right: 0, top: 0, bottom: 0
        }).appendTo(notificationContainer);

        for(let i = 0; i < this.notifications.length; i++) {
            this.notificationButtons.push(new NotificationComposite({left: 0, right: 0, height: 80, top:'prev() 2'}).on('panHorizontal', event => {
                this.handlePan(event);
            }).appendTo(this.notificationView).update(this.notifications[i]));
            this.notificationButtons[i].yesApprove.on('tap', () => {
                console.log('yes was tapped');
            });
            this.notificationButtons[i].noApprove.on('tap', () => {
                console.log('no was tapped');
            });
        }
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
            if(event.target.type !== 'approval') {
                this.animateDismiss(event);
            } else {
                this.animateCancel(event);
            }

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
                this.dismiss(target.index);
                target.dispose();
        });

    }

    public dismiss(index:number): void {
        // Dispose of this element
        // Notify server that it has been disposed of
        ServiceLayer.httpPostAsync('/notification/user/dismiss', {
            userId: localStorage.getItem('userId'),
            notificationId: index
        }, (response) => {
            // No need to do anything in callback
        });

        for(let i = index; i < this.notifications.length; i++) {

        }
    }

    private animateCancel({target}) {
        target.animate({transform: {translationX: 0}}, {duration: 200, easing: 'ease-out'});
    }

    private sign(number) {
        return number ? number < 0 ? -1 : 1 : 0;
    }

}
