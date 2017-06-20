
const xhr = require("reqwest");

var body = {
    email: "alexsbotbot@my-doc.com",
    contact: "+6598120980",
    client_id: "0a401b31135b7494753c9f677c44cfbe",
    client_secret: "a402746255d2e4a2829e4884776a5619"
};

var options = {
    method: "post",
    type: "json",
    url: "https://api.uat.my-doc.com/public/accounts/validate",
    data: body
};

xhr(options)
.then(function(response){
    console.log(response);
})
.catch(function(error){
    console.log(error.response);
});