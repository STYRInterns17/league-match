/**
 * Created by STYRLab1 on 5/31/2017.
 */

import * as tabris from 'tabris';
import {ColorScheme} from "./ColorScheme";

export class customButton extends tabris.Composite{

    private message: tabris.TextView;
    constructor(config: tabris.CompositeProperties, text: string){
        super(config);
        /*this.left = 10;
         this.right = 10;
         this.height = 50;
         this.background = '#448aff';*/

        this.cornerRadius = 5;
        this.background = '#000000';
        this.height = 55;
        let inner = new tabris.Composite({
            background: this.background,
            left: 2,
            right: 2,
            top: 2,
            bottom: 2
        }).appendTo(this);

        inner.cornerRadius = 3;

        this.message = new tabris.TextView({
            centerX: 0,
            centerY: 0,
            text: text,
            font: 'bold 20px',
            textColor: ColorScheme.WigetBackground
        }).appendTo(inner);
    }

    public changeBorderColor(borderColor: string): customButton{
        this.background = borderColor;
        return this;
    }

    public changeTextColor(textColor: string): customButton{
        this.message.textColor = textColor;
        return this;
    }

    on(type: string, listener: (event: any) => void, context?: Object): this {
        let fullEvent;
        if(type === 'tap') {
            fullEvent = function(event: any) {
                this.animate({
                    opacity: 0.5
                }, {
                    delay: 0,
                    duration: 100,
                    repeat: 1,
                    reverse: true,
                    easing: 'ease-out'
                });
                listener(event);
            };
        } else {
            fullEvent = listener;
        }

        super.on(type, fullEvent, context);
        return this;
    }
}
