/**
 * Created by STYRLab1 on 5/31/2017.
 */

import * as tabris from 'tabris';

export class customButton extends tabris.Composite{
    constructor(config: tabris.CompositeProperties, text: string){
        super(config);

        this.cornerRadius = 5;
        this.left = 10;
        this.right = 10;
        this.height = 50;
        this.background = '#448aff';

        let inner = new tabris.Composite({
            background: '#448aff',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }).appendTo(this);

        new tabris.TextView({
            centerX: 0,
            centerY: 0,
            text: text,
            font: 'bold 20px'
        }).appendTo(inner);
    }

    on(type: string, listener: (event: any) => void, context?: Object): this {
        let buttonEvent;
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
