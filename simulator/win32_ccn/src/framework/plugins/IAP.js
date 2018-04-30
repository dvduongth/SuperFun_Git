/**
 * Created by bachbv on 1/20/2016.
 */

var iapProductList = ["pack_1", "pack_2", "pack_3", "pack_4", "pack_5", "pack_6"];
var iapSuffix = "";

fr.iosiap = {
    pluginIAP: null,
    serverMode: false,
    
    init:function(){
        this.callback = null;
        if(plugin.PluginManager == null) return false;
        
        if(fr.iosiap.pluginIAP == null) {
            var pluginManager = plugin.PluginManager.getInstance();
            fr.iosiap.pluginIAP = pluginManager.loadPlugin("IOSIAP");
            fr.iosiap.pluginIAP.setListener(fr.iosiap);

            iapProductList = _.map(iapProductList, function(value){
                return value + iapSuffix;
            });
            
            //ZLog.debug("iosiap init success");
            fr.iosiap.requestProducts();
            fr.iosiap.setServerMode(true);
        }
        return true;
    },
    
    setServerMode: function(mode){
        this.serverMode = mode;
        this.pluginIAP.callFuncWithParam("setServerMode");
    },
    
    requestProducts: function(){
        this.pluginIAP.callFuncWithParam("requestProducts", plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, iapProductList.toString()));
    },
    
    finishTransactions: function(listTrans, isSuccess){
        if(isSuccess === undefined) isSuccess = true;
        //ZLog.debug("iosiap finishTransactions");
        
        if(listTrans){
           //ZLog.debug("length = %d", listTrans.length);
            
            var numOfGold = 0;
            var numOfVipPoint = 0;
            var pack = null;
            for(var i = 0; i < listTrans.length; ++i){
                if(listTrans[i].productId && listTrans[i].productId.length > 0){
                    //ZLog.debug("--> Transaction for product: %s - quantity: %d", listTrans[i].productId, listTrans[i].quantity);
                    if(this.pluginIAP){
                        this.pluginIAP.callFuncWithParam("finishTransaction",
                            plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, listTrans[i].productId));
                    }

                    //pack = resourceMgr.getConfigIAPPackByProductId(listTrans[i].productId);
                    if(pack){
                        //numOfGold += GameUtils.getTotalGoldByIAP(listTrans[i].productId) * listTrans[i].quantity;
                        //numOfVipPoint += pack.vPoint * listTrans[i].quantity;
                    }
                }
            }
            
            //if(isSuccess && numOfGold > 0){
            //    moduleMgr.getPlayerModule().addGold(numOfGold);
            //    moduleMgr.getPlayerModule().addVipPoint(numOfVipPoint);
            //}
        }
    },
    
    payForProduct: function(productId){
        if(this.pluginIAP){
            var paramMap = {};
            paramMap["productId"] = productId;
            this.pluginIAP.payForProduct(paramMap);
        }
    },
    
    onPayResult: function (ret, receipt, productInfo) {
        if(ret == plugin.ProtocolIAP.PayResultCode.PaySuccess){
            //ZLog.debug("iosiap onPayResult PaySuccess");
            
            // send receipt to game server
            if(receipt && receipt.length > 0){
                //moduleMgr.getPaymentModule().sendIAPIOS(receipt);
            }
            else{
               //ZLog.debug("iosiap onPayResult receipt is empty");
            }
        }
        else{
            //sceneMgr.hideGUIWaiting();

            if(ret == plugin.ProtocolIAP.PayResultCode.PayFail){
                //ZLog.debug("iosiap onPayResult PayFail");
            }
            else if(ret == plugin.ProtocolIAP.PayResultCode.PayCancel){
                //ZLog.debug("iosiap onPayResult PayCancel");
            }
            else if(ret == plugin.ProtocolIAP.PayResultCode.PayTimeOut){
                //ZLog.debug("iosiap onPayResult PayTimeOut");
            }
        }
    },
    
    onRequestProductsResult: function(ret, productInfo){
        if(ret == plugin.ProtocolIAP.RequestProductCode.RequestFail){
            //ZLog.debug("iosiap onRequestProductsResult fail");
        }
        else if(ret == plugin.ProtocolIAP.RequestProductCode.RequestSuccess){
            //ZLog.debug("iosiap onRequestProductsResult success");
        }
        else{
            //ZLog.debug("iosiap onRequestProductsResult code = %d", ret);
        }
    },
};

