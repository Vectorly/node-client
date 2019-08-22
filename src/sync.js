const async = require('async');

const filesize = require('filesize');

const request  = require('request');

const fs = require('fs-extra');

const auth =  require('./auth');

module.exports = function (api_key) {

    return function sync(options, callback, onprogress) {


        let folder = process.env.VECTORLY_LOCAL_FOLDER || options.folder || 'vectorly_files';

        let video_list = [];
        let videos_to_download = [];
        let videos_skipped = [];
        let total_bytes_to_download = 0;
        let files_complete = 0;
        let total_files_to_download = 0;
        let bytes_downloaded = 0;
        let videos_by_id = {};


        async.series([getVideoList, getTotalToDownload, downloadAll, fetchingManifests], callback);


        function getVideoList(then) {

            if (!options.videos) {

                if(!options.silent) console.log("Fetching list of videos to sync ...");

                const list = require('./list')(api_key);

                list(function (err, videos) {

                    if (err) return then(err);

                    fs.writeJsonSync(`${folder}/videos.json`, videos);

                    video_list = videos.map(video => video.id);

                    videos.forEach(function (video) {
                       videos_by_id[video.id] = video;
                    });

                    return then();

                }, folder);

            } else {

                video_list = options.videos;

                return then();
            }


        }

        function getTotalToDownload(cb) {

            total_files_to_download = video_list.length;
            let total_meta_data_to_fetch = 0;

            if(!options.silent)  console.log(`There are ${total_files_to_download} videos to download`);
            if(!options.silent) console.log("Gathering download meta data...");


            async.eachLimit(video_list, 50, function (video_id, next) {

                let download = request({
                    headers: {
                        'x-api-key': api_key
                    },
                    uri: `https://api.vectorly.io/videos/download/${video_id}`,
                    method: 'HEAD'
                });

                download.on('response', function (data) {

                    let destination = `${folder}/${videos_by_id[video_id].name.split('.')[0] || video_id}.mp4`;


                    total_meta_data_to_fetch++;

                    if(video_list.length > 500){
                        if(!options.silent)  process.stdout.write(`Fetched meta data for ${total_meta_data_to_fetch} out for ${video_list.length} videos \r`);
                    }



                    if (fs.existsSync(destination)) {


                        let local_file = fs.statSync(destination);


                        let locally_modified = new Date(local_file.mtime);
                        let server_modified = new Date(data.headers['last-modified']);


                        if(local_file.size  < Number(data.headers['content-length'] )){

                            videos_to_download.push(video_id);
                            total_bytes_to_download += Number(data.headers['content-length']);
                            return next();

                        } else if(locally_modified > server_modified){

                            videos_skipped.push(video_id);
                            files_complete+=1;
                            return next();

                        } else{
                           // console.log("Fetcing latest from server");
                            videos_to_download.push(video_id);
                            total_bytes_to_download += Number(data.headers['content-length']);
                            return next();
                        }




                    } else {
                        videos_to_download.push(video_id);
                        total_bytes_to_download += Number(data.headers['content-length']);
                        return next();
                    }





                });


                download.on('error', function (err) {

                    if(err.code === 'ENOTFOUND') return  next("Cannot sync right now, not connected to the internet");
                    else return next(err);

                });


            }, cb);

        }

        function fetchingManifests(cb) {

            if(!options.silent) console.log(`Updating meta data for ${video_list.length} videos`);

            let manifest_files_downloaded = 0;

            async.eachLimit(video_list, 20, function (video_id, next) {

                let destination = `${folder}/${video_id}.json`;

                let download = request({
                    headers: {
                        'x-api-key': api_key
                    },
                    uri: `https://api.vectorly.io/videos/metadata/${video_id}`,
                    method: 'GET'
                });


                let dest = fs.createWriteStream(destination);

                download.on('error', function (err) {

                    console.log("Error");
                    console.log(err);
                });


                download.on('end', function () {

                    manifest_files_downloaded++;

                    if(video_list.length > 500){
                        if(!options.silent) process.stdout.write(`Fetched meta data for ${manifest_files_downloaded} out for ${video_list.length} videos \r`);
                    }
                    next();

                });

                download.pipe(dest);


            }, cb);

        }

        function downloadAll(cb) {


            if(total_bytes_to_download === 0){

                if(!options.silent)  console.log(`Local directory is already up do date`);
                return cb();
            } else {

                if(!options.silent)  console.log(`${videos_skipped.length} videos already up to date`);
                if(!options.silent) console.log(`There are ${filesize(total_bytes_to_download)} bytes of video to download`);
            }


            async.eachLimit(videos_to_download, options.concurrency || 5, function (video_id, next) {

                let download = request({
                    headers: {
                        'x-api-key': api_key
                    },
                    uri: `https://api.vectorly.io/videos/download/${video_id}`,
                    method: 'GET'
                });


                let destination = `${folder}/${videos_by_id[video_id].name.split('.')[0] || video_id}.mp4`;

                let dest = fs.createWriteStream(destination);



                download.on('data', function (chunk) {
                    bytes_downloaded += chunk.length;

                    if(!options.silent){
                        process.stdout.write(`Downloading ${filesize(bytes_downloaded)}/${filesize(total_bytes_to_download)}  (${files_complete}/${total_files_to_download} complete) \r`);
                    }
                });


                download.on('end', function (res) {
                    files_complete +=1;
                    next();
                });

                download.pipe(dest);


            }, cb);

        }

    }


};



