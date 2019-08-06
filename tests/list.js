

const vectorly = require('../src/index')(process.env.VECTORLY_API_KEY);


vectorly.list(function (err, result) {

    if(err) {
        console.log("An error ocurred while  listing videos");
        return console.log(err);
    }


    console.log("Got videos");
    console.log(result);


});