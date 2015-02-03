/**
 * Created by sam on 15-2-3.
 */

var request = require('superagent');

var crawlUrl;

var fetchUr = function(url, queryConfig, callback){
    if(!queryConfig || Object.prototype.toString.call(queryConfig) !== '[object Object]'){
        queryConfig = {};
    }

    request.get(url)
        .query(queryConfig)
        .end(function(err, res){
            if(err){
                return callback(err);
            }
            callback(err, res);
        })
};



crawlUrl = {
    fetch: fetchUr
};

module.exports = crawlUrl;
