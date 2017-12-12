var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
var mongo = require('./routes/mongo.js');
require('./routes/passport')(passport);
var mongoURL = "mongodb://shahkevaln:Keval2812@cluster0-shard-00-00-afjjt.mongodb.net:27017,cluster0-shard-00-01-afjjt.mongodb.net:27017,cluster0-shard-00-02-afjjt.mongodb.net:27017/chatbot?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
var mongoClient = require("./mongoConfig").connect(mongoURL);

var routes = require('./routes/index');
var users = require('./routes/users');
var mongoSessionURL = mongoURL;
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSessions({
    secret: "CMPE273_passport",
    resave: false,
    saveUninitialized: false,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));
app.use(passport.initialize());

app.use('/', routes);
app.use('/users', users);

app.post('/logout', function (req, res) {
    console.log(req.session.user);
    req.session.destroy();
    console.log('Session Destroyed');
    res.status(200).send();
});

app.post('/login', function (req, res, next) {
    passport.authenticate('login', function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            res.status(401).send();
        }

        req.logIn(user, {session: false}, function (err) {
            if (err) {
                return next(err);
            }

            req.session.user = user.username;
            console.log(req.session.user);
            console.log("session initilized")
            return res.status(201).send();
        })
    })(req, res, next);
});

// catch 404 and forward to error handler


