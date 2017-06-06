/**
 * Created by STYRLab1 on 5/31/2017.
 */

import * as tabris from "tabris";

export class customButton extends tabris.Composite{
    constructor(config: tabris.CompositeProperties, text: string){
        super(config);

        this.cornerRadius = 5;

        let inner = new tabris.Composite({
            top: 2, left: 2, right: 2, bottom: 2,
            background: '#00daff'
        }).appendTo(this);

        new tabris.TextView({
            centerX: 0, centerY:0,
            text: text,
            font: 'bold 20px',
            textColor: '#15fff4'
        }).appendTo(inner);
    }

    on(type: string, listener: (event: any) => void, context?: Object): this {
        var buttonEvent;
        if(type === 'tap'){
            buttonEvent = function(event: any) {
                listener(event);
                /*this.animate({
                    opacity: 0.5,
                    transform: {
                        rotation: 1.5 * Math.PI,
                        scaleX: 2.0,
                        scaleY: 2.0
                    }
                }, {
                    delay: 0,
                    duration: 1000,
                    repeat: 1,
                    reverse: true,
                    easing: 'ease-out'
                });*/
            };
        } else {
            buttonEvent = listener;
        }

        super.on(type, buttonEvent, context);
        return this;
    }
}
