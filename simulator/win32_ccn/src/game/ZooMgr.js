var constant_ZooMgr = {
    MAX_TURN_IN_ZOO : 2
};
var ZooMgr = cc.Class.extend({

    ctor : function(){
        this.currentMulti = 1; // nghia la nguoi dau tien :P
        this.isActive = false; // co nghia la ngung hoat dong ^^
        var betLevel = gv.matchMng.gameStatusObject.betLevelID;
        this.gold = GameModeConfig.getInstance().getZooFee(betLevel);
        this.turn = 0;          // dem so turn ngua trong zoo
        this.piece = null;      // con ngua hien tai o trong zoo
        this.animZoo1 = null;
        this.animZoo2 = null;
    },

    getGoldPay:function(){
        return this.gold*this.currentMulti
    },

    addCurrentMulti:function(){
        //this.currentMulti++;
    },

    resetActive:function(){
        this.isActive = true;
    },

    horseGoZoo:function(piece){
        this.addCurrentMulti();
        this.resetActive();
        this.turn = 0;
        this.piece = piece;
        this.addEffectZoo(piece);
    },

    resetHorseGoZoo:function(){
        if(this.piece !=null){
            var slot = gv.matchMng.mapper.getTileForSlot(this.piece.currSlot);
            if(slot.type != TileType.TILE_JAIL){
                this.piece = null;
                this.isActive = false;
                this.turn = 0;
                if(this.animZoo){
                    this.animZoo.removeFromParent();
                    this.animZoo = null;
                }
            }
        }
    },

    removeAnimZoo:function(){
        if(this.animZoo1){
            this.animZoo1.removeFromParent();
            this.animZoo1 = null;
        }
        if(this.animZoo2){
            this.animZoo2.removeFromParent();
            this.animZoo2 = null;
        }
    },

    addEffectZoo:function(piece){
        this.removeAnimZoo();
        var slot = gv.matchMng.mapper.getTileForSlot(piece.currSlot);
        var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);

        if(!this.animZoo1){
            this.animZoo1 = fr.AnimationMgr.createAnimationById(resAniId.chuongthutren, this);
            this.animZoo1.getAnimation().gotoAndPlay("run", 0, -1, 1);
            this.animZoo1.setPosition(slot.getStandingPositionOnTile());
            guiMainBoard.addChild(this.animZoo1,slot.getZOrderForPiece());
        }
        if(!this.animZoo2){
            this.animZoo2  = fr.AnimationMgr.createAnimationById(resAniId.chuongthuduoi, this);
            this.animZoo2.getAnimation().gotoAndPlay("run", 0, -1, 1);
            this.animZoo2.setPosition(slot.getStandingPositionOnTile());
            guiMainBoard.addChild(this.animZoo2,slot.getZOrderForPiece()-1);
        }
    },

    resetByGold:function(){
        this.turn = 0;
        this.isActive = false;
        this.removeAnimZoo();
        var goldPay = this.gold*this.currentMulti;
        ChangeGoldMgr.getInstance().addChangeGoldElement(this.piece.playerIndex,-goldPay);
        this.piece = null;
    },

    addTurn:function(playerIndex){
        if(this.piece!=null){
            if(this.piece.playerIndex == playerIndex){
                if(this.isActive){
                    this.turn++;
                    cc.log("addTurn zoo" + this.turn);
                }
                if(this.turn>=constant_ZooMgr.MAX_TURN_IN_ZOO){
                    this.isActive = false;
                    this.piece = null;
                    this.turn = 0;
                    this.removeAnimZoo();
                }
            }
        }else{
            this.removeAnimZoo();
        }
    },

    reconnect:function(turn, currentMulti,isActive,piece){
        this.turn = turn;
        this.currentMulti = currentMulti;
        this.isActive = isActive;
        this.addEffectZoo(piece);
    }
});