


module.exports = function (api_key) {

    if (!api_key && (typeof api_key !== 'string')) throw new Error("Invalid API Key");

    return (function(){

        return {
            upload: require('./upload')(api_key),
            secure: require('./auth')(api_key),
            download: require('./download')(api_key),
            list: require('./list')(api_key),
            search: require('./search')(api_key)
        };

    })();



};



