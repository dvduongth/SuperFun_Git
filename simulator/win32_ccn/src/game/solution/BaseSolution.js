/**
 * Created by GSN on 12/29/2015.
 */

var BaseSolution = cc.Class.extend({

    ctor : function(piece, pieceAction, params){
        this.solutionId = -1;
        this.target = piece;
        this.pieceAction = pieceAction;
        this.actionParam = params;

        this.hintPath = null;
        this.showed = false;
        this.used = false;
        this.needHintStone = true;
    },

    //virtual method, se duoc implement boi cac child
    generateHintPath : function(){
        return null;
    },

    //virtual method, se duoc implement boi cac child
    performPieceAction : function(){
        DebugUtil.log("PERFORM SOLUTION: "+this.getString(), true);
    },

    onSolutionSelected : function(){
        if(this.target.isLockMoveByZoo()){
            //todo ZooPopup
            //gv.gameClient.sendActivePiece(this.target.pieceIndex, this.solutionId);
            var size = cc.winSize;
            var zooPopup = new PopupPayForEscapeZoo(10,this.target.playerIndex,this.target.pieceIndex);
            zooPopup.setPosition(-size.width/2,-size.height/2);
            gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(zooPopup,100000);
        }else{
            gv.gameClient.sendActivePiece(this.target.pieceIndex, this.solutionId,0);
        }

    },

    //show solution tren mainboard
    show : function(){
        if(this.showed) return false;
        this.showed = true;
        this.hintPath = this.generateHintPath();
        if(this.hintPath!=null)
            this.hintPath.show(this.onSolutionSelected.bind(this));
        var mainBoardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        mainBoardGui.letPlayerChoosePiece(InteractType.SELECT, [this.target], this.needHintStone,
            function(){
                this.onSolutionSelected();
            }.bind(this));
        return true;
    },

    //an solution tren mainboard
    hide : function(){
        if(!this.showed) return false;
        this.showed = false;
        if(this.hintPath!=null)
            this.hintPath.hide();
        var mainBoardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        mainBoardGui.disablePlayerChoosePiece([this.target]);

        return true;
    },

    //get String description cua solution, chu yeu phuc vu log
    getString : function(){
        switch (this.pieceAction){
            case PieceAction.KICK_OTHER:
                var retText ="KICK SOLUTION. Piece: " + this.target.getString()+" Target: ";
                for(var i=0; i< this.actionParam.length; i++)
                    retText += (this.actionParam[i].getString()+" ");
                return retText;
                break;
            case PieceAction.LOAD_TO_DES:
                return "LOAD SOLUTION. Piece: "+this.target.getString()+" Slot: "+this.actionParam;
                break;
            case PieceAction.NORMAL_MOVE:
                return "MOVE SOLUTION. Piece: "+this.target.getString()+" Destination: " + GameUtil.addSlot(this.target.currSlot, this.actionParam, this.target.playerIndex);
                break;
            case PieceAction.SUMMON:
                return "SUMMON SOLUTION. Piece: "+this.target.getString();
                break;
        }
    },

});