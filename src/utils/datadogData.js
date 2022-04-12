const UAParser = require('ua-parser-js')
const logger = require('./logger')
var ua_mobile = false;

const datadogDataInsight = function(body, userAgent){       //Approach1
    const ua = new UAParser(userAgent)
    if(ua.getDevice().type == "mobile") {
        ua_mobile = true;
    }
    let data = {
        "swat.client.name": body.client,
        "swat.bvProduct": body.bvProduct,
        "swat.bvProduct.version": body.bvProductVersion,
        "swat.cl":body.cl,
        "swat.productId":body.productId,
        "swat.deploymentZone":body.deploymentZone,
        "swat.source":body.source,
        "swat.host":body.host,
        "swat.loadId":body.loadId,
        "swat.detail1":body.detail1,
        "swat.detail2":body.detail2,
        "swat.name":body.name,
        "swat.type":body.type,
        "swat.ua_browser": ua.getBrowser().name,
        "swat.ua_platform": ua.getOS().name,
        "swat.ua_mobile":ua_mobile,
        "epochSecond": Math.floor(new Date().getTime()/1000.0)
    }  
    return data;
}

const datadogDataError = function(body){
    let data = {
        "swat.client.name": body.tags.client,
        "swat.logger": body.logger,
        "swat.platform": body.platform,
        "swat.log.level": body.level,
        "swat.exception": body.exception,
        "swat.sdk.name": body.sdk.name,
        "swat.sdk.version": body.sdk.version,
        "swat.component.name": body.tags.component,
        "swat.component.release": "4.0.0",
        "swat.browser.name": body.browser.name,
        "swat.browser.version": body.browser.version,
    }
    return data;
}

//Approach 2
const datadogDataApp2 = function(url, userAgent){
    let params = (new URL(url)).searchParams;
    if(params.get('r_batch')){                      //if data is batched
        var batch = params.get('r_batch').replace(/,/g, "&").replace(/:/g, "=");//setting r_batch in query param format to make later processing easier
        params.set('r_batch',batch)
        var batchUrl = params.get('r_batch').match(/\(([^()]*)\)/g).map(function($0) { return $0.substring(1,$0.length-1) })//the event data lies in between (), using regex to extract each event data
        var length = batchUrl.length-1;
        while(length>=0){
            var batchQP = new URLSearchParams(batchUrl[length])
            var data = ddData(params,batchQP,userAgent)
            logger.info(data);
            length--;
        }
    } else{
        var data= ddData(params,false,userAgent)
        logger.info(data);
    }
}
//In-progress to optimise this function
const ddData = function(params, batchQP,userAgent){
    const ua = new UAParser(userAgent)
    if(ua.getDevice().type == "mobile") {
        ua_mobile = true;
    }
    let data = {
        "swat.client.name": params.get('client'),
        "swat.bvProduct": params.get('bvProduct'),
        "swat.bvProduct.version": params.get('bvProductVersion'),
        "swat.cl":params.get('cl'),
        "swat.productId":params.get('productId'),
        "swat.deploymentZone":params.get('deploymentZone'),
        "swat.source":params.get('source'),
        "swat.host":params.get('host'),
        "swat.loadId":params.get('loadId'),
        "swat.detail1":params.get('detail1'),
        "swat.detail2":params.get('detail2'),
        "swat.name":params.get('name'),
        "swat.type":params.get('type'),
        "swat.ua_browser": ua.getBrowser().name,
        "swat.ua_platform": ua.getOS().name,
        "swat.ua_mobile":ua_mobile,
        "epochSecond": Math.floor(new Date().getTime()/1000.0)
    }
    if(batchQP){
        data['swat.bvProduct']= batchQP.get('bvProduct');
        data['swat.bvProduct.version']= batchQP.get('bvProductVersion');
        data['swat.cl']= batchQP.get('cl');
        data['swat.deploymentZone']= batchQP.get('deploymentZone');
        data['swat.detail1']= batchQP.get('detail1');
        data['swat.detail2']= batchQP.get('detail2');
        data['swat.name']= batchQP.get('name');
        data['swat.type']= batchQP.get('type');
    }
    
    return data;
}

module.exports =  { datadogDataInsight, datadogDataError, datadogDataApp2 }