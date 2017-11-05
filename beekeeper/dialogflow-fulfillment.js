'use strict';

const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library
var rp = require('request-promise');
const googleAssistantRequest = 'google'; // Constant to identify Google Assistant requests

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  // An action is a string used to identify what needs to be done in fulfillment
  let action = request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters

  // Parameters are any entites that Dialogflow has extracted from the request.
  const parameters = request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters
  console.log(parameters);
  // Contexts are objects used to track and store conversation state
  const inputContexts = request.body.result.contexts; // https://dialogflow.com/docs/contexts

  // Get the request source (Google Assistant, Slack, API, etc) and initialize DialogflowApp
  const requestSource = (request.body.originalRequest) ? request.body.originalRequest.source : undefined;
  const app = new DialogflowApp({request: request, response: response});

/*
parameter: patterns
Title: patterns.type + "Pattern"
Subtitle: patterns.data.length "events found"

Monday: 178
Wednesday: 213
Thursday: 200
for day in data output data[i].day + ":" + data[i].bg"

{
    type: "High",
    data: [ {
        "day": "Monday",
        bg: 178
    }]
}
*/

  // Create handlers for Dialogflow actions as well as a 'default' handler
  const actionHandlers = {
    // The default welcome intent has been matched, welcome the user (https://dialogflow.com/docs/events#default_welcome_intent)
    'input.welcome': () => {
      // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
      if (requestSource === googleAssistantRequest) {
        sendGoogleResponse('Hello, Welcome to my Dialogflow agent!'); // Send simple response to user
      } else {
        sendResponse('Hello, Welcome to my Dialogflow agent!'); // Send simple response to user
      }
    },
    'input.readyToBolus': () => {
        sendPatternCard();

    },
    // The default fallback intent has been matched, try to recover (https://dialogflow.com/docs/intents#fallback_intents)
    'input.unknown': () => {
      // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
      if (requestSource === googleAssistantRequest) {
        sendGoogleResponse('I\'m having trouble, can you try that again?'); // Send simple response to user
      } else {
        sendResponse('I\'m having trouble, can you try that again?'); // Send simple response to user
      }
    },
    // Default handler for unknown or undefined actions
    'default': () => {
        console.log('in default handler');
      // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
      var options = {
            method: 'POST',
            uri: 'https://beekeeper-t1d.herokuapp.com/api/add/treatment',
            formData: {
                bg: parameters.bloodsugar,
                dose: parameters.insulin,
                meal: parameters.meal,
                carbs: parameters.carbs
            },
            headers: {
                 'content-type': 'application/x-www-form-urlencoded'  // Is set automatically
            }
        };

       /* rp(options).catch(function (err) {
                console.log(err);
            });*/
      console.log("Request source is",requestSource);
      if (requestSource === googleAssistantRequest) {
        let responseToUser = {
          //googleRichResponse: googleRichResponse, // Optional, uncomment to enable
          //googleOutputContexts: ['weather', 2, { ['city']: 'rome' }], // Optional, uncomment to enable
          speech: 'This message is from Dialogflow\'s Cloud Functions for Firebase editor!', // spoken response
          displayText: 'This is from Dialogflow\'s Cloud Functions for Firebase editor! :-)', // displayed response
          googleRichResponse: true
        };
        // responseToUser = "Got it!"; //just send text back
        //sendGoogleResponse(responseToUser);
        sendInfoPatternCard(); //Shows informational pattern card after data entry
      } else {
        let responseToUser = {
          //richResponses: richResponses, // Optional, uncomment to enable
          //outputContexts: [{'name': 'weather', 'lifespan': 2, 'parameters': {'city': 'Rome'}}], // Optional, uncomment to enable
          speech: 'This message is from Dialogflow\'s Cloud Functions for Firebase editor!', // spoken response
          displayText: 'This is from Dialogflow\'s Cloud Functions for Firebase editor! :-)' // displayed response
        };
        sendResponse(responseToUser);
      }
    }
  };

  // If undefined or unknown action use the default handler
  if (!actionHandlers[action]) {
    action = 'default';
  }

  // Run the proper handler function to handle the request from Dialogflow
  actionHandlers[action]();

  // Function to send correctly formatted Google Assistant responses to Dialogflow which are then sent to the user
  function sendGoogleResponse (responseToUser) {
    if (typeof responseToUser === 'string') {
      app.ask(responseToUser); // Google Assistant response
    } else {
      // If speech or displayText is defined use it to respond
      let googleResponse = app.buildRichResponse().addSimpleResponse({
        speech: responseToUser.speech || responseToUser.displayText,
        displayText: responseToUser.displayText || responseToUser.speech
      });

      // Optional: Overwrite previous response with rich response
      if (responseToUser.googleRichResponse) {
        console.log("rich response");
        googleResponse = /*responseToUser.*/buildCardResponse('Subtitle', 'TITLE',
        'Hello World!', 'Simple Message Text', 'Simple Message');
        //googleResponse = googleRichResponse;
      }

      // Optional: add contexts (https://dialogflow.com/docs/contexts)
      if (responseToUser.googleOutputContexts) {
        app.setContext(...responseToUser.googleOutputContexts);
      }

      app.ask(googleResponse); // Send response to Dialogflow and Google Assistant
    }
  }

  function sendPatternCard () {

      // If speech or displayText is defined use it to respond
      let googleResponse = actionablePatternsResponse;


      app.ask(googleResponse); // Send response to Dialogflow and Google Assistant

  }

  function sendInfoPatternCard () {

      // If speech or displayText is defined use it to respond
      let googleResponse = informationalPatternsResponse;


      app.ask(googleResponse); // Send response to Dialogflow and Google Assistant

  }

