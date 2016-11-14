'use strict';
const fs = require('fs');
const _=require('lodash');
const path = require('path');
const xl=require('excel4node');

var Reporter=function (resultArray,outputDir) {
    const result=resultArray;
    const output=outputDir+'/xlsx-reporter.xlsx';
    var wb=new xl.Workbook();
    var ws = wb.addWorksheet('Sheet 1');
    var style = wb.createStyle({
        font: {
            color: '#6B0909',
            size: 14
        }});
    var styleFailed=wb.createStyle({
        font: {
            color: '#FE0000',
            size: 12
        }});
    var stylePassed=wb.createStyle({
        font: {
            color: '#159200',
            size: 12
        }});

    this.initOutputFile=function(total,passed,failed) {
        let i=9,
            j=1;
        ws.cell(1,2,1,7,true).string("Protractor results for: " + (new Date()).toLocaleString()).style(style);
        ws.cell(2,2,2,7,true).string('AppDir:'+ path.dirname(outputDir)).style(style);
        ws.cell(4,2,4,3,true).string('Total tests:').style(style);
        ws.cell(4,4).string(total.toString()).style(style);
        ws.cell(5,2,5,3,true).string('Passed tests:').style(style);
        ws.cell(5,4).string(passed.toString()).style(stylePassed);
        ws.cell(6,2,6,3,true).string('Failed tests:').style(style);
        ws.cell(6,4).string(failed.toString()).style(styleFailed);
        _.forEach(resultArray,function (test) {
            if(!('img' in test)) {
                if (test.result=='passed'){
                    ws.cell(i,1,i,5,true).string(test.name);
                    ws.cell(i,7).string(test.result).style(stylePassed);
                } else{
                    ws.cell(i,1,i,5,true).string(test.name);
                    ws.cell(i,7).string(test.result).style(styleFailed);
                    ws.cell(i,9,i,15,true).string(test.err_message.substr(0,70).replace(/\n/,"")).style(styleFailed);
                }
            }
            i++;
        });
        wb.write(output);
    }

};

module.exports=Reporter;