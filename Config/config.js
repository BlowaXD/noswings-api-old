'use strict';
const sql = require('mssql');

const db_default = {
    user: 'root',
    password: 'root',
    server: '127.0.0.1',
    database: 'opennos'
};

module.exports = {
    default_server: 'NosWings',
    servers: {
        'Official': {
            public: false,
            tokenSecret: 'secret',
            db: new sql.ConnectionPool(db_default, err => console.log(`DB Connection error : ${err}`)),
            email_config: {
                host: '',
                port: 587,
                secure: false,
                auth: {
                    user: '',
                    pass: ''
                },
                tls: {
                    rejectUnauthorized: false
                }
            }
        },
        'NosWings': {
            public: true,
            tokenSecret: 'secret',
            db: new sql.ConnectionPool(db_default, err => console.log(`DB Connection error : ${err}`)),
            email_config: {
                host: '',
                port: 587,
                secure: false, // secure:true for port 465, secure:false for port 587
                auth: {
                    user: '',
                    pass: ''
                },
                tls: {
                    rejectUnauthorized: false
                }
            }
        }
    }
};
