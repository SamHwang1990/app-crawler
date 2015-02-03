/**
 * Created by sam on 15-2-3.
 * APP Crawler Start File
 */

var express = require('express');
var cheerio = require('cheerio');
var async = require('async');
var request = require('superagent');
var format = require('string-template');

var app = express();

var fetchUrl = function(url, callback){
    request.get('http://ce.sysu.edu.cn/hope/Experience/Index.aspx')
        .end(function(err, sres){
            if(err){
                callback(err, null);
            }
            var $ = cheerio.load(sres.text);
            var items = [];
            $('.main_box_section .hope_list li.hope_list_item').each(function (idx, element) {
                var $element = $(element);
                var $elementA = $(element).find('.hope_list_item_content');
                items.push({
                    title: $elementA.text().trim(),
                    href: $elementA.attr('href'),
                    date: $element.find('.hope_list_time').eq(0).text(),
                    viewers: $element.find('.hope_list_viewers').eq(0).text()
                });
            });

            callback(null, items);
        });
};

app.get('/', function(req, res, next){
    var urls = [];
    var urlBase = 'http://ce.sysu.edu.cn/hope/Experience/Index{page}.aspx';
    var i = 1;
    var urlsLength = 20;
    urls.push(format(urlBase,{
        page: ''
    }));
    for (++i; i <= urlsLength; i++){
        urls.push(format(urlBase, {
            page: '_' + i
        }))
    }

    async.mapLimit(urls, 5, function (url, callback) {
        console.log(Date.now());
        fetchUrl(url, callback);
    }, function (err, results) {
        console.log('final: ');
        console.log(results.length);
        res.send('done');
    });
});


// err handler
app.use(function (err, req, res, next) {
    return res.status(500).send(err.message);
});

app.listen(3000, function(){
   console.log('server listen on port 3000.');
});