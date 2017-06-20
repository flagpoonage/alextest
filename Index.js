
const PEPSocket = require("mydoc-plugins/pep/pepsocket");
const loki = require('lokijs')
const setup = require("./Setup");
const CS = require("mydoc-plugins/console");

var client; 
var idArray;

var my_account;

const incomingGroup = function(group){
    if(my_account.chat_id_username === group.from){
        return;
    }
    var sendTo = group.object_id;

    var message = {
        to: sendTo,
        object_type: "message",
        payload: "Yo",
        payload_type: "text"
    };

    client._send(message);

};

const incomingUser = function(user) {
    if(my_account.chat_id_username === user.from){
        return;
    }
    var sendTo = user.object_id;

    var message = {
        to: sendTo,
        object_type: "message",
        payload: "Sup",
        payload_type: "text"
    };

    client._send(message);
};

const incomingMessage = function(inbound) {
    if(my_account.chat_id_username === inbound.from){
        return;
    }

    console.log(inbound);

    switch(inbound.payload.toLowerCase()){
        case "hello" :
            var payloads = "Hello! How may I help you?";
            break;
        case "goodbye" :
            var payloads = "Cya!";
            break;
        case "i'm in pain" :
            var payloads = "Where are you hurting? Let me redirect you to a real doctor."
            break;
        case "i'm hurting" :
            var payloads = "Where are you hurting? Let me redirect you to a real doctor."
            break;
        default:
            var payloads = "I don't understand";
            break;
    };
    
        var message = {
            to: inbound.to,
            object_type: "message",
            payload: payloads, 
            payload_type: "text"
        }

    client._send(message);
    
};

let DB = new loki('db.json', {
    autosave: true,
    autosaveInterval: 5000,
    autload: true
});

DB.addCollection('messages');

DB.insert({ name: 'test', value: 1});

setup.then(function(data){

    client = new PEPSocket({
        console_info_impl: CS.slog,
        console_warn_impl: CS.serr,
        address: "wss://ws.uat.my-doc.com/ws/",
        token: data.authentication.access_token,
        socket_impl: require("ws"),
    });

    my_account = data.account;

    CS.slog("Setup is complete!", data.account, data.authentication);

    

    return client.connect(data.authentication.access_token);

}).then(function (){

    client._listen("message", function(incoming){

        switch (incoming.object_type) {
            case "group":
                return incomingGroup(incoming);
            case "user":
                return incomingUser(incoming);
            case "message":
                return incomingMessage(incoming);
            default:
            return CS.serr("I don't know what to do with this message!", incoming);
        }

    });

    CS.slog("Connected");

});