app.post('/callChatbot', function (req, res) {
    var apiai = require('apiai');

    var app = apiai("0a23b2e84313461080e802b2787d9a79");

    var request = app.textRequest(req.body.question, {
        sessionId: '1'
    });
    console.log(12);
    request.on('response', function (response) {
        console.log(response);
        console.log(JSON.stringify(response.result.fulfillment.messages));
        console.log(JSON.stringify(response.result.parameters));
        console.log(JSON.stringify(response.result.contexts.length > 0));
        var returnvalue = "";
        var x = "";
        var y = "";
        if(response.result.fulfillment.messages[1] !== undefined){
        console.log(response.result.fulfillment.messages[1].payload.value);
        console.log(response.result.fulfillment.messages[1].payload.query);
        var aaj = response.result.fulfillment.messages[1].payload.value;
        var kal = response.result.fulfillment.messages[1].payload.query;

}
        console.log(response.result.fulfillment.messages[0].speech.toString());
        x = response.result.fulfillment.messages[0].speech.toString();
        y = response.result.contexts;
        console.log(y);
        console.log(x);
        console.log("axsadasdsadasdsadasdsa");
if(y[0] != null){
  let abc = response.result.fulfillment.speech.toString();
  console.log(y);
  console.log(abc);
  if(abc=="undefined"){
    res.status(201).send({resp: abc});
  }
  else{
    res.status(201).send({resp: "Please reenter"});
  }

}
else{
        if (x == "Address") {
            mongo.connect(mongoURL, function () {
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('users');
                console.log(req.body);
                coll.findOne({}, function (err, user) {
                    if (user) {
                        console.log(JSON.stringify(user.address));
                        res.status(201).send({resp: user.address});
                    } else {

                        res.status(401).json({resp: wrong});
                    }
                });
            });
        }
        else if (x == "fee") {
            mongo.connect(mongoURL, function () {
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('users');
                console.log(req.body);
                coll.findOne({}, function (err, user) {
                    if (user) {
                        console.log(JSON.stringify(user));
                        res.status(201).send({resp: user.feeAmountDue});
                    } else {

                        res.status(401).json({resp: wrong});
                    }
                });
            });
        }
        else if (x == "courses") {
            mongo.connect(mongoURL, function () {
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('users');
                console.log(req.body);
                coll.findOne({}, function (err, user) {
                    if (user) {
                        console.log(JSON.stringify(user));
                        res.status(201).send({resp: user.classSchedule});
                    } else {

                        res.status(401).json({resp: wrong});
                    }
                });
            });
        }
        else if (x == "contact") {
            mongo.connect(mongoURL, function () {
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('users');
                console.log(req.body);
                coll.findOne({}, function (err, user) {
                    if (user) {
                        console.log(JSON.stringify(user));
                        res.status(201).send({resp: user.contactInfo});
                    } else {

                        res.status(401).json({resp: wrong});
                    }
                });
            });
        }
        else if (x == "advisor") {
            mongo.connect(mongoURL, function () {
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('users');
                console.log(req.body);
                coll.findOne({}, function (err, user) {
                    if (user) {
                        console.log(JSON.stringify(user));
                        res.status(201).send({resp: user.programAdvisor});
                    } else {

                        res.status(401).json({resp: wrong});
                    }
                });
            });
        }
        else if (x == "bursar") {
            let site = response.result.parameters.Website;
            let email = response.result.parameters.O;
            let payment = response.result.parameters.Payment;
            let officeDet = response.result.parameters.BursarOffice;
          console.log(site);
          console.log(email);
          console.log(payment);
          console.log(officeDet);
            if(site.length > 0){
                mongo.connect(mongoURL, function () {
                    console.log('Connected to mongo at: ' + mongoURL);
                    var coll = mongo.collection('bursar');
                    console.log(req.body);
                    coll.findOne({}, function (err, bursar) {
                        if (bursar) {
                            console.log(JSON.stringify(bursar));
                            res.status(201).send({resp: bursar.site});
                        } else {

                            res.status(401).json({resp: wrong});
                        }
                    });
                });
            }
            if(email[0] === "email"){
              console.log("ava");
                mongo.connect(mongoURL, function () {
                    console.log('Connected to mongo at: ' + mongoURL);
                    var coll = mongo.collection('bursar');

                    console.log(req.body);
                    coll.findOne({}, function (err, bursar) {
                        if (bursar) {
                            console.log(JSON.stringify(bursar));
                            res.status(201).send({resp: bursar.email});
                        } else {

                            res.status(401).json({resp: wrong});
                        }
                    });
                });
            }
            if(payment.length > 0){

                mongo.connect(mongoURL, function () {
                    console.log('Connected to mongo at: ' + mongoURL);
                    var coll = mongo.collection('bursar');
                    console.log(req.body);
                    coll.findOne({}, function (err, bursar) {
                        if (bursar) {
                            console.log(JSON.stringify(bursar));
                            res.status(201).send({resp: (bursar.paymenPlan + " ," + bursar.paymentInfo)});
                        } else {

                            res.status(401).json({resp: wrong});
                        }
                    });
                });
            }
            if(officeDet.length > 0){
                mongo.connect(mongoURL, function () {
                    console.log('Connected to mongo at: ' + mongoURL);
                    var coll = mongo.collection('bursar');
                    console.log(req.body);
                    coll.findOne({}, function (err, bursar) {
                        if (bursar) {
                            console.log(JSON.stringify(bursar));
                            res.status(201).send({resp: (bursar.visitAddress+ " ," + bursar.reception)});
                        } else {

                            res.status(401).json({resp: wrong});
                        }
                    });
                });
            }


        }
        else if (x == "todo") {
            mongo.connect(mongoURL, function () {
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('users');
                console.log(req.body);
                coll.findOne({}, function (err, user) {
                    if (user) {
                        console.log(JSON.stringify(user));
                        res.status(201).send({resp: user.toDoListItems});
                    } else {

                        res.status(401).json({resp: wrong});
                    }
                });
            });
        }
        else if (x == "admissionstatus") {
            mongo.connect(mongoURL, function () {
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('users');
                console.log(req.body);
                coll.findOne({}, function (err, user) {
                    if (user) {
                        console.log(JSON.stringify(user));
                        res.status(201).send({resp: user.admissionStatus});
                    } else {

                        res.status(401).json({resp: wrong});
                    }
                });
            });
        }
        else if (x == "todo") {
            mongo.connect(mongoURL, function () {
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('users');
                console.log(req.body);
                coll.findOne({}, function (err, user) {
                    if (user) {
                        console.log(JSON.stringify(user));
                        res.status(201).send({resp: user.toDoListItems});
                    } else {

                        res.status(401).json({resp: wrong});
                    }
                });
            });
        }
        else if (kal == "enrollment-date-inquiry") {
          console.log("uytuytuy")
            mongo.connect(mongoURL, function () {
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('enroll');
                console.log(req.body);
                var aaj_kal =
                coll.findOne({}, function (err, user) {
                    if (user) {
                        console.log(user);
                        console.log(user.enrollmentInfo);
                        console.log(JSON.stringify(user));
                        res.status(201).send({resp: user.enrollmentInfo});
                    } else {

                        res.status(401).json({resp: wrong});
                    }
                });
            });
        }
        else {
            res.status(201).send({resp: "Please reenter!"});
        }
}
    });

    request.on('error', function (error) {
        //  console.log(error);
    });

    request.end();
    console.log(req.body.question);

});

app.post('/getQueries',function(req,res){


                  res.status(201).send({arr:[10,100,200,150,44,20,36,70]});


//  res.status(201).send({arr:[20,123,434,123,53,34,12,564,23,43,234]});
})


// error handlers

module.exports = app;
