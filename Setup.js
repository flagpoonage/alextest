
const xhr = require("reqwest");
const CS  = require("mydoc-plugins/console");
const loki = require('lokijs');

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

const onDbLoaded = function(resolver) {
    return function(db) {
        var account, authentication;

        xhr(options).then(function(response){

            authentication = response.data.authentication;

            var access_token = authentication.access_token;
            console.log(response);
            console.log("=".repeat(100));
            console.log("Access Token is " + access_token);
            console.log("=".repeat(100));

            let getAccount = {
                method: "get",
                url: "https://api.uat.my-doc.com/api/v2/accounts",
                data: {access_token: access_token}
            }

            return xhr(getAccount).then(function(response){

                account = response.data;

                var id = response.data.id;
                console.log(response);
                console.log("=".repeat(100));
                console.log("Account ID is " + id);
                console.log("=".repeat(100));

                resolver({
                    account: account,
                    authentication: authentication
                });

            
            }).catch(function (error){
                console.log(error.response);
            });
        
        }).catch(function(error){
            console.log(error.response);
        });
    };
};

module.exports = new Promise((resolve, reject) => {
  this.db = new loki('db.json', {
    autosave: true,
    autosaveInterval: 5000,
    serializationMethod: 'pretty',
    persistenceMethod: 'fs',
    autoload: true,
    autoloadCallback: onDbLoaded(resolve)
  });
});