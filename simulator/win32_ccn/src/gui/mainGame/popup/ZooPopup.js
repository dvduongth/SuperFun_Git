var constant_ZooPopup = {
    TEXT: "",
    MAX_TIME : 5
};

var ZooPopup = BasePopup.extend({

    ctor: function (playerIndex,pieceIndex) {
        this.playerIndex = playerIndex;
        this.pieceIndex = pieceIndex;
        //this.solutionId = solutionId;
        this.time = 0;
        this._super(res.ZCSD_GUI_CHANNEL);
        this.setFog(true);

        var title = this._rootNode.getChildByName("channel_title");
        title.setVisible(false);
        title.setScale(0.0);
        title.runAction(cc.sequence(cc.delayTime(0.3), cc.scaleTo(0.5, 1.0).easing(cc.easeBackOut())));

        var btn1vs1 = this._centerNode.getChildByName("btn_1vs1");
        btn1vs1.loadTextureNormal("res/game/zoo/tratien.png",ccui.Widget.LOCAL_TEXTURE);
        //btn1vs1.setTexture()
        //fr.changeSprite(btn1vs1,);
        var destination = btn1vs1.getPosition();
        btn1vs1.setPositionX(-btn1vs1.getContentSize().width/2-cc.winSize.width/2);
        btn1vs1.addClickEventListener(this.on1vs1BtnClick.bind(this));
        btn1vs1.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, destination).easing(cc.easeBackOut())));

        var btn1vs3 = this._centerNode.getChildByName("btn_1vs3");
        btn1vs3.loadTextureNormal("res/game/zoo/boqua.png",ccui.Widget.LOCAL_TEXTURE);
        //fr.changeSprite(btn1vs1,"res/game/zoo/boqua.png");
        destination = btn1vs3.getPosition();
        btn1vs3.setPositionX(cc.winSize.width/2+btn1vs3.getContentSize().width/2);
        btn1vs3.addClickEventListener(this.on1vs3BtnClick.bind(this));
        btn1vs3.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, destination).easing(cc.easeBackOut())));

        var exitBtn = this._rootNode.getChildByName("btn_exit");
        exitBtn.addClickEventListener(this.onExitBtnClick.bind(this));

        this.schedule(this.onUpdate,1);
    },

    on1vs1BtnClick: function(){
        gv.gameClient.sendActivePiece(this.pieceIndex, 0,1);

        this.unschedule(this.onUpdate);
        this.removeFromParent();
    },

    on1vs3BtnClick: function(){
        this.unschedule(this.onUpdate);
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
    },

    onExitBtnClick: function() {
        this.on1vs3BtnClick();
    },

    onUpdate:function(){
        this.time++;
        var timeOut = GameUtil.getTimeAuto(TimeoutConfig.TIMEOUT_ACTION);
        if (this.time >timeOut){
            this.time = 0;
            this.unschedule(this.onUpdate);
            this.on1vs3BtnClick();
        }
    }

});