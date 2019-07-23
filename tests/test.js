

const vectorly = require('../src/index')(process.env.VECTORLY_API_KEY);


vectorly.upload('test.mp4', {}, function (err, result) {

    if(err) {
        console.log("An error ocurred while uploading the file");
        return console.log(err);
    }


    console.log("File sucessfully uploaded");
    console.log(result);


});