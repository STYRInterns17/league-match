import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import {UserController} from "./controllers/UserController";
import {UserPreferences} from "./models/UserPreferences";
import {User} from "./models/User";
import {LeagueController} from "./controllers/LeagueController";
import {NotificationController} from "./controllers/NotificationController";
import {ActivityController} from "./controllers/ActivityController";
import {DBManager} from "./db/DBManager";

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
        const server = http.createServer(this.express);
        server.listen(3000);
        console.log('We are now listening on 3000');
        console.log(JSON.stringify({userPref: new UserPreferences('curt@styr.com', 'passcode', 'I like to fly kites', 1)}));

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
        router.get('/user', (req,res) => {
            let userId:number = req.query.userId;

            res.json(UserController.get(userId));
        });

        //CreateNewUser, SignUp
        router.post('/user', (req,res) =>{
            let userPref: UserPreferences = req.body.userPref;
            console.log(req.body.userPref);
            UserController.create(userPref);
            res.json({
                success: true
            });
        });

        //UpdateUserSettings
        router.post('/user/pref', (req,res) => {
            let userId: number = req.body.userId;
            let userPref: UserPreferences = req.body.userPref;

            UserController.updatePreferences(userId, userPref);

            res.json({
                success: true
            });
        });

        //GetUserSettings
        router.get('/user/pref', (req,res) => {
            let userId: number = req.query.userId;

            res.json(UserController.getPreferences(userId));
        });

        //Validate User Login
        router.post('/user/validate', (req,res) => {
            let email: string = req.body.email;
            let password: string = req.body.password;

            res.json(UserController.validate(email, password));
        });


        //GetLeagueUserIds
        router.get('/league/users', (req,res) => {
            let leagueId: number = req.query.leagueId;

            res.json(LeagueController.getUsers(leagueId));
        });

        //GetLeagueMatchHistory
        router.get('/league/match/history', (req,res) => {
            let leagueId: number = req.query.leagueId;
            let startDate: Date = req.query.startDate;
            let endDate: Date = req.query.endDate;

            res.json(LeagueController.getMatches(leagueId,startDate,endDate));
        });

        //CreateNewLeague
        router.post('/league', (req, res) => {
            let ownerId = req.body.userId;
            let leaguePref = req.body.pref;

            res.json(LeagueController.create(ownerId, leaguePref));
        });

        //Delete League
        router.delete('/league', (req, res) => {
            let leagueId = req.query.leagueId;

            res.json(LeagueController.delete(leagueId));
        });

        //Post Match Approved
        router.post('/league/match', (req, res) => {
            let leagueId = req.body.leagueId;
            let match = req.body.match;

            res.json(LeagueController.postMatch(leagueId, match));
        });


        //Post Match UnApproved
        router.post('/league/match', (req, res) => {
            let leagueId = req.body.leagueId;
            let submitterId = req.body.userId;
            let match = req.body.match;

            res.json(LeagueController.postMatchUnapproved(leagueId, submitterId, match));
        });

        //Get Notifications
        router.get('/notification/user', (req, res) => {
            let userId = req.query.id;

            res.json(NotificationController.getNotifications(userId));
        });

        //Dismiss Notification
        router.post('/notification/user/dismiss', (req, res) => {
            let userId = req.body.userId;
            let notificationId = req.body.notificationId;

            res.json(NotificationController.dismissNotification(userId, notificationId));
        });

        //Send Notification To User
        router.post('/notification/user', (req, res) => {
            let userId = req.body.userId;
            let message = req.body.message;
            let submitterId = req.body.sumbmitterId;

            res.json(NotificationController.sendNotificationToUser(message,userId,submitterId));
        });

        //Send Notification To Entire League aka BroadCast
        router.post('/notification/league', (req, res) => {
            let leagueId = req.body.leagueId;
            let message = req.body.message;
            let submitterId = req.body.sumbmitterId;

            res.json(NotificationController.sendNotificationToLeague(message,leagueId,submitterId));
        });

        //Get User Activity History
        router.get('/activity/user', (req,res) => {
           let userId = req.body.userId;
           let startDate = req.body.startDate;
           let endDate = req.body.endDate;

           res.json(ActivityController.getHistory(userId, startDate,endDate));
        });

        //Append to User activity History
        router.post('/activity/user', (req,res) => {
            let userId = req.body.userId;
            let activityValue = req.body.activityValue;

            res.json(ActivityController.appendHistory(userId,activityValue));
        });

        this.express.use('/', router);
    }

}

new App();