/*{
    type: "High",
    data: [ {
        "day": "Monday",
        bg: 178
    }]
}
*/
function prepareResponse(pattern) {
    console.log("in prepareResponse");
    console.log(pattern);
    var formattedData;
    var d;
    //for (d in pattern.data) {
    //    formattedData = formattedData + d;
    //}
    //return buildCardResponse(pattern.data.length + " instances of pattern", pattern.type + ' pattern',
    //formattedData, "I found this " + pattern.type + " pattern.", "I found this " + pattern.type + " pattern.");
}

function buildCardResponse (subtitle, title, text, srText, srSpeech) {
    var card = app.buildBasicCard(text).setSubtitle(subtitle).setTitle(title);
    return app.buildRichResponse().addBasicCard(card).addSimpleResponse({ speech: srSpeech, displayText: srText });
}

  // Function to send correctly formatted responses to Dialogflow which are then sent to the user
  function sendResponse (responseToUser) {
    // if the response is a string send it as a response to the user
    if (typeof responseToUser === 'string') {
      let responseJson = {};
      responseJson.speech = responseToUser; // spoken response
      responseJson.displayText = responseToUser; // displayed response
      response.json(responseJson); // Send response to Dialogflow
    } else {
      // If the response to the user includes rich responses or contexts send them to Dialogflow
      let responseJson = {};

      // If speech or displayText is defined, use it to respond (if one isn't defined use the other's value)
      responseJson.speech = responseToUser.speech || responseToUser.displayText;
      responseJson.displayText = responseToUser.displayText || responseToUser.speech;

      // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
      responseJson.data = responseToUser.richResponses;

      // Optional: add contexts (https://dialogflow.com/docs/contexts)
      responseJson.contextOut = responseToUser.outputContexts;

      response.json(responseJson); // Send response to Dialogflow
    }
  }
});

