const express = require('express');
const request = require('superagent');
const bodyParser = require('body-parser');
const https = require('https');


//Variables
let pageToken = "EAACk3taKgYIBAArgqQfGbw2X4CFjIoJYZCM7z0ZCLaI6z7Pd7V4Fs2Ru2joRF1QBoRHOoEwKuuZBQ06mrUJwXcRosL3HiyGkq6QDLmL4IYHlMAmqgLOxqYDcGIjYkSo1lyrDXaK1tS6KbCI0Y1ZCfRbwpb9MnQoDo0Ajh9R5jAZDZD";
const verifyToken = "mohit"
const privkey = "/etc/letsencrypt/live/cbot272.com/privkey.pem";
const cert = "/etc/letsencrypt/live/cbot272.com/cert.pem";
const chain = "/etc/letsencrypt/live/cbot272.com/fullchain.pem";


const app = express();
const fs = require('fs');

app.use(bodyParser.json());

app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === verifyToken) {
        return res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});
app.post('/webhook', (req, res) => {
    const messagingEvents = req.body.entry[0].messaging;

    messagingEvents.forEach((event) => {
        const sender = event.sender.id;

        if (event.postback) {
            const text = JSON.stringify(event.postback).substring(0, 200);
            sendTextMessage(sender, 'Postback received: ' + text);
        } else if (event.message && event.message.text) {
            const text = event.message.text.trim().substring(0, 200);

            if (text.toLowerCase() === 'generic') {
                sendGenericMessage(sender);
            } else {
                sendTextMessage(sender, 'Text received, echo: ' + text);
            }
        }
    });

    res.sendStatus(200);
});

function sendMessage (sender, message) {
    request
        .post('https://graph.facebook.com/v2.6/me/messages')
        .query({access_token: pageToken})
        .send({
            recipient: {
                id: sender
            },
            message: message
        })
        .end((err, res) => {
            if (err) {
                console.log('Error sending message: ', err);
            } else if (res.body.error) {
                console.log('Error: ', res.body.error);
            }
        });
}

function sendTextMessage (sender, text) {
    sendMessage(sender, {
        text: text
    });
}

function sendGenericMessage (sender) {
    sendMessage(sender, {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [{
                    title: 'First card',
                    subtitle: 'Element #1 of an hscroll',
                    image_url: 'http://messengerdemo.parseapp.com/img/rift.png',
                    buttons: [{
                        type: 'web_url',
                        url: 'https://www.messenger.com/',
                        title: 'Web url'
                    }, {
                        type: 'postback',
                        title: 'Postback',
                        payload: 'Payload for first element in a generic bubble'
                    }]
                }, {
                    title: 'Second card',
                    subtitle: 'Element #2 of an hscroll',
                    image_url: 'http://messengerdemo.parseapp.com/img/gearvr.png',
                    buttons: [{
                        type: 'postback',
                        title: 'Postback',
                        payload: 'Payload for second element in a generic bubble'
                    }]
                }]
            }
        }
    });
}

app.post('/token', (req, res) => {
    if (req.body.verifyToken === verifyToken) {
        pageToken = req.body.token;
        return res.sendStatus(200);
    }
    res.sendStatus(403);
});
app.get('/token', (req, res) => {
    if (req.body.verifyToken === verifyToken) {
        return res.send({token: pageToken});
    }
    res.sendStatus(403);
});

 https.createServer({
      key: fs.readFileSync(privkey),
      cert: fs.readFileSync(cert),
      ca: fs.readFileSync(chain)
    }, app).listen(55555, function () {
  console.log('App is ready on port 55555');
})
