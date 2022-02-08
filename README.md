# mop-js
create a long live connection between your application and mysql in a javascript server ( NODEJS ). this is not mysql pool.

this package helps you to manage auto reconnection.

you still have the complete features of mysql in nodejs except for mysql pool

## INSTALLATION
> npm i @bringittocode/mop-js

## FEATURES

* Auto reconnection if connection timeout or an error occured
* You still have all the method of [MYSQL](https://www.npmjs.com/package/mysql) except for pool.
* You have an event to listen on if connection failed or successful

## USAGE

### import the module
```js
import mop from "@bringittocode/mop-js";

//OR
const mop = require('@bringittocode/mop-js');
```

### Register the module
```js
mop.register({
    DATABASE_INFO: {
        host: "",
        user: "",
        password: "",
        database: "",
    },
    WAIT_TIME: 2000,
});
```

> DATABASE_INFO => your database detailes.

> WAIT_TIME => how many miliseconds to wait before reconnecting if there is any disconnection.. DEFAULT 5 seconds

After registering you can now import mysql instance in all of your application

what you have to do is to focus on your query as you would if no package is used

learn more => https://www.npmjs.com/package/mysql;

```js
    const query = "SELECT * FROM your_table where ?";
    mop.DB.query(query, ["user"], function (err, result) {
        try {
            if (err) throw err;
            //manage result
        }
        catch(err)
        {
            //manage error
        }
    });
```
> NOTE :: do not disconnect after you finish... your connection is meant to stay alive so you can query your database at anytime

## Event

```js
    // listen for connection and reconnection
    // status => boolean
    mop.DB_INFO.on("connect",(status)=>{
        console.log('database connected');
    });

    // listen for reconnection error
    // code => error code
    // message => error message
    mop.DB_INFO.on("reconnect_error", (code,message) => {
        console.log(code, message);
    });

    // listen for disconnection ...this can be for many reason
    mop.DB_INFO.on("disconnect", (code) => {
        console.log(code);
    });
```

That all you need.
We are finding who can add typescript to this package

feel free to pull request and contribute....

any issue feel free as well.