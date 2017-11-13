
'use strict';

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

function hashPassword(user) {
    if (user.changed('password')) {
        return bcrypt.hash(user.password, SALT_ROUNDS)
            .then((hashedPass) => { user.password = hashedPass; });
    }
}

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_name: { type: DataTypes.STRING, allowNull: false, unique: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        user_password: { type: DataTypes.STRING, allowNull: false },
    }, {
            hooks: {
                beforeCreate: hashPassword,
                beforeUpdate: hashPassword,
            },
        });

    User.prototype.isValidPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    }

    return User;
};


// const Sequelize = require('sequelize');
// const env       = process.env.NODE_ENV || 'development';
// const config    = require(__dirname + '/../config/config.json')[env];
// const db        = {};

// const v_sequelize = {};
// if (config.use_env_variable) {
//   v_sequelize = new Sequelize(process.env[config.use_env_variable]);
// } else {
//   v_sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// const User = v_sequelize.define('tb_user', {
//   user_name: {
//     type: Sequelize.STRING
//   },
//   email: {
//     type: Sequelize.STRING
//   }
// });
