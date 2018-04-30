/**
 * Created by user on 24/11/2015.
 */

var NumberSprite = cc.Node.extend({
    distanceConfig : [15, 5, 2],
    numberWidth : 0,
    numberHeight: 0,
    listSprite : [],
    style: -1,

    ctor: function(number, style){
        this._super();
        this.setCascadeOpacityEnabled(true);
        this.setStyle(style);
        this.listSprite = [];
        this.setNumber(number);
    },

    setStyle: function(style){
        this.style = style;
    },

    setNumber: function(number){
        if(number == undefined){
            cc.log("chet cmnr");
        }

        var str = StringUtil.normalizeNumber(number.toString());
        this.numberWidth = 0;
        this.numberHeight = 0;

        for (var i=0; i<str.length; i++){
            var eSprite;
            if (i<this.listSprite.length){
                eSprite = this.listSprite[i];
                eSprite.setVisible(true);
            }
            else{
                eSprite = cc.Sprite.create();
                this.addChild(eSprite);
                this.listSprite.push(eSprite);
            }
            eSprite.setTexture("number/style" + this.style + "/" + str[i] + ".png");
            eSprite.setPosition(this.numberWidth+eSprite.getContentSize().width/2, this.numberHeight);
            if (str[i] == "."){
                eSprite.setPositionY(-20);
            }
            this.numberWidth+=eSprite.getContentSize().width-this.distanceConfig[this.style-1];
        }

        for (var i=str.length; i<this.listSprite.length; i++){
            this.listSprite[i].setVisible(false);
        }

        for (var i=0; i<this.listSprite.length; i++){
            var eSprite = this.listSprite[i];
            eSprite.setPosition(eSprite.getPositionX()-this.numberWidth/2, eSprite.getPositionY());
        }
    },

});