const vectorly = require('../src/index')(process.env.VECTORLY_API_KEY);


vectorly.updates({}, function (err, updates) {

    if(err) return console.log(err);

    console.log(updates);

});


