var mongo = require("../mongoConfig");
var ObjectId = require('mongodb').ObjectId;
var mongoClient = require("../mongoConfig").connect("mongodb://localhost:27017/cbot272");
var apiai = require('apiai');

exports.handleNewMessage = function (req, res) {
    // console.log(req);
    var api_ai = apiai("0a23b2e84313461080e802b2787d9a79");
    console.log(req.body.newMessage);

    newMessage = req.body.newMessage;
    console.log("message received : " + newMessage);
    var request = api_ai.textRequest(newMessage, {
        sessionId: '1'
    });

    request.on('response', function (response) {
        console.log(response.result.fulfillment.messages);
        if (response.result.fulfillment.messages.indexOf("Address")) {
            console.log("address");
            var users = mongo.collection("users");
            users.find({studentId: "01187331"}, {address: 1}).toArray(function (err, results) {
                if (err) {
                    console.log(err);
                    res.status(400).send(err);
                } else {
                    if (results.length > 0) {
                        console.log(results);
                        res.status(200).send(results);
                    }
                    else {
                        res.status(400).send();
                    }
                }
            });
        }
    });

    request.on('error', function (error) {
        console.log(error);
    });

    request.end();


};
