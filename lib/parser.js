'use strict';
const fs = require('fs');
const _=require('lodash');
const path = require('path');

var Parser=function (data) {
    this.data=data;
    this.totalTests=0;
    this.passedTests=0;
    this.failedTests=0;

    this.getDescriptionTests=function () {
        let results=[];
        let total=0;
        let passed=0;
        let failed=0;
        let allTests=_.reject(_.flatten(_.map(_.flatten(_.map(this.data,'elements')),'steps')),{'keyword': 'Before '});
        _.forEach(allTests,function(value) {
            if (Array.isArray(value.embeddings)){
                results.push({  img: value.embeddings[0].data,
                    err_message:value.result.error_message ||''});
            }else{
                if('name' in value) {
                    results.push({
                        name: value.name,
                        result: value.result.status,
                        err_message: value.result.error_message || ''
                    });
                    total++;
                    value.result.status=='passed'?passed++:failed++;
                };
            }
        });
        this.totalTests=total;
        this.passedTests=passed;
        this.failedTests=failed;
        return results;
    };
}

module.exports=Parser;
