const apiController = require('../dialogflow/apiai');
const userController = require('../user/user');
const userFirebaseController = require('../user/firebaseUser');
const uuid = require('uuid/v4');

/**
 * GET /getKeyBoard
 * kakao API.
 */
exports.getKeyBoard = (req, res, next) => {
    const dataSend = {
        type: "text"
    }
    return res.json(dataSend);
};

/**
 * POST /getKeyBoard
 * kakao API.
 */
exports.postMessage = (req, res, next) => {
    const content = req.body.content;
    const textRes = apiController.sentTextRequest({
        content: content,
        sessionId: req.body.user_key
    }).then(result => {
        let dataSend = {
            message: {
                text: result.result.fulfillment.speech
            }
        }
        // if(result.result.metadata.intentId == 'e5c9a581-61c7-4ab5-be09-3670fb30945b'){
        //     userController.update({
        //         user_id: result.sessionId,
        //         address: result.result.parameters.address,
        //         email: result.result.parameters.email,
        //         user_name: result.result.parameters.user_name
        //     })    
        // }
        // if(result.result.metadata.intentId == '21712d0f-d4ca-4de4-84f9-35c618b63017'){
        //     let v_text = result.result.fulfillment.speech;
        //     const user = userController.getUser(req.body).then(resultUser => {
        //         let v_userName = '';
        //         if(resultUser != undefined && resultUser.user_name && resultUser.user_name != 'user_name_guest'){
        //             v_userName = resultUser.user_name;
        //         }
        //         console.log(v_userName);
        //         console.log(v_text);
        //         v_text.replace('user_name_guest', v_userName);
        //         console.log('------------ v_text -------------');
        //         console.log(v_userName);
        //         console.log(v_text);
        //         dataSend = {
        //             message: {
        //                 text: v_text.replace('user_name_guest', v_userName)
        //             }
        //         }
        //         return res.json(dataSend);
        //     }).catch(error => {
        //         console.log('---------------error ---------------------');
        //         console.log(error);
        //         return res.json(dataSend);
        //     });
        // } else {
        //     return res.json(dataSend);
        // }

        if(result.result.metadata.intentId == 'e5c9a581-61c7-4ab5-be09-3670fb30945b'){
            userFirebaseController.updateUser({
                user_id: result.sessionId,
                address: result.result.parameters.address,
                email: result.result.parameters.email,
                user_name: result.result.parameters.user_name
            })    
        }
        if(result.result.metadata.intentId == '21712d0f-d4ca-4de4-84f9-35c618b63017'){
            let v_text = result.result.fulfillment.speech;
            const user = userFirebaseController.getUser(req.body).then(resultUser => {
                let v_userName = '';
                console.log('------------ start check name -------------');
                console.log(resultUser);
                if(resultUser != undefined && resultUser.user_name && resultUser.user_name != 'user_name_guest'){
                    v_userName = resultUser.user_name;
                }
                console.log(v_userName);
                console.log(v_text);
                v_text.replace('user_name_guest', v_userName);
                console.log('------------ v_text -------------');
                console.log(v_userName);
                console.log(v_text);
                dataSend = {
                    message: {
                        text: v_text.replace('user_name_guest', v_userName)
                    }
                }
                return res.json(dataSend);
            }).catch(error => {
                console.log('---------------error ---------------------');
                console.log(error);
                return res.json(dataSend);
            });
        } else {
            return res.json(dataSend);
        }

    }).catch(error => {
        console.log('------------ call api.ai return error-------------');
        console.log(error);
        const dataSend = {
            message: {
                text: 'Something error, please try again'
            }
        }
        return res.json(dataSend);
    });
};