# Vectorly Node Client

Vectorly's Node library enables provides a Node wrapper for the API, enabling you to

* Upload videos in bulk
* List current videos
* Get the embed code to playback video on your app or website
* Get the links to download your video


## Getting your API key

To use the library, you will need an API Key. 

    const vectorly = require('@vectorly-io/client')(process.env.VECTORLY_API_KEY);
        
You can get your API key in the "Settings page", which you can view by clicking on the user icon in the top-right hand corner. 

![APIkey](https://vectorly.io/docs/img/apikey.png) 



## Uploading


### Quickstart

    vectorly.upload('myfile.mp4', {}, function (err, result) {
    
        if(err)  return console.log(`An error ocurred while uploading the file: ${err}`);
           
        console.log(`File sucessfully uploaded. Vectorly upload id: ${result.upload_id}`);
    
    });
    
### Progress    
  
    vectorly.upload('myfile.mp4', {}, function (err, result) {
    
        // On complete
    
    }, function(progress){
    
        console.log(`Upload progress: ${progress.bytesUploaded / progress.bytesTotal * 100).toFixed(2)}`);
        
    });


## Listing files

You can list the files in your library

    vectorly.list(function (err, videos) {
    
        if(err) return console.log("An error ocurred while  listing videos");
    
        console.log("Got videos");
        console.log(videos);
    });

## Searching files
Or you can search videos by name

    vectorly.search('search term', function (err, videos) {
    
        if(err) return console.log("An error ocurred while  searching videos");
    
        console.log("Got videos");
        console.log(videos);
    });


    


## Downloading files

    let video_id = '123';
    
    let options = {
        silent: false,
        destination: 'myvideo.mp4'
    }; 
    
    vectorly.download(video_id, options, function (err) {
    
        if(err) return console.log("An error ocurred while  listing videos");
    
        console.log("Your video finished downloading");
    });


## Updating files


    vectorly.updates(options, function (err, updates) {

        if(err) return console.log("An error ocurred while listing videos");

            // updates.new_videos
            // updates.videos_to_update
            // updates.videos_up_to_date

    });


## Sync


    vectorly.sync(options, function (err) {

        if(err) return console.log("An error ocurred while syncing with the server");

    });





## Security

To authorize an individual user to watch a specific video, you can create temporary, unique signed URLs, that will enable the video to only be viewed for a short amount of time.

    let signed_url = vectorly.secure(video_id).signed_url;
    
    res.send(`
    
       <iframe src="${signed_url}" width="800" height="450" frameborder="0" allowfullscreen  />
   
    `);


 ## Offline playback
 
 You can also use the node client to backup your files locally (on a server) and serve video files offline.  To do that, you can install Vectorly as a command line tool on your server
 
       npm install -g @vectorly-io/client
 
 If it is installed properly, you can then use vectorly commands
 
 ### Sync
 You can create a local store of your content using the sync command
 
    vectorly sync --local-folder=<folder_to_save_videos> --api-key=<api-key>
    
  This will proceed to download all of your videos, and meta data offline
  
  
### Offline playback

You can also playback vectorly videos offline through the server. 

    vectorly server --local-folder=<folder_to_save_videos> --api-key=<api-key> --port 8080

That will spin up a local server available offline to playback your videos. You can then access your videos using a similar api to iframe embed


    <iframe src="http://localhost:8080/embed/video/#/<video-id>"  height="450"  height="450" frameborder="0" allowfullscreen >
    
And this will work entirely offline. If you update content on the server, you can just re-run the sync command and it will only update videos that have changed