fr.androidiap = {
    pluginIAP: null,
    isPaying: false,

    init:function(){
        if(plugin.PluginManager == null) return false;

        if(fr.androidiap.pluginIAP == null) {
            var pluginManager = plugin.PluginManager.getInstance();
            fr.androidiap.pluginIAP = pluginManager.loadPlugin("IAPGooglePlay");

            iapProductList = _.map(iapProductList, function(value){
                return value + iapSuffix;
            });

            fr.androidiap.pluginIAP.setListener(fr.androidiap);
            fr.androidiap.configDeveloperInfo();
        }
        return true;
    },

    configDeveloperInfo: function(){
        //ZLog.debug("android iap configDeveloperInfo");
        this.pluginIAP.configDeveloperInfo({
            itemPacks: iapProductList.join("|"),
            GooglePlayAppKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAl1Im87ZcNLm3JGIgDUjF/gtwhEjDYaYLhf4RsyAcRjeXfocj1KMJDVPvUAwv9CA9DDdReDntS7NI3X+uABXD/33+4yB9t8PHwHccIAeF31JZTToUPUD9bYbqh0sJSm/9IiTGP4XKIkGUwYj77bAh2Rw+hsxZ5HA0iqi4kV6zseXwE6P4XdTY9DhQvJ6nea+LQa0U8rlA8Mml7s9SvSB6PAqzwmpkzHEdiyx/Y0gd/ZpaIX+I/rr12rQVS+ullA64vYBVkSpMpTdGLPGKI18PM3XMxxwpVDV0glYvHko1FGYdhLM+Xz/IvOwkYDIH39oce9xUyk4gwmZbYT9rFeCZawIDAQAB"
        });
    },

    refresh: function(){
        //sceneMgr.hideGUIWaiting();
        this.isPaying = false;
        this.pluginIAP.callFuncWithParam("refreshPurchases", null);
    },

    payForProduct: function(productId){
        //productId = "android.test.purchased";

        if(this.pluginIAP && !this.isPaying){
            this.isPaying = true;
            setTimeout(this.refresh.bind(this), 3000);

            var paramMap = {};
            paramMap["productId"] = productId;
            this.pluginIAP.payForProduct(paramMap);
        }
    },

    consumePurchase: function(purchaseData, signature){
        if(purchaseData){
            if(purchaseData.productId === undefined) {
                //ZLog.debug("iap android consumePurchase: productId is undefined");
                return;
            }

            // add gold
            //var configIAP = resourceMgr.getConfigIAPPackByProductId(purchaseData.productId);
            //var gold = GameUtils.getTotalGoldByIAP(purchaseData.productId);
            //moduleMgr.getPlayerModule().addGold(gold);

            // add invest point
            //moduleMgr.getPlayerModule().addVipPoint(configIAP.vPoint);

            // send to finish purchase
            var data = {
                purchaseData: purchaseData,
                signature: signature
            };
            if(this.pluginIAP){
                this.pluginIAP.callFuncWithParam("consumePurchase",
                    plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, JSON.stringify(data)));
            }

            //configIAP = null;
        }
    },

    consumeTest: function(){
        if(this.pluginIAP){
            //ZLog.debug("consumeTest");
            this.pluginIAP.callFuncWithParam("consumeTest", null);
        }
    },

    onPayResult: function (ret, msg) {
        if(ret == -1){
            //ZLog.debug("onPayResult refresh iap purchases");
            return;
        }

        //ZLog.debug("onPayResult: %d - %s", ret, msg);

        if(ret == plugin.ProtocolIAP.PayResultCode.PaySuccess){
            //ZLog.debug("androidiap onPayResult PaySuccess");

            // send receipt to game server
            if(msg && msg.length > 0){
                this.isPaying = false;
                try{
                    //moduleMgr.getPaymentModule().sendIAPAndroid(JSON.parse(msg));
                }
                catch(err){
                    //ZLog.debug("JSON parse error: " + msg);
                }
            }
            else{
                //sceneMgr.hideGUIWaiting();
                //ZLog.debug("androidiap onPayResult receipt is empty");
            }
        }
        else{
            //sceneMgr.hideGUIWaiting();

            if(ret == plugin.ProtocolIAP.PayResultCode.PayFail){
                //ZLog.debug("androidiap onPayResult PayFail");
            }
            else if(ret == plugin.ProtocolIAP.PayResultCode.PayCancel){
                //ZLog.debug("androidiap onPayResult PayCancel");
            }
            else if(ret == plugin.ProtocolIAP.PayResultCode.PayTimeOut){
                //ZLog.debug("androidiap onPayResult PayTimeOut");
            }
        }
    },
};