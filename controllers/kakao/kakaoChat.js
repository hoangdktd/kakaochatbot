const apiController = require('../dialogflow/apiai');
const userController = require('../user/user');
const userFirebaseController = require('../user/firebaseUser');
const foodMenuFirebaseController = require('../user/foodMenu');
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
    console.log(req.body);
    if (content === 'other address' ){
        const dataSend = {
            message: {
                text: 'Please give to us your address'
            }
        }
        return res.json(dataSend);
    } else {
        const textRes = apiController.sentTextRequest({
            content: content,
            sessionId: req.body.user_key
        }).then(result => {
            let dataSend = {
                message: {
                    text: result.result.fulfillment.speech
                }
            }
    
            if(result.result.metadata.intentId == 'e5c9a581-61c7-4ab5-be09-3670fb30945b'){
                console.log('update user address to database');
                console.log(result.result.parameters);
                userFirebaseController.updateUser({
                    user_id: result.sessionId,
                    address: result.result.parameters.address,
                    // email: result.result.parameters.email ? result.result.parameters.email : '',
                    // user_name: result.result.parameters.user_name ? result.result.parameters.user_name : ''
                })    
            }
            if(result.result.metadata.intentId == '5f6bd126-0137-40a5-8d90-d036e138215e'){
                console.log('update user name to database');
                console.log(result.result.parameters);
                userFirebaseController.updateUser({
                    user_id: result.sessionId,
                    user_name: result.result.parameters.user_name,
                    // email: result.result.parameters.email ? result.result.parameters.email : '',
                    // user_name: result.result.parameters.user_name ? result.result.parameters.user_name : ''
                })    
            }
            if(result.result.metadata.intentId == 'e5c9a581-61c7-4ab5-be09-3670fb30945b tesst'){
                console.log('send current user name to api');
                console.log(result.result.parameters);
                const user = userFirebaseController.getUser(req.body).then(resultUser => {
                    let v_userName = '';
                    if(resultUser != undefined && resultUser.user_name && resultUser.user_name != 'user_name_guest'){
                        const textRes = apiController.sentTextRequest({
                            content: 'my name is ' + resultUser.user_name,
                            sessionId: req.body.user_key
                        }).then(result => {
                            console.log('result after sent current name');
                            let dataSend = {
                                message: {
                                    text: result.result.fulfillment.speech
                                }
                            }
                            return res.json(dataSend);
                        });
                        console.log('------------------------------------');
                    } else {
                        return res.json(dataSend);
                    }
                }).catch(error => {
                    return res.json(dataSend);
                });
            }
            if(result.result.metadata.intentId == '21712d0f-d4ca-4de4-84f9-35c618b63017'){
                let v_text = result.result.fulfillment.speech;
                const user = userFirebaseController.getUser(req.body).then(resultUser => {
                    let v_userName = '';
                    if(resultUser != undefined && resultUser.user_name && resultUser.user_name != 'user_name_guest'){
                        v_userName = resultUser.user_name;
                    }
                    v_text.replace('user_name_guest', v_userName);
                    dataSend = {
                        message: {
                            text: v_text.replace('user_name_guest', v_userName)
                        }
                    }
                    return res.json(dataSend);
                }).catch(error => {
                    return res.json(dataSend);
                });
            } else if (result.result.metadata.intentId == '2f9dda5b-54dd-48be-93a9-8f749b1ae7fd' || result.result.metadata.intentId == '4182743f-9498-4cd5-8256-19f8a5bff787') {
                const user = foodMenuFirebaseController.getListFoodMenu(req.body).then(resultFoodMenu => {
                    const resultArrFoodName = [];
                    if(resultFoodMenu != undefined){
                        const resultArrFood = Object.keys(resultFoodMenu).map(function(key) {
                            return resultFoodMenu[key];
                        });
                        for (let index = 0; index < resultArrFood.length; index++) {
                            const element = resultArrFood[index];
                            resultArrFoodName.push(element.food_name);
                        }
                    }
                    dataSend = {
                        message: {
                            text : result.result.fulfillment.speech,
                            photo : {
                                url: "https://firebasestorage.googleapis.com/v0/b/store-assistant-chatbot.appspot.com/o/Hangover%20Stew%20(Haejangguk%20%ED%95%B4%EC%9E%A5%EA%B5%AD).jpg?alt=media&token=5f6583d4-6f1d-4998-92dc-74946742870b",
                                width: 320,
                                height: 240
                            },
                            message_button: {
                              label: "Our website",
                              url: "https://migrationology.com/south-korean-food-dishes/"
                            }
                        },
                        keyboard: {
                            type: "buttons",
                            buttons: resultArrFoodName
                        }
                    };
                    return res.json(dataSend);
                }).catch(error => {
                    return res.json(dataSend);
                });
            }  else if (result.result.metadata.intentId == '68bf6d6d-16ab-4457-a948-f6e134a54d81') { // 1.4 food service 
                let v_text = result.result.fulfillment.speech;
                const user = userFirebaseController.getUser(req.body).then(resultUser => {
                    let v_userName = '';
                    if(resultUser != undefined && resultUser.address && resultUser.address != ''){
                        dataSend = {
                            message: {
                                text : result.result.fulfillment.speech,
                            },
                            keyboard: {
                                type: "buttons",
                                buttons: [
                                    resultUser.address[0],
                                    "other address"
                                ]
                            }
                        };
                    } else {
                        
                    }
                    return res.json(dataSend);
                }).catch(error => {
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
                    text: 'Something error, please try again (system error)'
                }
            }
            return res.json(dataSend);
        });
    }
    
};


exports.testMessage = (req, res, next) => {
    const content = req.body.content;
    console.log(req.body);
    const user = foodMenuFirebaseController.getListFoodMenu(req.body).then(resultFoodMenu => {
        if(resultFoodMenu != undefined){
            console.log('=====================');
            console.log(resultFoodMenu);
            const resultArr = Object.keys(resultFoodMenu).map(function(key) {
                return resultFoodMenu[key].food_name;
              });
            console.log(resultArr);
        }
        console.log('++++++++++++');
        dataSend = {
            message: {
                text : result.result.fulfillment.speech,
                photo : {
                    url: "https://photo.src",
                    width: 640,
                    height: 480
                },
                message_button: {
                  label: "주유 쿠폰받기",
                  url: "https://coupon/url"
                }
              },
              keyboard: {
                type: "buttons",
                buttons: [
                  "처음으로",
                  "다시 등록하기",
                  "취소하기"
                ]
              }
        }
        return res.json(dataSend);
    }).catch(error => {
        return res.json(dataSend);
    });
};