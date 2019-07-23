


module.exports = function (api_key) {

    if (!api_key && (typeof api_key !== 'string')) throw new Error("Invalid API Key");

    return (function(){

        return {
            upload: require('./upload')(api_key),
            secure: require('./auth')(api_key)
        };

    })();



};



