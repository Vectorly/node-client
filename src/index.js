
const argv = require('yargs').argv;
const program = require('commander');

module.exports = function (api_key) {

    if (!api_key && (typeof api_key !== 'string')) throw new Error("Invalid API Key");

    return (function(){

        return {
            upload: require('./upload')(api_key),
            secure: require('./auth')(api_key),
            download: require('./download')(api_key),
            list: require('./list')(api_key),
            sync: require('./sync')(api_key),
            search: require('./search')(api_key),
            local: require('./local')(api_key)
        };

    })();



};



program
    .version('0.1.0')
    .arguments('<cmd>')
    .action(function (cmd) {


        let api_key = argv['api-key'] || process.env.VECTORLY_API_KEY;
        let local_folder = argv['local-folder'] || process.env.VECTORLY_LOCAL_FOLDER;


        if(!api_key) return console.log("You need to specify the API Key, either as an argument --api-key <your api key> or as an environmental variable VECTORLY_API_KEY");
        if(!local_folder) return console.log("You need to specify local folder, either as an argument --local-folder <your api key> or as an environmental variable VECTORLY_LOCAL_FOLDER");


        if(cmd === "sync") {

            require('./sync')(api_key)({folder: 'files'}, function (err) {

                if(err) return console.log(err);

                console.log("\nDone syncing!");

            });


        }

        else if(cmd === "server") {

            let port = argv['port'] || '8080';

            require('./local').server({port:port, folder: local_folder }, function (err) {

                console.log("Server is live!");

            });

        }
        else if(cmd === "help") return console.log("See https://github.com/Vectorly/node-client for documentation");
        else return console.log("Not a valid command. See https://github.com/Vectorly/node-client for documentation");






    });

program.parse(process.argv);
