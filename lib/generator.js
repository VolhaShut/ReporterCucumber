'use strict';

const fs = require('fs');
const path = require('path');
const _=require('lodash');
var ReporterHTML=require('./html_reporter');
var ReporterXLSx=require('./xlsx-reporter');
var Parser=require('./parser');

module.exports.run = (config) => {
    let resultArray;
    let data = require(path.resolve(config.input));
    let outputPath=path.resolve(config.output);

    let parser=new Parser(data);
    resultArray=parser.getDescriptionTests();

    let reporter=new ReporterHTML(
        outputPath,
        data,
        parser.totalTests,
        parser.passedTests,
        parser.failedTests);

    reporter.writeScreens(resultArray,outputPath+"/screens/");
    reporter.initOutputFile(resultArray);

    let reporterX=new ReporterXLSx(resultArray,outputPath);
    reporterX.initOutputFile(parser.totalTests,parser.passedTests,parser.failedTests);


};