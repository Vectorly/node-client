const vectorly = require('../src/index')(process.env.VECTORLY_API_KEY);

// This doesn't work right now
vectorly.download('60c2412a-d8bf-47c6-b56e-af4b2bac2944', function (err, result) {

    if(err) {
        console.log("An error ocurred while downloading the file");
        return console.log(err);
    }


    console.log("File sucessfully downloaded");
    console.log(result);


});