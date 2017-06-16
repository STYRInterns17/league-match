/**
 * Created by STYRLabs2 on 6/6/2017.
 */
import * as tabris from 'tabris';

import {BasePage} from './BasePage';
import {ServiceLayer} from "../ServiceLayer";
import {ColorScheme} from "../ColorScheme";
import {customButton} from "../customButton";
import {Match} from "../../../common/Match";

export class LogMatchPage extends BasePage {
    private TEXTINPUT_HEIGHT: number = 60;

    marginBox: tabris.Composite;
    leftPlayerMaxBox: tabris.Composite;
    rightPlayerMaxBox: tabris.Composite;
    centerColumn: tabris.Composite;

    leftPlayerContainer: tabris.Composite;
    rightPlayerContainer: tabris.Composite;

    leftScoreInput: tabris.TextInput;
    rightScoreInput: tabris.TextInput;

    playerCounter: number = 0;

    constructor() {
        super();
        this.page.title = 'Log a Match';

        this.createComponents();
    }

    public createComponents(): void {
        this.page.background = ColorScheme.Background;
        this.marginBox = new tabris.Composite({
            left: 30, right: 30, top: 30, bottom: 0,
            background: ColorScheme.Background
        }).appendTo(this.page);



        this.centerColumn = new tabris.Composite({
            width: 50, centerX: 0, top: 0, height: this.TEXTINPUT_HEIGHT * 6,
            background: ColorScheme.Background
        }).appendTo(this.marginBox);

        this.leftPlayerMaxBox = new tabris.Composite({
            left: 0, right: this.centerColumn, top: 0, height: this.TEXTINPUT_HEIGHT * 6,
            background: ColorScheme.Background
        }).appendTo(this.marginBox);
        this.rightPlayerMaxBox = new tabris.Composite({
            left: this.centerColumn, right: 0, top: 0, height: this.TEXTINPUT_HEIGHT * 6,
            background: ColorScheme.Background
        }).appendTo(this.marginBox);

        this.leftPlayerContainer = new tabris.Composite({
            left: 0, right: 0, centerY: 0, height: this.TEXTINPUT_HEIGHT,
            background: ColorScheme.WigetBackground,
            cornerRadius: 5
        }).appendTo(this.leftPlayerMaxBox);
        this.rightPlayerContainer = new tabris.Composite({
            left: 0, right: 0, centerY: 0, height: this.TEXTINPUT_HEIGHT,
            background: ColorScheme.WigetBackground,
            cornerRadius: 5
        }).appendTo(this.rightPlayerMaxBox);

        new tabris.TextView({
            centerX: 0, centerY: 0,
            text: 'VS',
            font: '20px monospace',
            textColor: ColorScheme.Secondary
        }).appendTo(this.centerColumn);

        // Create Player 1 and Player 2 Input Fields
        this.createAdditionPlayerFields();

        // LeftTeamScoreInput
        let leftScoreBox = new tabris.Composite({
            left: 0, right: this.centerColumn, top: [this.leftPlayerMaxBox, 30], height: this.TEXTINPUT_HEIGHT,
            background:ColorScheme.WigetBackground,
            cornerRadius: 5
        }).appendTo(this.marginBox);
        this.leftScoreInput = new tabris.TextInput({
            left: 0, right: 0, top: 0, bottom: 0,
            message: 'Score',
            background: ColorScheme.Secondary
        }).appendTo(leftScoreBox);

        // RightTeamScoreInput
        let rightScoreBox = new tabris.Composite({
            left: this.centerColumn, right: 0, top: [this.leftPlayerMaxBox, 30], height: this.TEXTINPUT_HEIGHT,
            background:ColorScheme.WigetBackground,

            cornerRadius: 5
        }).appendTo(this.marginBox);
        this.rightScoreInput = new tabris.TextInput({
            left: 0, right: 0, top: 0, bottom: 0,
            message: 'Score',
            background: ColorScheme.Secondary
        }).appendTo(rightScoreBox);

        // SubmitButton
        new customButton({
            width: 300, height: this.TEXTINPUT_HEIGHT, centerX: 0, top: [rightScoreBox, 30],
            background: ColorScheme.Secondary
        }, 'Submit').on('tap', target => {
            this.submitMatch();
        }).appendTo(this.marginBox);
    }

    private createAdditionPlayerFields(): void {


        let leftPlayers = this.leftPlayerContainer.children();
        let rightPlayers = this.rightPlayerContainer.children();

        if (leftPlayers.length > 0 && rightPlayers.length > 0) {
            leftPlayers[leftPlayers.length - 1].on('input', (target) => {
                this.otherItemListener(target);
            });

            rightPlayers[rightPlayers.length - 1].on('input', (target) => {
                this.otherItemListener(target);
            });
        }


        this.playerCounter++;
        new tabris.TextInput({
            left: 0, right: 0, bottom: 'prev()', height: this.TEXTINPUT_HEIGHT,
            message: 'Player ' + this.playerCounter,
            background: ColorScheme.Secondary
        }).on('input', (target) => {
            this.lastItemListener();
        }).appendTo(this.leftPlayerContainer);

        this.playerCounter++;
        new tabris.TextInput({
            left: 0, right: 0, bottom: 'prev()', height: this.TEXTINPUT_HEIGHT,
            message: 'Player ' + this.playerCounter,
            background: ColorScheme.Secondary
        }).on('input', (target) => {
            this.lastItemListener();
        }).appendTo(this.rightPlayerContainer);

        this.updatePlayerListHeights();
    }

