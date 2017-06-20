
const xhr = require("reqwest");
const CS  = require("mydoc-plugins/console");
const Loki = require('lokijs');

var body = {
    grant_type: "password",
    client_id: "0a401b31135b7494753c9f677c44cfbe",
    client_secret: "a402746255d2e4a2829e4884776a5619",
    username: "alexsbotbot@my-doc.com",
    password: "mydoc123"
}

var options = {
    method: "post",
    type: "json",
    url: "https://api.uat.my-doc.com/oauth/access_token",
    data: body
}

module.exports = new Promise((resolve, reject) => {

    var account, authentication, db;

    const onResolve = data => a => {
        CS.slog('Database loading complete');
        data.database = db;
        resolve(data);
    };

    xhr(options).then(function(response){

        CS.slog('Authenticated', response.data);

        authentication = response.data.authentication;

        var access_token = authentication.access_token;

        let getAccount = {
            method: "get",
            url: "https://api.uat.my-doc.com/api/v2/accounts",
            data: {access_token: access_token}
        }

        return xhr(getAccount).then(function(response){

            CS.slog('Account info returned', response.data);

            account = response.data;

            var id = response.data.id;
            // console.log(response);
            // console.log("=".repeat(100));
            // console.log("Account ID is " + id);
            // console.log("=".repeat(100));

            db = new Loki('db.json', {
                autosave: true,
                autosaveInterval: 5000,
                serializationMethod: 'pretty',
                persistenceMethod: 'fs',
                autoload: true,
                autoloadCallback: onResolve({
                    account: account,
                    authentication: authentication
                })
            });
        
        }).catch(function (error){
            console.log(error.response);
        });
    
    }).catch(function(error){
        console.log(error.response);
    });
});