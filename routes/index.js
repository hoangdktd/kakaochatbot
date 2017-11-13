/**
 * Controllers (route handlers).
 */
// const homeController = require('../controllers/home');
const userController = require('../controllers/user/user');
const apiController = require('../controllers/dialogflow/apiai');
const kakaoPlusController = require('../controllers/kakao/kakaoChat');

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the User API!',
    }));

    /**
   * API examples routes.
   */
    app.get('/keyboard', kakaoPlusController.getKeyBoard);
    app.post('/message', kakaoPlusController.postMessage);
    app.get('/api/user', userController.list);
};