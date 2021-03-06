/**
 * Created by STYR-Curt on 6/7/2017.
 */
import * as tabris from 'tabris/tabris';
import {ColorScheme} from "../util/ColorScheme";
import {Notification} from "../../../common/Notification";
import {CustomButton} from "./CustomButton";
import {ServiceLayer} from "../util/ServiceLayer";
import {ApprovalType} from "../../../common/ApprovalType";
import {ApprovalData} from "../../../common/ApprovalData";

// This class is unused now
export class NotificationComposite extends tabris.Composite {
    private body: tabris.TextView;
    private footer: tabris.TextView;
    // Composite already has an id number, this name can not be reused
    public db_id: number;
    public wasRead: boolean;
    public yesApprove: CustomButton;
    public noApprove: CustomButton;

    public approvalData: ApprovalData;
    public type: ApprovalType;

    private approvalContainer: tabris.Composite;


    constructor(config: tabris.CompositeProperties) {
        super(config);
        this.background = ColorScheme.Accent;


        let border = new tabris.Composite({
            top: 2, left: 2, right: 2, bottom: 2, background: ColorScheme.WigetBackground
        }).appendTo(this);


        let footerContainer = new tabris.Composite({
            left: 0, right: 120, bottom: 0, height: 30
        }).appendTo(border);





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
            textColor: ColorScheme.Accent,
            maxLines: 3
        }).appendTo(bodyContainer);

        this.footer = new tabris.TextView({
            top: 0, left: 0, right: 0, bottom: 0,
            lineSpacing: 1.3, alignment: 'center',
            font: '10px monospace',
            markupEnabled: true,
            textColor: ColorScheme.Accent,
            maxLines: 3
        }).appendTo(footerContainer);


    }


    public update(notification: Notification): NotificationComposite {
        this.body.text = notification.message;
        this.footer.text = '<i>-' + notification.submitterUser + '@' + notification.submitterLeague + '</i>';
        switch (notification.type) {
            case ApprovalType.InviteApproval:
                this.approvalData = notification.data;
                this.yesApprove = new CustomButton({
                    left: 0, right: '50%', top: 0, bottom: 1, background: ColorScheme.WigetBackground
                }, '✔').changeBorderColor(ColorScheme.Accent).changeTextColor('#4CAF50').appendTo(this.approvalContainer);

                this.noApprove = new CustomButton({
                    left: 'prev() 1', right: 1, top: 0, bottom: 1, background: ColorScheme.WigetBackground
                }, '✖').changeBorderColor(ColorScheme.Accent).changeTextColor('#D50000').appendTo(this.approvalContainer);

                break;
            case ApprovalType.MatchApproval:
                break;
            case ApprovalType.Message:
                // No need to add extra buttons
                break;
        }

        this.db_id = notification.index;

        this.type = notification.type;

        return this;
    }


    public read(): void {
        this.background = '#BDBDBD';
        // Change background color
        // Notify server that background has been changed

    }


}