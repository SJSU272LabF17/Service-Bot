'use strict'

const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const request = require('request')
const app = express();

var key = fs.readFileSync('./private.key');
var cert = fs.readFileSync( './domain.crt' );

var options = {
  key: key,
  cert: cert
};

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    else{
		res.send('Error, wrong token')
	}
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            decideMessage(sender, text);
            continue
        }
        if (event.postback) {
        	let text = JSON.stringify(event.postback)
        	decideMessage(sender, text);
        	continue
      }
    }
    res.sendStatus(200)
})

const token = "EAADPuY7AusgBAL5wNKMrokW32BgDCVESDwtXp0u4ytJ0gmxHB9LISBwGW2y6XFEi3oBgNFb0BqMbV89d80DUqfZBV4Ln4ttZBsKOg1alqDqaNA1Wlx4ZAFQOZBAj7iquLpmTcEEcDs6FriESRU0WTQ99TAECWB4UNWArcqGIhAZDZD"

var popularTypesOfItems = {
    invitations:  {
        header: "Invitations",
        subtitle: "Friends and Family Welcome!",
        image_url: "http://scene7.targetimg1.com/is/image/Target/15406466?wid=1024&hei=1024&qlt=70&fmt=pjpeg",
        url: "http://www.target.com/c/baby-shower-party-supplies/-/N-4soei%7Cd_item_type_all%3Ainvitation%20packs?Sort=Featured&clearCategId=4soei&Nao=0",
        button_title: "See Items Like"
    },
    favorBags: {
        header: "Favor Bags",
        subtitle: "Grab-and-go sweet treats",
        image_url: "http://scene7.targetimg1.com/is/image/Target/50701956?wid=450&hei=450&fmt=pjpeg",
        url: "http://www.target.com/c/baby-shower-party-supplies/-/N-4soei%7Cd_item_type_all%3AFavor%20Bag?Sort=Featured&clearCategId=4soei&Nao=0",
        button_title: "See Items Like"
    }
}

var specificItems = {
    sunscreens: {
        sunscreen1: {
            header: "Alba Botanica",
            subtitle: "Keeping your skin youthful",
            image_url: "http://scene7.targetimg1.com/is/image/Target/16872833?wid=1024&hei=1024&qlt=70&fmt=pjpeg",
            url: "http://www.target.com/p/alba-botanica-emollient-sunscreen-active-kids-clear-spray-spf-50-6-oz/-/A-16872833",
            button_title_1: "See Item",
            button_title_2: "Add to Cart"
        },
         sunscreen2: {
            header: "Neutrogena Beach Defense",
            subtitle: "Protecting your skin on the go!",
            image_url: "http://scene7.targetimg1.com/is/image/Target/50787513?wid=450&hei=450&fmt=pjpeg",
            url: "http://www.target.com/p/neutrogena-oh-joy-beach-defense-spray-sunscreen-broad-spectrum-spf-70-6-5-oz/-/A-50787513",
            button_title_1: "See Item",
            button_title_2: "Add to Cart"
        },
        sunscreen3: {
            header: "Coppertone Kids",
            subtitle: "Sun protection made easy!",
            image_url: "http://scene7.targetimg1.com/is/image/Target/50584700?wid=1024&hei=1024&qlt=70&fmt=pjpeg",
            url: "http://www.target.com/p/coppertone-kids-sunscreen-continuous-spray-spf-50/-/A-50584700",
            button_title_1: "See Item",
            button_title_2: "Add to Cart"
        }
    },

    infant_boy_clothing: {
         clothing1: {
            header: "Organically-Made Pajamas",
            subtitle: "Keeping your baby comfy throughout the night",
            image_url: "http://target.scene7.com/is/image/Target/51186963?wid=450&hei=450&fmt=pjpeg",
            url: "http://www.target.com/p/lamaze-baby-waffle-footed-sleeper-red/-/A-51261899",
            button_title_1: "See Item",
            button_title_2: "Add to Cart"
        },
        clothing2: {
            header: "Baby Boys' 4 Piece: Cat & Jack",
            subtitle: "Providing style and comfort",
            image_url: "http://target.scene7.com/is/image/Target/50897885?wid=450&hei=450&fmt=pjpeg",
            url: "http://www.target.com/p/baby-boys-4-piece-tiger-set-baby-cat-jack-turquoise-white/-/A-51112241",
            button_title_1: "See Item",
            button_title_2: "Add to Cart"
        },
        clothing3: {
            header: "Burt's Bees Infant 2 Pack",
            subtitle: "Ready to rock and roll!",
            image_url: "http://target.scene7.com/is/image/Target/50363846?wid=1024&hei=1024&qlt=70&fmt=pjpeg",
            url: "http://www.target.com/p/burt-s-bees-baby-infant-boys-2-pack-bodysuit-camo-striped/-/A-50363847",
            button_title_1: "See Item",
            button_title_2: "Add to Cart"
        }

    } 
}


