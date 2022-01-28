/**
 * Created by Administrator on 9/12/2015.
 */
Ext.define('RequestManager', {
    constructor: function (config) {
    },
    sendAJAXRequest: function (url, requestName, requestData,etc, successMethod, failureMethod,context) {
        Ext.MessageBox.show({
            msg: 'Please wait...',
            progressText: 'Working...',
            width:300,
            wait:true,
            waitConfig: {interval:200}
        });
        //Ext.Ajax.setTimeout(60000);
        Ext.Ajax.request({
            url: url,
            method: 'GET',
            waitMsg : 'Please Wait...',
            params: {'REQUEST_NAME':requestName,'PARAMS': requestData},
            success: function (result) {
                Ext.MessageBox.hide();
                successMethod(requestData,result,etc,context);
            },
            onRequestFailure: function(err){
                Ext.MessageBox.hide();
                failureMethod(err);
            }
        });
    }
});