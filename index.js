'use strict';

const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library

const googleAssistantRequest = 'google'; // Constant to identify Google Assistant requests

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// [END import]


const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const errorHandler = require('errorhandler');
const passport = require('passport');

const kakaoPlusController = require('./controllers/kakao/kakaoChat');




exports.keyboard1 = functions.https.onRequest((req, res) => {
  const original = req.query.text;
  let answer = {
      "type":"text"
  };
  res.send(answer)
});




/*
exports.message = functions.https.onRequest((req,res) => {
  let user_key = decodeURIComponent(req.body.user_key); // user's key
  let type = decodeURIComponent(req.body.type); // message type
  let content = decodeURIComponent(req.body.content); // user's message
  console.log(user_key);
  console.log(type);
  console.log(content);
 
  let answer = {
    "message":{
      "text": "test from Firebase"
    }
  }
  res.send(answer);
  
});
*/





exports.message1 = functions.https.onRequest((req,res) => {
  let content = decodeURIComponent(req.body.content); // user's message
  const apiai = require('apiai');

  const app = apiai("88fd21a805ca409db041f26f78b756fb");
  let textMessage = "";

  const request = app.textRequest(content, {
      sessionId: '<unique session id>'
  });

  request.on('response', function(response) {
    textMessage = response.result.fulfillment.speech;

// into Korean
  // Imports the Google Cloud client library
  const Translate = require('@google-cloud/translate');

  // Creates a client
  const translate = new Translate();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  const text = textMessage;
  const target = 'ko';

  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.

  translate
    .translate(text, target)
    .then(results => {
      let translations = results[0];
      translations = Array.isArray(translations)
        ? translations
        : [translations];

      console.log('Translations:');
      translations.forEach((translation, i) => {
		  console.log(`${text[i]} => (${target}) ${translation}`);
        textMessage = `${translation}`
        let answer = {
          "message":{
            "text":  textMessage + ".. from Firebase test.."
          }
        }
        res.send(answer);
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
// into Korean
    

  });

  request.on('error', function(error) {
      textMessage = "error";
  });

  request.end();
});



exports.keyboard = functions.https.onRequest((req,res) => {
  kakaoPlusController.getKeyBoard(req,res);
});
exports.message = functions.https.onRequest((req,res) => {
  kakaoPlusController.postMessage(req,res);
});
exports.test = functions.https.onRequest((req,res) => {
  kakaoPlusController.testMessage(req,res);
});