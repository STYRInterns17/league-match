/**
 * Created by STYRLabs2 on 6/6/2017.
 */
import * as tabris from 'tabris';
import {Notification} from "../../../common/Notification"

import {BasePage} from './BasePage';
import {ServiceLayer} from "../util/ServiceLayer";
import {NotificationComposite} from "../components/NotificationComposite";
import {TextView} from "tabris";
import {ColorScheme} from "../util/ColorScheme";
import {CustomButton} from "../components/CustomButton";
import {ApprovalType} from "../../../common/ApprovalType";
import {User} from "../../../common/User";

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

        for (let i = 0; i < this.notifications.length; i++) {

            this.notificationButtons.push(new NotificationComposite({
                left: 0,
                right: 0,
                height: 80,
                top: 'prev() 2'
            }).on('panHorizontal', event => {
                this.handlePan(event);
            }).appendTo(this.notificationView).update(this.notifications[i]));


            // Set button listeners for notification
            switch (this.notificationButtons[i].type) {

                case ApprovalType.InviteApproval:

                    this.notificationButtons[i].yesApprove.on('tap', (event) => {
                        // Add this User to league that the invite was sent from
                        let notificationComposite = event.target.parent().parent().parent();

                        this.joinLeague(notificationComposite.approvalData.leagueId);

                        this.dismiss(notificationComposite.db_id);
                        notificationComposite.dispose();
                    });
                    this.notificationButtons[i].noApprove.on('tap', (event) => {
                        // Dismiss the notification
                        let notificationComposite = event.target.parent().parent().parent();

                        this.dismiss(notificationComposite.db_id);
                        notificationComposite.dispose();
                    });
                    break;
                case ApprovalType.MatchApproval:

                    break;
                case ApprovalType.Message:
                    // Nothing special ends to be done on message
                    break;
                default:
                    break;
            }

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
            switch (event.target.type) {
                case ApprovalType.InviteApproval:
                    // Approval notifications can not be dismissed by swipe
                    this.animateCancel(event);
                    break;
                case ApprovalType.MatchApproval:
                    // Approval notifications can not be dismissed by swipe
                    this.animateCancel(event);
                    break;
                case ApprovalType.Message:
                    this.animateDismiss(event);
                    break;

                default:
                    this.animateDismiss(event);
                    break;
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
            this.dismiss(target.db_id);
            target.dispose();
        });

    }

    public dismiss(index: number): void {
        // Dispose of this element
        // Notify server that it has been disposed of
        ServiceLayer.httpPostAsync('/notification/user/dismiss', {
            userId: localStorage.getItem('userId'),
            notificationId: index
        }, (response) => {
            // No need to do anything in callback
        });

        // Shift all the indexes when removing from d1
        for (let i = index; i < this.notificationButtons.length; i++) {
            this.notificationButtons[i].db_id--;
        }
    }

    private joinLeague(leagueId: number) {

        let joinLeagueRequest = {leagueId: leagueId, userId: parseInt(localStorage.getItem('userId'))};

        ServiceLayer.httpPostAsync('/league/addUser', joinLeagueRequest, (response => {
            window.plugins.toast.showShortCenter('Joined new league!');
            localStorage.setItem('currentLeagueId', leagueId.toString());
            let userObj: User = JSON.parse(localStorage.getItem('userObj'));
            userObj.leagues.push(leagueId);
            localStorage.setItem('userObj', JSON.stringify(userObj));

        }));


    }

    private animateCancel({target}) {
        target.animate({transform: {translationX: 0}}, {duration: 200, easing: 'ease-out'});
    }

    private sign(number) {
        return number ? number < 0 ? -1 : 1 : 0;
    }

}
