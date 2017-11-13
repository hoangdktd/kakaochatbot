'use strict';
const apiai = require("apiai");
const dotenv = require('dotenv');
const userFirebaseController = require('../user/firebaseUser');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

const app = apiai(process.env.API_AI_KEY);

const options = {
    sessionId: '<UNIQE SESSION ID>'
};

/**
 * apiai sent text request
 */

exports.sentTextRequest = (req, res) => {
    // const requestText = app.textRequest(req.content, {
    //     sessionId: req.sessionId
    // });
    // requestText.on('response', function(response) {
    //     const dataSend = {
    //         message: {
    //             text: response.result.fulfillment.speech
    //         }
    //     }
    //     return res.json(dataSend);
    // });
    const param = {};
    if(req.sessionId){
        param.sessionId = req.sessionId;
    }
    
    return new Promise(function(resolve, reject) {
        const requestText = app.textRequest(req.content, param);
        requestText.on('response', function(response) {
            console.log(response);
            resolve(response);
        });
        requestText.on('error', function(error) {
            return reject(error);
        });
        requestText.end();
    });
};