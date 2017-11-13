const User = require('../../models').User;
const tb_user = require('../../models').tb_user;
const uuid = require('uuid/v4');

const jwt = require('jwt-simple');
const passport = require('passport');
const { compose } = require('compose-middleware');

const {
    JWT_TOKEN,
    TOKEN_EXPIRATION_TIME,
} = require('../../config/config.js');


module.exports = {
    login: compose([
        passport.authenticate('local'),
        (req, res) => {
            const token = jwt.encode({
                id: req.user.id,
                expirationDate: new Date(Date.now() + TOKEN_EXPIRATION_TIME),
            }, JWT_TOKEN);
            res.status(200).send({ token });
        },
    ]),

    getUser( req, res ){
        const user_id = req.user_key;

        // tb_user.findOne({ where: {user_id: user_id} }).then(user => {
        //     if (user) {
        //         return user;
        //     } else {
        //         const requestParam = {
        //             id: uuid(),
        //             user_id: user_id,
        //             user_name: "user_name_guest"
        //         }
        //         tb_user
        //         .create(requestParam)
        //         .then(tb_user => {
        //             return tb_user;
        //         })
        //         .catch(error => {
        //         });
        //     }
        // })
        
        return new Promise(function(resolve, reject) {
            tb_user.findOne({ where: {user_id: user_id} }).then(user => {
                if (user) {
                    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa');
                    resolve(user);
                } else {
                    const requestParam = {
                        id: uuid(),
                        user_id: user_id,
                        user_name: "user_name_guest"
                    }
                    tb_user
                    .create(requestParam)
                    .then(tb_user => {
                        resolve(tb_user);
                    })
                    .catch(error => {
                        reject(error);
                    });
                }
            })
        });
    },

    create(req, res) {
        const { user_name, email, user_id } = req;
        return tb_user
        .create({
            user_name: user_name,
            user_id: user_id
        })
        .then(tb_user => {
            console.log(tb_user);
        })
        .catch(error => {
          
        });
    },
    
    update(req, res) {
        tb_user.findOne({ where: {user_id: req.user_id} }).then(user => {
            if(user){
                user.updateAttributes({
                    user_name: req.user_name? req.user_name:user.user_name,
                    address: req.address? req.address:user.address,
                    email: req.email? req.email:user.email,
                });
            }
        });
    },
    
    
    list(req, res) {
    // User.findAll().then(users => {
    //     console.log(users)
    //     res.status(200).send(users)
    // })
    // return User
    //   .all()
    //   .then(tb_user => res.status(200).send(tb_user))
    //   .catch(error => res.status(400).send(error));
    
    tb_user.findAll().then(user => {
        console.log(user[0].get('user_name'));
        res.status(200).send(user)
    });


  },
};
