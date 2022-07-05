"use strict"

import events from "events";

/**
 * connect to MYSQL Database..
 * 
 * this is a long live connection and not a connection pool
 */
class mop{

    static DB = '';
    static DB_INFO = '';

    static async register (options) {
        const {
            DATABASE_INFO: DATABASE_INFO = {
                host: 'localhost',
                user: '',
                password: '',
                database: ''
            }
        } = options;
        
        const {WAIT_TIME: WAIT_TIME = 5000} = options;

        const {MODULE: MODULE} = options;

        if(MODULE === undefined){
            MODULE = await import("mysql2")
        }

        // test connection 
        const connection = MODULE.createConnection(DATABASE_INFO);

        const emitter = new events.EventEmitter();
        // store test connection
        this.DB = connection;
        this.DB_INFO = emitter;

        const CONNECT = async function () {
            try {
                // new connection
                const new_connection = await new Promise(async (resolve, reject) => {
    
                    if(connection.state){
                        if (connection.state === "disconnected") {
        
                            const connection = MODULE.createConnection(DATABASE_INFO);
        
                            connection.connect(function (error) {
                                if (error) {
                                    const code = error.code;
                                    const message = error.message;
                                    emitter.emit("reconnect_error", code, message)
                                    setTimeout(CONNECT, WAIT_TIME);
                                } else {
                                    resolve(connection);
                                }
        
                            });
                        } else {
                            reject('already connected');
                        }
                    }
                    else{
                        const connection = MODULE.createConnection(DATABASE_INFO);

                        connection.connect(function (error){
                            if (error) {
                                const code = error.code;
                                const message = error.message;
                                emitter.emit("reconnect_error", code, message)
                                setTimeout(CONNECT, WAIT_TIME);
                            } else {
                                resolve(connection);
                            }
                        })
                    }
    
                });
    
                mop.DB = new_connection;
    
                emitter.emit("connect", true)
    
                mop.DB.on('error', function (error) {
                    const code = error.code;
                    emitter.emit("disconnect", code)
                    mop.DB.destroy()
                    CONNECT();
                });
            } catch (e) {
                emitter.emit("connect", true)
                mop.DB.on('error', function (error) {
                    const code = error.code;
                    emitter.emit("disconnect", code);
                    mop.DB.destroy();
                    CONNECT();
                });
            }
        }
        CONNECT()
    }
}

export default mop;
