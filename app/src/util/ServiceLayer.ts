import {Config} from "../config/Config";
export class ServiceLayer {

    public static httpGetAsync(route: string, query: string, callback: (response: any) => void) {

        let fetchRequest: Request = new Request(Config.url + route + '?' + query, {
            method: 'GET',
            body: null,
        });


        fetch(fetchRequest).then((res) => {
            //res.json() returns a promise of a parsed json object
            return res.json();
        }).then((resObj) => {
            //Once the object is resolved run the callback with the received object as the parameter
            callback(resObj);
            console.log('Get Success');
        }).catch((ex) => {
            console.log('Get Request Error');
            console.error(ex)
        });
    }


    public static httpPostAsync(route: string, data: any, callback: (response: Response) => void) {
        let fetchRequest: Request = new Request(Config.url + route, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(data),
        });
        

        fetch(fetchRequest).then((res) => {
            return res.json();
        }).then((json) => {
            callback(json);
            console.log('Post Success');
        }).catch((ex) => {
            console.log('Post Request Error');
            console.error(ex)
        });
    }

    public static httpDeleteAsync(route: string, query: string, callback: (response: Response) => void) {


        let fetchRequest: Request = new Request(Config.url + route + '?' + query, {
            method: 'DELETE',
            body: null,
        });

        fetch(fetchRequest).then((res) => {
            callback(res);

            return res.json();
        }).then((json) => {
            console.log('Delete Success');
        }).catch((ex) => {
            console.log('Delete Request Error');
            console.error(ex)
        });
    }


}