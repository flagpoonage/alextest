

const xhr = require("reqwest");

var body = { grant_type: "password",
client_id: "0a401b31135b7494753c9f677c44cfbe",
client_secret: "a402746255d2e4a2829e4884776a5619",
username: "alexsbotbot@my-doc.com",
password: "mydoc123"
};


var options = {
    method: "post",
    data: body,
    url: "https://api.uat.my-doc.com/oauth/access_token",
    type: "json",
    };

xhr(options).then(function(response){
    console.log(response);
    console.log("Access Token", response.data.authentication.access_token);

    let fn_request = {
        method: "post",
        url: "https://api.uat.my-doc.com/api/v2/functions",
        type: "json",
        data: {
            name: "My Function",
            access_token: response.data.authentication.access_token
        }

    };

    return xhr(fn_request).then(function(response){
        console.log(response);
    })
    .catch(function(err){
        console.log(err.response);
    }).catch(function(error){
        console.log(error.response);
    });
    
})