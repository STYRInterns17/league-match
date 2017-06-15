/**
 * Created by STYR-Curt on 6/7/2017.
 */
import * as tabris from 'tabris/tabris';
import {ColorScheme} from "../ColorScheme";
import {Notification} from "../../../common/Notification";
import {customButton} from "../customButton";
import {ServiceLayer} from "../ServiceLayer";

// This class is unused now
export class NotificationComposite extends tabris.Composite {
    private body: tabris.TextView;
    private footer: tabris.TextView;
    // Composite already has an id number, this name can not be reused
    public db_id: number;
    public wasRead: boolean;
    public yesApprove: customButton;
    public noApprove: customButton;

    public type: string;

    private approvalContainer: tabris.Composite;


    constructor(config: tabris.CompositeProperties) {
        super(config);
        console.log('1');
        this.background = ColorScheme.Secondary;


        let border = new tabris.Composite({
            top: 2, left: 2, right: 2, bottom: 2, background: ColorScheme.WigetBackground
        }).appendTo(this);


        let footerContainer = new tabris.Composite({
            left: 0, right: 120, bottom: 0, height: 30
        }).appendTo(border);



        console.log('2');

        let bodyContainer = new tabris.Composite({
            top:0, left: 0, right: 0, bottom: footerContainer
        }).appendTo(border);

        this.approvalContainer = new tabris.Composite({
            left: footerContainer, right: 0, bottom: 0, top: bodyContainer
        }).appendTo(border);

        this.body = new tabris.TextView({
            top: 0, left: 0, right: 0, bottom: 0,
            lineSpacing: 1.3, alignment: 'center',
            font: '14px monospace',
            markupEnabled: true,
            textColor: ColorScheme.Background,
            maxLines: 3
        }).appendTo(bodyContainer);
        console.log('3');
        this.footer = new tabris.TextView({
            top: 0, left: 0, right: 0, bottom: 0,
            lineSpacing: 1.3, alignment: 'center',
            font: '10px monospace',
            markupEnabled: true,
            textColor: ColorScheme.Background,
            maxLines: 3
        }).appendTo(footerContainer);
        console.log('4');

    }


    public update(notification: Notification): NotificationComposite {
        console.log('6');
        this.body.text = notification.message;
        this.footer.text = '<i>-' + notification.submitterUser + '@' + notification.submitterLeague + '</i>';
        if(notification.type === 'approval') {



            // Added check or X buttons
            console.log('Adding approval buttons');
            this.yesApprove = new customButton({
                left: 0, right: '50%', top: 0, bottom: 1, background: ColorScheme.Secondary
            }, '✔').changeBorderColor(ColorScheme.Accent).changeTextColor('#4CAF50').appendTo(this.approvalContainer);

            this.noApprove = new customButton({
                left: 'prev() 1', right: 1, top: 0, bottom: 1, background: ColorScheme.Secondary
            }, '✖').changeBorderColor(ColorScheme.Accent).changeTextColor('#D50000').appendTo(this.approvalContainer);

        } else if(notification.type === 'basic') {
            // No need for extra buttons
        }

        this.type = notification.type;

        return this;
    }


    public read(): void {
        this.background = '#BDBDBD';
        // Change background color
        // Notify server that background has been changed

    }


}