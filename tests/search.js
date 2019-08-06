

const vectorly = require('../src/index')(process.env.VECTORLY_API_KEY);


let search_term = 'nvp';

vectorly.search(search_term, function (err, result) {

    if(err) {
        console.log(`An error ocurred while searching for videos that match ${search_term}`);
        return console.log(err);
    }


    console.log(`Got videos that match '${search_term}'`);
    console.log(result);


});