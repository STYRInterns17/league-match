
export class ServiceLayer {

    private static URL: string = 'http://192.168.100.185:3000';


    public static httpGetAsync(route: string, query: string, callback: (response: any) => void) {

        let fetchRequest: Request = new Request(this.URL + route + '?' + query, {
            method: 'GET',
            body: null,
        });


        fetch(fetchRequest).then((res)=>{
            //res.json() returns a promise of a parsed json object
            return res.json();
        }).then((resObj)=>{
            //Once the object is resolved run the callback with the received object as the parameter
            console.log(resObj);
            callback(resObj);
            console.log('Get Success');
        }).catch((ex)=>{
            console.log('Get Request Error');
            console.error(ex)
        });
    }


    public static httpPostAsync(route: string, data: any, callback: (response: Response) => void) {

        let fetchRequest: Request = new Request(this.URL + route, {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data),
        });

        console.log(JSON.stringify(data));

        fetch(fetchRequest).then((res)=>{
            callback(res);
            return res.json();
        }).then((json)=>{
            console.log('Post Success');
        }).catch((ex)=>{
            console.log('Post Request Error');
            console.error(ex)
        });
    }

    public static httpDeleteAsync(route: string, query: string, callback: (response: Response) => void) {


        let fetchRequest: Request = new Request(this.URL + route + '?' + query, {
            method: 'DELETE',
            body: null,
        });

        fetch(fetchRequest).then((res)=>{
            callback(res);

            return res.json();
        }).then((json)=>{
            console.log('Delete Success');
            console.log(json);
        }).catch((ex)=>{
            console.log('Delete Request Error');
            console.error(ex)
        });
    }


}