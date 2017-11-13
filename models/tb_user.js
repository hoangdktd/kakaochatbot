'use strict';

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

function hashPassword(user) {
    if (user.changed('password')) {
        return bcrypt.hash(user.password, SALT_ROUNDS)
            .then((hashedPass) => { user.password = hashedPass; });
    }
}


const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// let v_sequelize = {};
// if (config.use_env_variable) {
//   v_sequelize = new Sequelize(process.env[config.use_env_variable]);
// } else {
//   v_sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// const v_sequelize = new Sequelize('postgres', 'postgres', 'hoangdktd123', {
//     host: '127.0.0.1',
//     dialect: 'postgres',
//     username: "postgres",
//     password: "hoangdktd123",
//     database: "postgres",
//     define: {
//         freezeTableName: true
//     },
//     pool: {
//         max: 5,
//         min: 0,
//         idle: 10000
//     },

//     // SQLite only
//     storage: 'path/to/database.sqlite'
// });

module.exports = (sequelize, DataTypes) => {
    const tb_user = sequelize.define('tb_user', {
        user_name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        address: {
            type: Sequelize.STRING
        },
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            field: 'id',
        },
        created_at: {
            type: DataTypes.DATE(3),
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
        },
        updated_at: {
            type: DataTypes.DATE(3),
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
        },
    }, {
            timestamps: true,
            tableName: 'tb_user',
            underscored: true,
        });
    return tb_user
}
