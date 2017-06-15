import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import {UserController} from "./controllers/UserController";
import {UserPreferences} from "../../../common/UserPreferences";
import {User} from "../../../common/User";
import {LeagueController} from "./controllers/LeagueController";
import {NotificationController} from "./controllers/NotificationController";
import {ActivityController} from "./controllers/ActivityController";
import {DBManager} from "./db/DBManager";
import {json} from "body-parser";
import {MapManager} from "./db/MapManager";
import {MatchController} from "./controllers/MatchController";
import {Match} from "../../../common/Match";
import {LeaguePreferences} from "../../../common/LeaguePreferences";
import {isUndefined} from "util";
import {ApprovalType} from "../../../common/ApprovalType";

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        DBManager.init(); // Initialize database
        MapManager.init();
        const server = http.createServer(this.express);
        server.listen(3000);
        console.log('We are now listening on 3000');

        // console.log(JSON.stringify({leagueId: 0, match: new Match(['curt'],['sal'], 10, 20)}))
        // console.log(JSON.stringify({ownerId: 0, leaguePref: new LeaguePreferences(false, 'first league', 'arizona', 0, 0)}))
        //console.log(JSON.stringify({userPref: new UserPreferences('curt@styr.com', 'passcode', 'I like to fly kites', 1), userId: 1}));
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: false}));
    }


    // Configure API endpoints.
    private routes(): void {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        let router = express.Router();


        //GetUser
        router.get('/user', (req, res) => {
            let userId: number = req.query.userId;
            console.log('Getting user: ' + userId);
            UserController.get(userId).then((user) => {

                if (isUndefined(user)) {
                    res.json({message: 'Cashe Invalid UserId: ' + userId + ' does not exist'});
                } else {
                    res.json({message: 'success', user: user});
                }

            });
        });

        //CreateNewUser, SignUp
        router.post('/user', (req, res) => {
            let userPref: UserPreferences = req.body.userPref;
            let userEmail: string = req.body.userEmail;
            UserController.create(userPref, userEmail);
            res.json({
                success: true
            });
        });

        //UpdateUser
        router.post('/user/update', (req, res) => {
            let user: User = req.body;
            UserController.updateUser(user);
            res.json({
                success: true
            });
        });

        //UpdateUserSettings
        router.post('/user/pref', (req, res) => {
            let userId: number = req.body.userId;
            let userPref: UserPreferences = req.body.userPref;
            UserController.updatePreferences(userId, userPref);
            res.json({
                success: true
            });
        });

        //GetUserSettings
        router.get('/user/pref', (req, res) => {
            let userId: number = req.query.userId;

            res.json(UserController.getPreferences(userId));
        });

        //Validate User Login
        router.post('/user/validate', (req, res) => {
            let email: string = req.body.userEmail;
            let password: string = req.body.userPassword;

            UserController.validate(email, password).then(user => {
                res.json({success: true, user: user});
            }).catch(reason => {
                res.json({success: false});
            });
        });


        // Get User by email
        router.get('/user/id', (req, res) => {
            let email: string = req.query.email;
            MapManager.getItemId('emails', email).then(id => {
                res.json(id);
            }).catch(reason => {
                res.json({success: false});
            });
        });

        // Does User email exist
        router.get('/user/email', (req, res) => {
            let email: string = req.query.email;

            // TODO move into UserController
            MapManager.doesItemExist('emails', email).then(doesExist => {
                res.json(JSON.stringify(doesExist));
            });
        });

        router.post('/user/email/update', (req, res) => {
            let oldEmail: string = req.body.oldEmail;
            let newEmail: string = req.body.newEmail;

            // TODO Finish This
        });

        router.post('/user/name/update', (req, res) => {
            let userId: number = req.body.userId;
            let newName: string = req.body.userName;

            UserController.updateUserName(userId, newName).then(user => {
                res.json(user);
            }).catch(reason => {
                res.json({message: reason})
            })
        });

        router.get('/user/name', (req, res) => {
            let userName: string = req.query.userName;

            UserController.getUserByName(userName).then(userId => {
                res.json(userId);
            }).catch(reason => {
                res.json({message: reason});
            })
        });


        //GetLeague
        router.get('/league', (req, res) => {
            let leagueId: number = req.query.leagueId;

            LeagueController.get(leagueId).then(value => {
                res.json(value);
            });
        });


        //GetLeagueUserIds
        router.get('/league/users', (req, res) => {
            let leagueId: number = req.query.leagueId;

            res.json(LeagueController.getUsers(leagueId));
        });


        //GetLeagueMatchHistory
        router.get('/league/match/history', (req, res) => {
            let leagueId: number = req.query.leagueId;
            let startDate: Date = req.query.startDate;
            let endDate: Date = req.query.endDate;

            res.json(LeagueController.getMatches(leagueId, startDate, endDate));
        });

        //CreateNewLeague
        router.post('/league', (req, res) => {
            let ownerId = req.body.ownerId;
            let leaguePref = req.body.leaguePref;
            LeagueController.create(ownerId, leaguePref).then(value => {
                res.json({id: value});
            });

        });

        //add user to League
        router.post('/league/addUser', (req, res) => {
            let leagueId = req.body.leagueId;
            let userId = req.body.userId;
            LeagueController.addLeaguePlayers(leagueId, userId);
                res.json({success: true});
        });

        //Delete League
        router.delete('/league', (req, res) => {
            let leagueId = req.query.leagueId;

            res.json(LeagueController.delete(leagueId));
        });

        //Post Match Approved
        router.post('/match/approved', (req, res) => {
            let leagueId = req.body.leagueId;
            let match = req.body.match;

            MatchController.logMatch(leagueId, match).then(value => {
                res.json({message: value});
            }).catch(reason => {
                res.json({message: reason});
            });

        });


        //Post Match UnApproved
        router.post('/match', (req, res) => {
            let leagueId = req.body.leagueId;
            let submitterId = req.body.userId;
            let match = req.body.match;

            res.json(LeagueController.postMatchUnapproved(leagueId, submitterId, match));
        });

        //Get Notifications
        router.get('/notification/user', (req, res) => {
            let userId: number = req.query.userId;

            NotificationController.getNotifications(userId).then((notificationList) => {
                res.json(notificationList.list);
            });
        });

        //Dismiss Notification
        router.post('/notification/user/dismiss', (req, res) => {
            let userId = req.body.userId;
            let notificationId = req.body.notificationId;

            res.json(NotificationController.dismissNotification(userId, notificationId));
        });

        // Read all Notifications
        router.post('/notication/user/read', (req, res) => {
            let userId = req.body.userId;

            res.json(NotificationController.readAllNotifications(userId));
        });

        //Send Notification To User
        router.post('/notification/user', (req, res) => {
            let userId = req.body.userId;
            let message = req.body.message;
            let type = req.body.type;
            let submitterName = req.body.submitterName;
            let submitterLeague = req.body.submitterLeague;
            let data = req.body.approvalData;

            res.json(NotificationController.sendNotificationToUser(message, userId, submitterName, submitterLeague, type, data));
        });

        //Send Notification To Entire League aka BroadCast
        router.post('/notification/league', (req, res) => {
            let leagueId = req.body.leagueId;
            let message = req.body.message;
            let submitterId = req.body.sumbmitterId;

            res.json(NotificationController.sendNotificationToLeague(message, leagueId, submitterId));
        });

        //Get User Activity History
        router.get('/activity/user', (req, res) => {
            let userId = req.body.userId;
            let startDate = req.body.startDate;
            let endDate = req.body.endDate;

            res.json(ActivityController.getHistory(userId, startDate, endDate));
        });

        //Append to User activity History
        router.post('/activity/user', (req, res) => {
            let userId = req.body.userId;
            let activityValue = req.body.activityValue;

            res.json(ActivityController.appendHistory(userId, activityValue));
        });

        this.express.use('/', router);
    }

}

new App();