    private removeRecentPlayerFields(): void {

        //Will not remove the first 2 fields
        if (this.playerCounter > 2) {

            let leftPlayers = this.leftPlayerContainer.children();
            let rightPlayers = this.rightPlayerContainer.children();

            leftPlayers[leftPlayers.length - 2].on('input', (target) => {
                this.lastItemListener();
            });

            rightPlayers[rightPlayers.length - 2].on('input', (target) => {
                this.lastItemListener();
            });

            leftPlayers[leftPlayers.length - 1].dispose();
            rightPlayers[rightPlayers.length - 1].dispose();
            this.playerCounter -= 2;

            this.updatePlayerListHeights();
        }

    }



    private otherItemListener(target) {
        let leftPlayers = this.leftPlayerContainer.children();
        let rightPlayers = this.rightPlayerContainer.children();


        if (leftPlayers[leftPlayers.length - 1].text === '' && rightPlayers[rightPlayers.length - 1].text === '' && !this.isInputFieldsFull()) {
            this.removeSetsOfFields();
        }
    }

    private removeSetsOfFields(): void {
        let leftPlayers = this.leftPlayerContainer.children();
        let rightPlayers = this.rightPlayerContainer.children();
        while(leftPlayers[leftPlayers.length - 1].text === '' && rightPlayers[rightPlayers.length - 1].text === '' && leftPlayers.length > 1) {
            this.removeRecentPlayerFields();
            leftPlayers = this.leftPlayerContainer.children();
            rightPlayers = this.rightPlayerContainer.children();
        }
    }
    private lastItemListener() {
        let leftPlayers = this.leftPlayerContainer.children();
        let rightPlayers = this.rightPlayerContainer.children();

        if (leftPlayers[leftPlayers.length - 1].text === '' && rightPlayers[rightPlayers.length - 1].text === '' && !this.isInputFieldsFull()) {
            this.removeSetsOfFields();
        }

        if (leftPlayers[leftPlayers.length - 1].text !== '' && rightPlayers[rightPlayers.length - 1].text !== '' && this.isInputFieldsFull()) {
            // Creates no more that 12 player fields
            if(this.playerCounter < 11) {
                this.createAdditionPlayerFields();
            }

        }
    }

    private isInputFieldsFull(): boolean {
        let leftPlayers = this.leftPlayerContainer.children();
        let rightPlayers = this.rightPlayerContainer.children();

        let allFieldsFull = true;
        for(let i = 0; i < leftPlayers.length - 1; i++) {
            if(leftPlayers[i].text === '') {
                allFieldsFull = false;
            }

            if(rightPlayers[i].text === '') {
                allFieldsFull = false;
            }
        }
        return allFieldsFull;
    }

    private updatePlayerListHeights(): void {
        this.leftPlayerContainer.height = this.playerCounter/2 * this.TEXTINPUT_HEIGHT;
        this.rightPlayerContainer.height = this.playerCounter/2 * this.TEXTINPUT_HEIGHT;
    }

    private submitMatch(): void {
        let leftPlayers = this.leftPlayerContainer.children();
        let rightPlayers = this.rightPlayerContainer.children();



        // Check if players were input
        if (this.playerCounter === 2 && leftPlayers[0].text === ''&& rightPlayers[0].text === '') {
            window.plugins.toast.showLongCenter('Please add players to the match');
            return;
        }

        // Check for empty player fields
        for(let i = 0; i < this.playerCounter / 2; i++) {
            // XOR Operator
            if(!(leftPlayers[i].text === '' && rightPlayers[i].text === '') && (leftPlayers[i].text === '' || rightPlayers[i].text === '')) {
                window.plugins.toast.showLongCenter('Please fill in all empty player fields');
                return;
            }
        }

        // Check for half of last fields
        if(leftPlayers[leftPlayers.length - 1].text === '' && rightPlayers[rightPlayers.length - 1].text !== '') {
            window.plugins.toast.showLongCenter('Please finish Player ' + (this.playerCounter - 1));
            return;
        }

        if(leftPlayers[leftPlayers.length - 1].text !== '' && rightPlayers[rightPlayers.length - 1].text === '') {
            window.plugins.toast.showLongCenter('Please finish Player ' + this.playerCounter);
            return;
        }

        // Check for invalid score fields
        if(isNaN(this.leftScoreInput.text)) {
            window.plugins.toast.showLongCenter("Please fill out the left team's score");
            return;
        }

        if(isNaN(this.rightScoreInput.text)) {
            window.plugins.toast.showLongCenter("Please fill out the right team's score");
            return;
        }



        // If we have gotten here our input fields must be valid
        let leftTeam = [];
        let rightTeam = [];

        for(let i = 0; i < this.playerCounter / 2; i++) {
            if(leftPlayers[i].text !== '') {
                leftTeam.push(leftPlayers[i].text);
                rightTeam.push(rightPlayers[i].text);
            }
        }

        let match = new Match(leftTeam, rightTeam, this.leftScoreInput.text, this.rightScoreInput.text);
        ServiceLayer.httpPostAsync('/match/approved', {match: match, leagueId: +localStorage.getItem('currentLeagueId')}, response => {
            window.plugins.toast.showLongCenter(response.message);
        });

    }
}
