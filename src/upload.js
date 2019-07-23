const tus = require("tus-js-client");
const path = require('path');
const fs = require('fs');

module.exports = function (api_key) {

    return function upload(input, opts, callback, progress) {

        var file = fs.createReadStream(input);
        var size = fs.statSync(input).size;

        progress = progress || function () {
        };

        var options = {
            endpoint: "https://tus.vectorly.io/files/",
            uploadSize: size,
            metadata: {
                api_key: api_key,
                filename: path.basename(input),
                filetype: 'video/mp4'
            },
            onError: function (error) {
                callback(error);
            },
            onProgress: function (bytesUploaded, bytesTotal) {
                progress({
                    bytesUploaded: bytesUploaded,
                    bytesTotal: bytesTotal,
                    uploadProgress: (bytesUploaded / bytesTotal * 100).toFixed(2),

                });

            },
            onSuccess: function () {

                var upload_id = upload.url.split("+")[0];

                var return_object = {
                    upload_id: upload_id,
                    path: input
                };

                callback(null, return_object);
            }
        };

        var upload = new tus.Upload(file, options);
        upload.start();

    };


};

