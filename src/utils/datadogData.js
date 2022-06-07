const UAParser = require('ua-parser-js')
const {swat} = require('../const/constants')

const datadogDataInsight = function(body, userAgent){
    const ua = new UAParser(userAgent)
    if(ua.getDevice().type == "mobile") {
        swat.ua_mobile = true;
    }
    swat.client.name = body.client
    swat.bvProduct.name = body.bvProduct
    swat.bvProduct.version =  body.bvProductVersion,
    swat.cl = body.cl,
    swat.productId = body.productId,
    swat.deploymentZone = body.deploymentZone,
    swat.source = body.source,
    swat.host = body.host,
    swat.loadId = body.loadId,
    swat.detail1 = '' + body.detail1,
    swat.detail2 = '' + body.detail2,
    swat.name = body.name,
    swat.type = body.type,
    swat.ua_browser = ua.getBrowser().name,
    swat.ua_browserVersion = ua.getBrowser().version,
    swat.ua_platform = ua.getOS().name,
    swat.ua_platformVersion = ua.getOS().version,
    swat.environment = body.environment,
    swat.locale = body.locale,
    swat.siteId = body.siteId,
    swat.elapsedMs = body.elapsedMs,
    swat.dc = body.dc,
    swat.displaySegment = body.displaySegment,
    swat.context = body.context,
    swat.categoryId = body.categoryId,
    swat.subjectType = body.subjectType,
    swat.subjectId = body.subjectId,
    swat.contentType = body.contentType,
    swat.brand = body.brand,
    swat.pages = body.pages,
    swat.numReviews = body.numReviews,
    swat.numRatingsOnlyReviews = body.numRatingsOnlyReviews,
    swat.percentageRecommend = body.percentageRecommend,
    swat.avgRating = body.avgRating,
    swat.ref = body.ref,
    swat.href = body.href,
    swat.res = body.res,
    swat.cookies = body.cookies,
    swat.lang = body.lang,
    swat.charset = body.charset,
    swat.geo = body.geo,
    swat.initialContent = body.initialContent,
    swat.sourceVersion = body.sourceVersion,
    swat.magpieJsVersion = body.magpieJsVersion,
    swat.sourceproductid = body.sourceproductid,
    swat.epochSecond = Math.floor(new Date().getTime()/1000.0)

    var data ={
        swat
    }
    return data;
}
const datadogDataerror = function(body,userAgent){
    const ua = new UAParser(userAgent)
    if(ua.getDevice().type == "mobile") {
        ua_mobile = true;
    }
    const  swat = {
            logger: body.logger,
            bvProduct: 
            {
                app: body.extra.app,
                event: body.extra.event,
            },
            platform: body.platform,
            release:body.release,
            log :{
                level:body.level,
            },
            exception:body.exception,
            sdk:{
                name:body.sdk.name,
                version:body.sdk.version
            },
            environment:body.environment,
            client:{
            name:body.tags.client,
            bvLoaderVersion:body.tags.bv_loader_release,
            loadId: body.tags.load_id,
            deploymentZone:body.tags.deployment_zone,
            dataEnvironment:body.tags.data_environment,
            locale:body.tags.locale,
            },
            browser:{
                name:body.contexts.browser.name,
                version:body.contexts.browser.version
             },
            ua_browser:ua.getBrowser().name,
            ua_platform: ua.getOS().name,
            ua_mobile : false ,
       }
 
    return { swat  };
}

module.exports = {datadogDataInsight, datadogDataerror}
