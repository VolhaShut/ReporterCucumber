'use strict';
const fs = require('fs');
const _=require('lodash');
const path = require('path');

var Reporter=function (appDir,data,total,passed,failed) {
    this.appDir=appDir;
    this.data=data;
    this.tempHTMLFile='../Awesome-reporter/bootstrap/template.html';
    const totalTests=total;
    const passedTests=passed;
    const failedTests=failed;

	this.directoryExists=function(path) {
        try {
            return fs.statSync(path).isDirectory();
        }
        catch (err) {
            return false;
        }
    };

    this.ensureDirectoryExistence=function(filePath) {
        let dirname = path.dirname(filePath+"0.png");
        if (this.directoryExists(dirname)) {
            return true;
        }
        this.ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
    };

    this.writeScreens=function(resultArray,pathDir) {
        let imgName=0;
        this.ensureDirectoryExistence(pathDir);
        _.forEach(resultArray,function (value) {
            if('img' in value) {
                fs.writeFileSync(pathDir + imgName + '.png', new Buffer(value.img, 'base64'));
                imgName++;
            }
        });
    };

    this.formatOutput=function (resultArray) {
        let result=[];
        let imgName=0;
        result.push('<div class="navbar navbar-default navbar-fixed-top">' +
            '<div class="container"><div class="navbar-header">' +

                    '<a class="navbar-brand">Protractor results for: ' + (new Date()).toLocaleString() + '</a>' +
                        '<a class="navbar-brand">AppDir:'+this.appDir+'</a>' +
            '</div></div></div>');
        result.push('<div class="container"><div id="banner" class="page-header"><div class="row"><div class="col-md-3">' +
                        '<ul class="list-group clear-list m-t">');
        result.push('' +
                            '<li class="list-group-item">' +
                                '<span class="label"></span>'+
                                'Total tests:' +
                                '<span class="pull-right"> '+totalTests+'</span>' +
                            '</li>');
        result.push('' +
                            '<li class="list-group-item">'+
                                '<span class="label label-success"><span class="glyphicon glyphicon-ok"></span></span>' +
                                'Passed tests:'+
                                '<span class="pull-right label-success"> '+passedTests+'</span>' +
                            '</li>');
        result.push('' +
                            '<li class="list-group-item">' +
                                '<span class="label label-danger"><span class="glyphicon glyphicon-remove"></span></span>' +
                                'Failed tests:' +
                                '<span class="pull-right label-danger"> '+failedTests+'</span>' +
                            '</li>' +
                        '</ul>' +
            '       </div>' +
                    '</div></div>');
        result.push('<div class="row"><div class="col-lg-12"><table class="table table-striped table-hover">' +
                    '<thead>' +
                        '<tr>' +
                            '<th>#</th>' +
                            '<th>Step name</th>' +
                            '<th>Status</th>' +
                            '</tr>' +
                    '</thead>');
        let count=1;

        _.forEach(resultArray,function (test) {

            if('img' in test) {
                result.push('<tr><td  colspan="4">' +
                        '<a class="btn btn-primary" role="button" data-toggle="collapse" href="#collapseExample'+imgName+'" ' +
                        'aria-expanded="false" aria-controls="collapseExample'+imgName+'">Image </a> ' +
                        '<div class="collapse" id="collapseExample'+imgName+'" aria-expanded="false">' +

                                '<img src="./screens/' + imgName + '.png" width="960" height="540" class="img-rounded">' +

                        '</div></td></tr>');
                imgName++;
            } else {
                    result.push('<tr><td>'+count+'</td>');
                    result.push('<td>'+test.name+' </td> ');
                    if(test.result=="passed"){
                        result.push('<td><span class="label label-success"><span class="glyphicon glyphicon-ok"></span></span> '+test.result+'</td>');
                    } else {
                        result.push('<td><span class="label label-danger"><span class="glyphicon glyphicon-remove"></span></span>'+test.result+'</td>');
                    }


                    result.push('<td>'+test.err_message.substr(0,45)+'</td></tr>');
                    count++;
            }

        });
        result.push('</table></div></div>');
        result.push('<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>'+
            '<script src="../../node_modules/awesome-report-generator/bootstrap/js/bootstrap.min.js"></script>');
        result.push('</body></html>');
        return result.join(' ');

    };

    function readTemplateHTML(tempFile){
        return fs.readFileSync(tempFile,'utf8');
    };

    this.initOutputFile=function (resultArray) {
        let htmlTemplate=readTemplateHTML(this.tempHTMLFile);
        fs.writeFileSync(this.appDir+'/html_reporter.html',htmlTemplate+this.formatOutput(resultArray));
    };

};

module.exports=Reporter;