/**
 * Created by GSN on 5/16/2016.
 */

//skill giam no
var EarthquakeSkill = BaseActiveSkill.extend({

    ctor : function(){
        this._super();
        this.skillId = PieceSkill.EARTHQUAKE;
    },

    skillCharge : function(){
        this._super();

        var castSkillEff = fr.AnimationMgr.createAnimationById(resAniId.skill_phinuocdai, this);
        castSkillEff.getAnimation().gotoAndPlay("run", 0, -1, 1);
        castSkillEff.setPosition(this.target.pieceDisplay.getPosition());
        castSkillEff.setCompleteListener(function(){
            castSkillEff.removeFromParent();
        });
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(castSkillEff, MainBoardZOrder.EFFECT);
    },

    beginAttack: function(){
        this.attackOnCurrentTile();
        this.attackOnDesTile();
    },

    attackOnCurrentTile: function(){
        var pieceActions = [];
        pieceActions.push(cc.delayTime(1.4));
        for(var i=0; i< this.curEarthquakeTileList.length; i++){
            var currTile = this.curEarthquakeTileList[i];
            pieceActions.push(cc.spawn(cc.callFunc(this.onSingleTileAttacked.bind(this, currTile))));
        }
        this.target.pieceDisplay.runAction(cc.sequence(pieceActions));
    },

    attackOnDesTile: function(){
        gv.matchMng.mainBoard.teleportMgr.tryTeleportPieceToSlot(this.target, this.desSlot, TeleType.TELE_BY_EARTH_QUAKE, function(){
            var pieceActions = [];
            pieceActions.push(cc.delayTime(0.4));
            for(var i=0; i< this.desEarthquakeTileList.length; i++){
                var currTile = this.desEarthquakeTileList[i];
                pieceActions.push(cc.callFunc(this.onSingleTileAttacked.bind(this, currTile)));
            }
            pieceActions.push(cc.delayTime(2.0));
            pieceActions.push(cc.callFunc(this.onSkillFinished.bind(this)));
            this.target.pieceDisplay.runAction(cc.sequence(pieceActions));
        }.bind(this));

        fr.Sound.playSoundEffect(resSound.skill_hyperjump);
    },

    //callback duoc goi khi tile truoc mat piece attack bat dau no
    //tile: tile chuan bi no
     onSingleTileAttacked : function(tile){
        cc.log("onSingleTileGetShot: "+tile.index);
        //play animation
        var skillEff = fr.AnimationMgr.createAnimationById(resAniId.skill_earthquake_step_2, this);
        skillEff.getAnimation().gotoAndPlay("run", 0, -1, 1);
        skillEff.setPosition(tile.getStandingPositionOnTile().x+5,  tile.getStandingPositionOnTile().y-5);
        skillEff.setCompleteListener(function(){
            skillEff.removeFromParent();
        });

        var guiMainboard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        guiMainboard.addChild(skillEff, tile.getZOrderForPiece()-1);

        ShakeEffect.addShakeEffectToNode(0.5, guiMainboard, 35,guiMainboard.guiMainBoardPosition);
        fr.Sound.playSoundEffect(resSound.skill_earthquake);

        var targetPiece = gv.matchMng.mainBoard.boardData.getPieceAtSlot(tile.index);
        if(targetPiece!=null && targetPiece.playerIndex!=gv.matchMng.getCurrTurnPlayerIndex()){
            this.target.kickedList.push(targetPiece);
            ChangeGoldMgr.getInstance().addListKickInList(this.target, targetPiece);
            targetPiece.destroy();
        }
    },

    checkActiveAbility: function(piece){
        var diceResult =  gv.matchMng.diceManager.lastDiceResult;
        if (piece.isCanMovingOnBoard() && (diceResult.score1+diceResult.score2)%2==0) {
            var curSlot = piece.pieceDisplay.tileStanding.index;
            var desSlot = GameUtil.addSlot(curSlot, (diceResult.score1+diceResult.score2), piece.playerIndex);
            var mapper = gv.matchMng.mapper;
            var haveEnemyInStanding = false, haveEnemyInDes = false;

            var desTile = mapper.getTileForSlot(desSlot);
            if(desTile==null||desTile.tileUp){
                return false;
            }

            this.curEarthquakeTileList = [];
            this.desEarthquakeTileList = [];
            this.desSlot = desSlot;

            //kiem tra 2 vi tri truoc va sau tai o hien tai
            DebugUtil.log("EarthquakeSkill: currentSlot = " + curSlot + ", desSlot = " + desSlot);
            var forwardCurTile = mapper.getTileForSlot((curSlot+1) % NUMBER_SLOT_IN_BOARD);
            var backwardCurTile = mapper.getTileForSlot((curSlot-1+NUMBER_SLOT_IN_BOARD) % NUMBER_SLOT_IN_BOARD);
            if ((forwardCurTile.getPieceHolding()!=null && gv.matchMng.isEnemy(forwardCurTile.getPieceHolding().playerIndex,piece.playerIndex))
                || (backwardCurTile.getPieceHolding()!=null && gv.matchMng.isEnemy(backwardCurTile.getPieceHolding().playerIndex,piece.playerIndex))){
                haveEnemyInStanding = true;
            }
            this.curEarthquakeTileList.push(forwardCurTile);
            this.curEarthquakeTileList.push(backwardCurTile);


            //neu chinh xac o dich den co piece thi da con piece do, tuy nhien day ko phai dieu kien kich hoat skill
            var desTile = mapper.getTileForSlot(desSlot);
            var desPiece = gv.matchMng.mainBoard.boardData.getPieceAtSlot(desSlot);
            if ((desPiece!=null) && gv.matchMng.isEnemy(desPiece.playerIndex, piece.playerIndex)){
                this.desEarthquakeTileList.push(desTile);
            }

            //kiem tra 2 vi tri truoc va sau tai o dich den
            if (0<=desSlot && desSlot<=NUMBER_SLOT_IN_BOARD){//neu o cuoi cung van la o di chuyen, ko phai trong nha va len chuong
                var forwardDesTile = mapper.getTileForSlot((desSlot+1) % NUMBER_SLOT_IN_BOARD);
                var backwardDesTile = mapper.getTileForSlot((desSlot-1+NUMBER_SLOT_IN_BOARD) % NUMBER_SLOT_IN_BOARD);
                if ((forwardDesTile.getPieceHolding()!=null && gv.matchMng.isEnemy(forwardDesTile.getPieceHolding().playerIndex,piece.playerIndex))
                    || (backwardDesTile.getPieceHolding()!=null && gv.matchMng.isEnemy(backwardDesTile.getPieceHolding().playerIndex,piece.playerIndex))){
                    haveEnemyInDes = true;
                }
            }
            else{
                return false;
            }
            this.desEarthquakeTileList.push(forwardDesTile);
            this.desEarthquakeTileList.push(backwardDesTile);

            DebugUtil.log("EarthquakeSkill: haveEnemyInStanding="+haveEnemyInStanding + ", haveEnemyInDes="+haveEnemyInDes);
            if (haveEnemyInStanding || haveEnemyInDes)
                return true;
        }
        return false;
    },
});