// Construct rich response for Google Assistant
const app = new DialogflowApp();
const googleRichResponse = app.buildRichResponse()
  .addSimpleResponse('This is the first simple response for Google Assistant')
  .addSuggestions(
    ['Suggestion Chip', 'Another Suggestion Chip'])
    // Create a basic card and add it to the rich response
  .addBasicCard(app.buildBasicCard(`This is a basic card.  Text in a
 basic card can include "quotes" and most other unicode characters
 including emoji 📱.  Basic cards also support some markdown
 formatting like *emphasis* or _italics_, **strong** or __bold__,
 and ***bold itallic*** or ___strong emphasis___ as well as other things
 like line  \nbreaks`) // Note the two spaces before '\n' required for a
                        // line break to be rendered in the card
    .setSubtitle('This is a subtitle')
    .setTitle('Title: this is a title')
    .addButton('This is a button', 'https://assistant.google.com/')
    .setImage('https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
      'Image alternate text'))
  .addSimpleResponse({ speech: 'This is another simple response',
    displayText: 'This is the another simple response 💁' });


function getTodMeal() {
    let currentHour = new Date().getHours();
    let mealString;
    const stem = "Record meal data for ";
    if (currentHour > 22 || currentHour < 5) {
        mealString = "snack";
    } else if (currentHour >= 5 || currentHour <= 11) {
        mealString = "breakfast";
    } else if (currentHour > 11 || currentHour < 15) {
        mealString = "lunch";
    } else if (currentHour >= 15 || currentHour <= 17) {
        mealString = "snack";
    } else if (currentHour > 17 || currentHour <= 22) {
        mealString = "dinner";
    }
    console.log()
    return [stem + mealString]
}

const actionablePatternsResponse = app.buildRichResponse()
  .addSimpleResponse({ speech: 'Sure, but first, I found a high pattern.  When you decide how much insulin to take for this meal, keep in mind that your blood sugar has been high at this time of day recently.',
    displayText: 'When you decide how much insulin to take for this meal, keep in mind that your blood sugar has been high at this time of day recently.' })
  .addSimpleResponse('Say, "Record my meal data" to continue.')
  .addSuggestions(["Record my meal data"])
    // Create a basic card and add it to the rich response
  .addBasicCard(app.buildBasicCard(`
  **Tuesday** 190  \n
  **Wednesday** 175  \n
  **Friday** 188`) // Note the two spaces before '\n' required for a
                        // line break to be rendered in the card
    .setSubtitle('3 readings in the last 5 days were high at this time')
    .setTitle('High Pattern'))
  .addSimpleResponse({ speech: 'Say, "Save data," to continue ',
    displayText: 'Say, "Save data," when you\'re ready to continue' });

const informationalPatternsResponse = app.buildRichResponse()
  .addSimpleResponse("Got it.")
  .addSimpleResponse("By the way, your overall average blood sugar has gone down from 135 to 128 in the last 2 weeks.  Good job!")
    // Create a basic card and add it to the rich response
  .addBasicCard(app.buildBasicCard(`
  **Oct 8, 2017 - Oct 21, 2017** 128  \n
  **Oct 22, 2017 - Nov 4, 2017** 135  \n`)
    .setSubtitle('Decrease in 2 week average blood sugar')
    .setTitle("You're improving!"));


// Rich responses for both Slack and Facebook
const richResponses = {
  'slack': {
    'text': 'This is a text response for Slack.',
    'attachments': [
      {
        'title': 'Title: this is a title',
        'title_link': 'https://assistant.google.com/',
        'text': 'This is an attachment.  Text in attachments can include \'quotes\' and most other unicode characters including emoji 📱.  Attachments also upport line\nbreaks.',
        'image_url': 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
        'fallback': 'This is a fallback.'
      }
    ]
  },
  'facebook': {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'generic',
        'elements': [
          {
            'title': 'Title: this is a title',
            'image_url': 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
            'subtitle': 'This is a subtitle',
            'default_action': {
              'type': 'web_url',
              'url': 'https://assistant.google.com/'
            },
            'buttons': [
              {
                'type': 'web_url',
                'url': 'https://assistant.google.com/',
                'title': 'This is a button'
              }
            ]
          }
        ]
      }
    }
  }
};
