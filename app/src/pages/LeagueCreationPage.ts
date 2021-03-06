/**
 * Created by STYRLabs2 on 6/7/2017.
 */
import {BasePage} from './BasePage';
import * as tabris from 'tabris';
import {Composite, TextView} from "tabris";
import {CustomButton} from '../components/CustomButton';
import {InvitePage} from "./InvitePage";
import {ServiceLayer} from "../util/ServiceLayer";
import {LeaguePreferences} from "../../../common/LeaguePreferences";
import {User} from "../../../common/User";
import {ColorScheme} from "../util/ColorScheme";
import {CacheManager} from "../util/CacheManager";

const HIGH_SCORE = [
    {
        id: '0',
        name: 'wins'
    },
    {
        id: '1',
        name: 'loses'
    }
];
const SCORE_RANGE = [
    {
        id: '0',
        name: '0 to ∞'
    },
    {
        id: '1',
        name: '-∞ to ∞'
    },
    {
        id: '2',
        name: '-∞ to 0'
    }
];


export class LeagueCreationPage extends BasePage {
    private ownerID: number;

    constructor(userIdentification: number) {
        super();
        this.ownerID = userIdentification;

        this.createComponents();
    }

    private createComponents() {
        this.page.background = ColorScheme.Background;
        this.page.title = 'Create a League';
        let inviteButton: CustomButton;

        new tabris.TextInput({
            top: 20, left: '10%', right: '10%',
            message: 'Title of League',
            enterKeyType: 'send',
            autoCorrect: true
        }).on('focus', (event) => {
            inviteButton.enabled = false;
            inviteButton.visible = false;
        }).on('blur', (event) => {
            inviteButton.enabled = true;
            inviteButton.visible = true;
        }).appendTo(this.page).on('textChanged', ({value}) => {
            LeagueInfo.leaguePref.title = value;
        });


        let switchComp = new Composite({
            top: 'prev() 40',
            left: 0,
            right: 0
        }).appendTo(this.page);
        switchComp.append(new tabris.TextView({
            text: 'Matches must be approved by admin',
            left: '10%',
            centerY: 0
        }));
        switchComp.append(new tabris.Switch({
            left: 'prev() 10',
            id: 'switch',
            centerY: 0,
            checked: true
        }));

        switchComp.visible = false;

        let scoreComp = new Composite({
            top: 'prev() 40',
            left: 0,
            right: 0
        }).appendTo(this.page);

        new TextView({text: 'Score Range is...', font: 'bold 20px', centerX: 0}).appendTo(scoreComp);
        new tabris.Picker({
            top: 'prev() 10',
            left: '10%',
            right: '10%',
            itemCount: SCORE_RANGE.length,
            itemText: (index) => SCORE_RANGE[index].name,
            selectionIndex: 0
        }).appendTo(scoreComp).on('selectionIndexChanged', ({value}) => {
            LeagueInfo.leaguePref.scoreRange = value;
        });

        let highestScore = new Composite({
            top: 'prev() 40',
            left: 0,
            right: 0
        }).appendTo(this.page);

        new TextView({text: 'Highest score...', font: 'bold 20px', centerX: 0}).appendTo(highestScore);
        new tabris.Picker({
            top: 'prev() 10',
            left: '10%',
            right: '10%',
            itemCount: HIGH_SCORE.length,
            itemText: (index) => HIGH_SCORE[index].name,
            selectionIndex: 0
        }).appendTo(highestScore).on('selectionIndexChanged', ({value}) => {
            LeagueInfo.leaguePref.highestScore = value;
        });

        let userObj: User = CacheManager.getCurrentUser();
        let arrayId = [];
        arrayId.push(userObj.id);
        let LeagueInfo = {
            //place userId of current logged in user here
            ownerId: userObj.id,
            leaguePref: new LeaguePreferences(true, 'My League', 'Arizona', 0, 0),
            playerIds: arrayId
        };

        inviteButton = new CustomButton({
            bottom: 10,
            left: '10%',
            right: '10%',
            background: ColorScheme.Background
        }, 'Invite...').on('tap', () => {
            let invitePage = new InvitePage();

            this.page.parent().append(invitePage.page)
            invitePage.createComponents(LeagueInfo);
        }).changeBorderColor('#000000');

        inviteButton.appendTo(this.page);
        return this.page;
    }

}