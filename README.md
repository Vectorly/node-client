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

    vectorly.list(function (err, videos) {
    
        if(err) return console.log("An error ocurred while  listing videos");
    
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


## Security

To authorize an individual user to watch a specific video, you can create temporary, unique signed URLs, that will enable the video to only be viewed for a short amount of time.

    let signed_url = vectorly.secure(video_id).signed_url;
    
    res.send(`
    
       <iframe src="${signed_url}" width="800" height="450" frameborder="0" allowfullscreen  />
   
    `);


   
   