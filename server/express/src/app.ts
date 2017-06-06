import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        const server = http.createServer(this.express);
        server.listen(3000);
        console.log('We are now listening on 3000')

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




        router.get('/reminder/query', (req,res) => {
           res.json(() => {
               console.log('Ehh!');
           });
        });


        router.post('/user/pref', (req, res) => {
            res.json({
                success: true
            });

            console.log(req.body);
            console.log('Added reminder to list');
        });


        this.express.use('/', router);
    }

}

new App();