function decideMessage(sender, text1) {
	let text = text1.toLowerCase();
	if (text.includes("baby shower") && text.includes("throwing")) {
		sendTextMessage(sender, "Congrats! Do you need anything for your baby shower?");
		send2TypesOfItems(sender, popularTypesOfItems.invitations, popularTypesOfItems.favorBags)
	} else if (text.includes("add to cart")) {
		sendTextMessage(sender, "Added to shopping cart!")
	} else if (text.includes("no")) {
		sendButtonMessage(sender, "I see it's summertime. Here are some things you might need.", "Sunscreen", "Flip Flops", "Sunglasses")
	} else if (text.includes("sunscreen")) {
		sendTextMessage(sender, "Here are some great deals on sunscreen!");
	    send3SpecificItems(sender, specificItems.sunscreens.sunscreen1, specificItems.sunscreens.sunscreen2, specificItems.sunscreens.sunscreen3)
	} else if (text.includes("gift")) {
		sendButtonMessage(sender, "What is the occasion?", "Baby Shower", "Birthday", "Graduation");
	} else if (text.includes("baby shower")) {
		sendButtonMessage(sender, "What's your price range?", "$0 - $15", "$15 - $50", "$50 - $100")
	} else if (text.includes("$")) {
		sendButtonMessage(sender, "Here are some customer favorites!", "Clothes", "Stroller", "Toys")
	} else if (text.includes("clothes")) {
		sendTextMessage(sender, "Boy or girl?")
	} else if (text.includes("boy")) {
		send3SpecificItems(sender, specificItems.infant_boy_clothing.clothing1, specificItems.infant_boy_clothing.clothing2, specificItems.infant_boy_clothing.clothing3)
	} else {
		sendTextMessage(sender, "Can you ask again?");
	}
}

function sendButtonMessage(sender, text, button1, button2, button3) {
	let messageData = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":text,
        "buttons":[
          {
            "type":"postback",
            "title":button1,
            "payload":button1.toLowerCase()
          },
          {
            "type":"postback",
            "title":button2,
            "payload":button2.toLowerCase()
          },
          {
            "type":"postback",
            "title":button3,
            "payload":button3.toLowerCase()
          }
        ]
      }
    } 
}
     request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function send2TypesOfItems(sender, obj1, obj2) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": obj1.header,
                    "subtitle": obj1.subtitle,
                    "image_url": obj1.image_url,
                    "buttons": [{
                        "type": "web_url",
                        "url": obj1.url,
                        "title": obj1.button_title
                    }],
                }, {
                    "title": obj2.header,
                    "subtitle": obj2.subtitle,
                    "image_url": obj2.image_url,
                    "buttons": [{
                        "type": "web_url",
                        "url": obj2.url,
                        "title": obj2.button_title
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function send3SpecificItems(sender, obj1, obj2, obj3) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": obj1.header,
                    "subtitle": obj1.subtitle,
                    "image_url": obj1.image_url,
                    "buttons": [{
                        "type": "web_url",
                        "url": obj1.url,
                        "title": obj1.button_title_1
                    }, {
                        "type": "postback",
                        "title": obj1.button_title_2,
                        "payload": obj1.button_title_2.toLowerCase(),
                    }],
                }, {
                    "title": obj2.header,
                    "subtitle": obj2.subtitle,
                    "image_url": obj2.image_url,
                    "buttons": [{
                        "type": "web_url",
                        "url": obj2.url,
                        "title": obj2.button_title_1,
                    }, {
                    	"type": "postback",
                        "title": obj2.button_title_2,
                        "payload": obj2.button_title_2.toLowerCase(),
                    }],
                }, {
                    "title": obj3.header,
                    "subtitle": obj3.subtitle,
                    "image_url": obj3.image_url,
                    "buttons": [{
                        "type": "web_url",
                        "url": obj3.url,
                        "title": obj3.button_title_1,
                    }, {
                    	"type": "postback",
                        "title": obj3.button_title_2,
                        "payload": obj3.button_title_2.toLowerCase(),
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


// Spin up the server
//var https = require('https');
//https.createServer(options, app).listen(8443, function(){
//   console.log('server is up and running');
//});

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
















