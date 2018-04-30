/**
 * Created by GSN on 6/10/2015.
 */

var AvatarShape = {
    SQUARE: 0,
    CIRCLE: 1
};

fr.Avatar = cc.Node.extend({

    ctor: function (url, shape){
        this._super();

        this.defaultAvatar = null;
        this.clipper = null;

        this.setCascadeOpacityEnabled(true);
        this.initAvatar(url, shape);

        return true;
    },

    initAvatar: function(url, shape){
        shape = (shape !== undefined) ? shape : AvatarShape.SQUARE;

        this.defaultAvatar = new cc.Sprite("common/default_avatar.png");

        var stencil = new cc.DrawNode();
        var avatarSize = this.defaultAvatar.getContentSize();
        switch (shape){
            case AvatarShape.SQUARE:
                var rectangle = [cc.p(-avatarSize.width, -avatarSize.height),cc.p(avatarSize.width, -avatarSize.height),
                    cc.p(avatarSize.width, avatarSize.height), cc.p(-avatarSize.width, avatarSize.height)];
                stencil.drawPoly(rectangle, cc.WHITE);
                break;
            case AvatarShape.CIRCLE:
                stencil.drawSolidCircle(cc.p(0,0), avatarSize.width/2, 0, 32, cc.WHITE);
                break;
        }

        this.clipper = new cc.ClippingNode();
        this.clipper.setStencil(stencil);
        this.clipper.addChild(this.defaultAvatar);
        this.addChild(this.clipper);

        this.updateAvatar(url);
    },

    updateAvatar:function(url){
        //crash on runtime mode win32
        if(cc.sys.os == cc.sys.OS_WINDOWS)
        {
            //return;
        }

        var defaultAvatar = this.defaultAvatar;
        defaultAvatar.setTexture('common/default_avatar.png');

        if (url instanceof cc.Texture2D) {
            defaultAvatar.setTexture(url);
            return;
        }

        var url = url.replace("https", "http");

        if (url && url.length > 0) {
            var texture = cc.textureCache.getTextureForKey(url);

            if (texture) {
                defaultAvatar.setTexture(texture);
            }
            else {
                cc.textureCache.addImage(url, function (img) {
                    if (img instanceof cc.Texture2D) {
                        defaultAvatar.setTexture(img);
                    }
                    else {
                        console.log('Avatar::addImage was null');
                    }
                }, this);
            }
        }
        else {
            console.log('Avatar: invalid url: ' + url);
        }
    }
});