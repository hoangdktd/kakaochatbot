const firebase = require('firebase-admin');
// firebase.initializeApp(functions.config().firebase);
const ref = firebase.app().database().ref();
const usersRef = ref.child('users');

module.exports = {
    pushUser(req, res) {
        return new Promise(function (resolve, reject) {
            // usersRef.push(user)
            const obj = {};
            obj[req.user_id] = req;
            usersRef.set(obj)
            .then(resolve, reject);
        });
    },

    updateUser (req, res) {
        const user = {
            user_id: req.user_id
        };
        if (req.address && req.address !== null && req.address !== '' && req.address !== undefined) { 
            user['address'] = req.address;
        }
        if (req.email && req.email !== null && req.email !== '' && req.email !== undefined) { 
            user['email'] = req.email;
        }
        if (req.user_name && req.user_name !== null && req.user_name !== '' && req.user_name !== undefined) { 
            user['user_name'] = req.user_name;
        }
        const hopperRef = usersRef.child(user.user_id);
        hopperRef.update(user);
    },

    getUser( req, res ){
        const user_id = req.user_key;
        return new Promise(function(resolve, reject) {
            const hopperRef = usersRef.child(user_id);
            console.log('get user');
            console.log(hopperRef);
            if (hopperRef){
                console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa');
                hopperRef.on("value", function(snapshot) {
                    console.log(snapshot.val());
                    resolve(snapshot.val());
                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                    resolve({
                        user_id: " ",
                        user_name: " "
                    });
                });
                // resolve(hopperRef);
            } else {
                const requestParam = {
                    user_id: user_id,
                    user_name: "user_name_guest"
                }
                usersRef.set(requestParam)
                .then(tb_user => {
                    resolve(requestParam);
                })
                .catch(error => {
                    reject(error);
                });
            }
        });
    },

    getUserOld( req, res ){
        const user_id = req.user_key;
        return new Promise(function(resolve, reject) {
            const hopperRef = usersRef.child(user_id);
            console.log('get user');
            console.log(hopperRef);
            if (hopperRef){
                console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa');
                resolve(hopperRef);
            } else {
                const requestParam = {
                    user_id: user_id,
                    user_name: "user_name_guest"
                }
                usersRef.set(requestParam)
                .then(tb_user => {
                    resolve(tb_user);
                })
                .catch(error => {
                    reject(error);
                });
            }
        });
    },
};
