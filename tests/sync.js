const vectorly = require('../src/index')(process.env.VECTORLY_API_KEY);


vectorly.sync({folder: 'files'}, function (err) {

    if(err) return console.log(err);

    console.log("\nDone syncing!");

});


