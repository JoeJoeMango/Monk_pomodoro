'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
  dialogflow,
  Permission,
} = require('actions-on-google');
// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');
// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

let pomCheck = 0;
let shortCheck = 0;
let longCheck = 0;

app.intent('Default Welcome Intent', (conv) => {
  // Asks the user's permission to know their name, for personalization.
  conv.ask(new Permission({
    context: 'Hi there, to get to know you better',
    permissions: 'NAME',
  }));
});

app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) =>{
  if (!permissionGranted){
    conv.ask(`ok, no worries. what do you want to set your pomodoro timer to?`);
  } else{
    conv.data.userName = conv.user.name.display;
    conv.ask(`thanks ${conv.data.userName}. what do you want to set your pomodoro timer to?`);
  }
});

app.intent('pomodoro.set', (conv, {pomDur}) => {
  let pom = {pomDur};

    if (conv.data.userName && pomCheck == 0){
  conv.ask(` ${conv.data.userName} your pomodoro timer has been set to ${pom.pomDur.amount} minutes. What would you like to set your short break to?`);
} else if (!conv.data.userName) {
  conv.ask(`Your pomodoro timer has been set to ${pom.pomDur.amount} minutes. What would you like to set your short break to?`);
} else {
  conv.ask(`your pomodoro timer has been set to ${pom.pomDur.amount} minutes.`);
}
pomCheck = pom.pomDur.amount;
});

app.intent('short.set', (conv, {shortDur}) => {
  let short = {shortDur};
  if (conv.data.userName){
  conv.ask(`${conv.data.userName} your short break has been set to ${short.shortDur.amount} minutes. What would you like to set your Long break to?`);
} else {
  conv.ask(`Your pomodoro timer has been set to ${short.shortDur.amount} minutes. What would you like to set your Long break to?`);
  }
});

app.intent('long.set', (conv, {longDur}) => {
  let long = {longDur};
  if (conv.data.userName){
  conv.ask(`${conv.data.userName} your long break has been set to ${long.longDur.amount} minutes.`);
} else {
  conv.ask(`Your pomodoro timer has been set to ${long.longDur.amount} minutes. What would you like to set your Long break to?`);
  }
});
//
// app.intent('long.set', (conv, {longDur}) => {
//   let long = {longDur};
//   conv.ask(`your long break has been set to ${long.longDur.amount}.`)
// });

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
