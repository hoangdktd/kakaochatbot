const firebase = require('firebase-admin');
// firebase.initializeApp(functions.config().firebase);
const ref = firebase.app().database().ref();
const foodMenuRef = ref.child('tb_food_menu');

module.exports = {
    pushFoodMenu(req, res) {
        return new Promise(function (resolve, reject) {
            // foodMenuRef.push(user)
            const obj = {};
            obj[req.food_id] = req;
            foodMenuRef.set(obj)
            .then(resolve, reject);
        });
    },

    updateFoodMenu (req, res) {
        const foodMenu = {
            food_id: req.food_id,
            food_name: req.food_name,
            image: req.image,
            price: req.price,
            remain: req.remain,
            description: req.description
        };
        const hopperRef = foodMenuRef.child(foodMenu.food_id);
        hopperRef.update(foodMenu);
    },

    getFoodMenu( req, res ){
        const food_id = req.food_id;
        return new Promise(function(resolve, reject) {
            const hopperRef = foodMenuRef.child(food_id);
            if (hopperRef){
                hopperRef.on("value", function(snapshot) {
                    resolve(snapshot.val());
                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                    resolve({
                        food_id: " ",
                        food_name: "",
                        image: "",
                        price: "",
                        remain: "",
                        description: ""
                    });
                });
                // resolve(hopperRef);
            } else {
                const requestParam = {
                    food_id: " ",
                    food_name: "",
                    image: "",
                    price: "",
                    remain: "",
                    description: ""
                }
                foodMenuRef.set(requestParam)
                .then(tb_user => {
                    resolve(requestParam);
                })
                .catch(error => {
                    reject(error);
                });
            }
        });
    },

    getListFoodMenu( req, res ){
        return new Promise(function(resolve, reject) {
            const hopperRef = foodMenuRef;
            if (hopperRef){
                hopperRef.on("value", function(snapshot) {
                    resolve(snapshot.val());
                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                    resolve({
                        food_id: " ",
                        food_name: "",
                        image: "",
                        price: "",
                        remain: "",
                        description: ""
                    });
                });
                // resolve(hopperRef);
            } else {
                const requestParam = {
                    food_id: " ",
                    food_name: "",
                    image: "",
                    price: "",
                    remain: "",
                    description: ""
                }
                foodMenuRef.set(requestParam)
                .then(tb_user => {
                    resolve(requestParam);
                })
                .catch(error => {
                    reject(error);
                });
            }
        });
    }
};
