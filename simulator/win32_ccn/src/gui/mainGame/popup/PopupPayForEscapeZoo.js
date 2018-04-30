/**
 * Created by user on 5/4/2017.
 */

var PopupPayForEscapeZoo = BasePopup.extend({
    ctor: function(time,playerIndex,pieceIndex){
        this.moneyNumber = 0;
        this.timeRemain = GameUtil.getTimeAuto(time);

        this._super(res.ZCSD_POPUP_PAY_FOR_ESCAPE_ZOO);
        this.initGui();
        this.playerIndex = playerIndex;
        this.pieceIndex = pieceIndex;
    },

    initGui: function(){
        var bg = this._rootNode.getChildByName("bg");

        var textSummon = bg.getChildByName("title_slot").getChildByName("text_zoo");
        textSummon.setString(fr.Localization.text("Zoo"));

        var textPayToSummon = bg.getChildByName("text_pay_for_escape_zoo");
        textPayToSummon.setString(fr.Localization.text("Pay_for_escape_description"));

        var btnOk = bg.getChildByName("btn_ok");
        btnOk.addClickEventListener(this.onBtnOkClicked.bind(this, true));
        var textOk = btnOk.getChildByName("text_ok");
        textOk.setString(fr.Localization.text("Ok"));

        var btnCancel = bg.getChildByName("btn_cancel");
        btnCancel.addClickEventListener(this.onBtnOkClicked.bind(this, false));
        var textCancel = btnCancel.getChildByName("text_cancel");
        textCancel.setString(fr.Localization.text("Cancel"));

        var textMoney = bg.getChildByName("money_text");
        //Todo: xet tien

        //sau Xs thi tu dong close
        this.schedule(this.update, 1);
    },

    update: function(dt){
        this.timeRemain--;
        if (this.timeRemain<=0){
            this.onBtnOkClicked(false);
        }
    },

    onBtnOkClicked: function(isActive){
        if(isActive){
            gv.gameClient.sendActivePiece(this.pieceIndex, 0,1);
            this.unschedule(this.onUpdate);
            this.removeFromParent();
        }else{
            this.unschedule(this.update);
            var nextPieceIndex = 0;
            for(var i =0;i<2;i++){
                if(this.pieceIndex !=i){
                    nextPieceIndex = i;
                }
            }
            var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(this.playerIndex,nextPieceIndex);
            var solution = piece.getSolutionList();
            if(solution.length == 1){
                gv.gameClient.sendActivePiece(nextPieceIndex, 0,0);//id solution = 0.
            }
            if(solution.length == 0){
                // hien thi khong di chuyen duoc
                gv.gameClient.sendActivePiece(this.pieceIndex, 0,0)
            }
            //gv.gameClient.sendPlayInstantly(PlayMode.MODE_4_PLAYER, this.playWithBot, CheatConfig.MAP_INIT_CASE);
            this.removeFromParent();
        }
    }
});