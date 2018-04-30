/**
 * Created by user on 25/9/2015.
 */

var HintDestination = ccui.Button.extend({

    animation : null,


    ctor:function(){
        this._super("res/game/mainBoard/empty_piece.png");

        var pieceColor = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(0).playerColor;
        this.animation = fr.AnimationMgr.createAnimationById(resAniId.eff_hint_path_destination,this);
        this.animation.setPosition(this.getContentSize().width/2, 60);
        this.animation.getAnimation().gotoAndPlay(GameUtil.getColorStringById(pieceColor));
        var rgbColor = GameUtil.getRGBColorById(pieceColor);
        this.animation.setBaseColor(rgbColor.r, rgbColor.g, rgbColor.b);
        this.animation.setScale(0.7);
        this.addChild(this.animation, 999);
    },
});