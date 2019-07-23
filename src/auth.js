const jwt = require('jwt-simple');



module.exports = function (api_key) {

    return function gen_signed_key(video_id, time_minutes) {

        time_minutes = time_minutes || 60;

        let payload =   {
            "video_id": video_id,
            "expiry": Date.now() + time_minutes*1000*60*time_minutes
        };

        const signed_token = jwt.encode(payload, api_key);


        return {
          signed_url:  `https://api.vectorly.io/embed/v1/video/${video_id}/token/${signed_token}`,
          token: signed_token
        };


    };


};

