const vectorly = require('../src/index')(process.env.VECTORLY_API_KEY);


vectorly.list(function (err, videos) {

    if(err) {
        console.log("An error ocurred while  listing videos");
        return console.log(err);
    }


    let random_video = videos[Math.floor(Math.random()*videos.length)];


    vectorly.download(random_video.id, {}, function (err, dest) {

        if(err) {
            console.log("An error ocurred while downloading the file");
            return console.log(err);
        }


        console.log("Successfully downloaded file " + dest);

    });


});


