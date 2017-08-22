require('dotenv-extended').load();
var restify = require('restify');
var builder = require('botbuilder');
var locationDialog = require('botbuilder-location');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '73a78204-a51b-481e-af2a-cb72c1c00de3',
    appPassword: 'ACjQzDRONDUOTcdYRcTZruv'
});
const greeting = require('./app/recognizer/greeting');
const commands = require('./app/recognizer/commands');
const smiles = require('./app/recognizer/smiles');

const dialog = {
    welcome: require('./app/dialogs/welcome')
 };

var intents = new builder.IntentDialog({
    recognizers: [
        commands,
        greeting //,
   //     new builder.LuisRecognizer('7cdc5efae0824f2ba3f02acde270fe98')
    ],
    intentThreshold: 0.2,
    recognizeOrder: builder.RecognizeOrder.series
});
intents.matches('Greetings2','/welcome');
//intents.matches('Reset', '/reset');
//intents.matches('Delete', '/delete');
intents.matches('Smile', '/smileBack');
//intents.matches('Greetings2','greetings');
intents.onDefault('/confused');

const bot = new builder.UniversalBot(connector, {
    persistConversationData: true
});
bot.library(locationDialog.createLibrary('MS0ktNotOqNdjaTgJZ2o~apVPV9Uqycm9RPuKfUnYbw~AjCxFU1c4GJT_fIAnAEmCyIv-n5P-2g_Diy1lfbUPx99QwQJKpVcufwH_XLPJyYA'));


bot.dialog('/', intents);
dialog.welcome(bot);
bot.dialog('/confused', [
    function (session, args, next) {
        // ToDo: need to offer an option to say "help"
        if (session.message.text.trim()) {
            session.endDialog('Извините,но я потерял нить нашего разговора ((');
        } else {
            session.endDialog();
        }        
    }
]);

bot.on('routing', smiles.smileBack.bind(smiles));


// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
//var bot = new builder.UniversalBot(connector, function (session) {
  //  session.send("You said: %s", session.message.text);
//});
