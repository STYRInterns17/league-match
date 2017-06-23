/**
 * Created by Nikola Uzelac on 6/6/2017.
 */

import * as tabris from "tabris";

export abstract class BasePage {
    public page: tabris.Page;

    constructor() {
        this.page = new tabris.Page({
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            transform: {

                scaleY: 0.1,
                scaleX: 0.1,
            },
            opacity: 0.1,
            autoDispose: false

        }).on('appear', (event) => {
            event.target.translationX = 0;
            event.target.translationY = 0;

            event.target.animate({
                transform: {
                    scaleY: 1,
                    scaleX: 1
                },
                opacity: 1
            }, 1500)
        });
    }



}