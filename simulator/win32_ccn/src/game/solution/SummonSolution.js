/**
 * Created by GSN on 1/8/2016.
 */

var SummonSolution = BaseSolution.extend({
    motionStreak:null,

    ctor : function(piece, params){
        this._super(piece, PieceAction.SUMMON, params);
    },

    generateHintPath : function(){
        return null;
    },

    performPieceAction : function(){
        this._super();
        gv.matchMng.mainBoard.forceSummon(this.target);
    },

    show:function(){
        this.needHintStone = false;
        this._super();
        this.motionStreak = new cc.MotionStreak(0.5, 1, 10, cc.color(50, 50, 50), "res/particle/test.png");
        var piecePos = this.target.pieceDisplay.getPosition();
        this.motionStreak.setPosition(piecePos);
        var playerIndex = this.target.playerIndex;
        var standPos = gv.matchMng.playerManager.getStandPosOfPlayer(playerIndex);
        var summonIndex = gv.matchMng.mapper.getSummonSlotForStandPos(standPos);
        var summonPos = gv.matchMng.mapper.getTileForSlot(summonIndex).getStandingPositionOnTile();
        this.motionStreak.runAction(cc.sequence(
                                            cc.jumpTo(0.2, summonPos, 40, 1),
                                            cc.jumpTo(0.2, piecePos, 40, 1)
                                        ).repeatForever());

        this.motionStreak.setBlendFunc(gl.ONE, gl.ONE);

        var colorAction = cc.sequence(
            cc.tintTo(0.2, 255, 0, 0),
            cc.tintTo(0.2, 0, 255, 0),
            cc.tintTo(0.2, 0, 0, 255),
            cc.tintTo(0.2, 0, 255, 255),
            cc.tintTo(0.2, 255, 255, 0),
            cc.tintTo(0.2, 255, 0, 255),
            cc.tintTo(0.2, 255, 255, 255)
        ).repeatForever();

        this.motionStreak.runAction(colorAction);

        var mainboardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        mainboardGui.addChild(this.motionStreak, this.target.pieceDisplay.getLocalZOrder()- 1);

        var tileObj = gv.matchMng.mapper.getTileForSlot(this.actionParam);
        tileObj.setEnableHintStone(true, this.onSolutionSelected.bind(this));
    },

    hide: function () {
        this._super();
        if(this.motionStreak)
        {
            this.motionStreak.removeFromParent();
            this.motionStreak = null;
        }
        var tileObj = gv.matchMng.mapper.getTileForSlot(this.actionParam);
        tileObj.setEnableHintStone(false);
    }

});