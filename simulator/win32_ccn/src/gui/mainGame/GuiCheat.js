/**
 * Created by user on 23/2/2016.
 */

/**
 * Created by user on 23/2/2016.
 */

var GuiCheat = BaseGui.extend({

    isShow: false,
    diceCheat: false,
    fortuneCheat: false,
    fortuneCheatNumber: 1,

    ctor:function() {
        this._super(res.ZCSD_GUI_CHEAT);

        this.setPositionX(cc.winSize.width - 370);
        this.setOpacity(100);

        var showBtn = this._rootNode.getChildByName('btn_show');
        showBtn.addClickEventListener(this.onShowBtnClick.bind(this));

        var diceCheatCb = this._rootNode.getChildByName("checkbox_dice_cheat");
        diceCheatCb.addClickEventListener(this.onDiceCheatCheckBoxClick.bind(this));

        var diceBtn1 = this._rootNode.getChildByName("btn_dice_1");
        diceBtn1.addClickEventListener(this.onDiceCheatBtnClick.bind(this, 1));

        var diceBtn2 = this._rootNode.getChildByName("btn_dice_2");
        diceBtn2.addClickEventListener(this.onDiceCheatBtnClick.bind(this, 2));

        var btnCheatSkill = this._rootNode.getChildByName("btn_cheat_skill");
        btnCheatSkill.addClickEventListener(this.onCheatSkillBtnClick.bind(this));
    },

    removeSomeThing:function(){
        var btnCheatSkill = this._rootNode.getChildByName("btn_cheat_skill");
        btnCheatSkill.removeFromParent();
        var diceBtn2 = this._rootNode.getChildByName("btn_dice_2");
        diceBtn2.removeFromParent();
        var checkbox = this._rootNode.getChildByName("cb_cheat_skill");
        checkbox.removeFromParent();
    },
    onDiceCheatCheckBoxClick:function(){
        this.diceCheat = !this.diceCheat;
    },

    onDiceCheatBtnClick : function(diceIndex){
        var text = this._rootNode.getChildByName("label_dice_"+diceIndex);
        var number = parseInt(text.getString())+1;
        if (number>6) number = 1;
        text.setString(number);
    },

    onFortuneCheatCheckBoxClick: function(){
      this.fortuneCheat = !this.fortuneCheat;
    },

    onFortuneCheatBtnClick: function(){
        this.fortuneCheatNumber++;
        if (this.fortuneCheatNumber == FortuneType.JUMP_TO_OPPONENT_HOME_GATE || (this.fortuneCheatNumber == FortuneType.ROLL_FORTUNE_AGAIN)) this.fortuneCheatNumber++;
        if (this.fortuneCheatNumber>6) this.fortuneCheatNumber = 1;
        var text = this._rootNode.getChildByName("label_fortune");
        text.setString(fr.Localization.text("fortune_" + this.fortuneCheatNumber + "_description"));
    },

    onCheatSkillBtnClick: function(){
        var isOn = this._rootNode.getChildByName("cb_cheat_skill").isSelected();
        gv.gameClient.sendCheatActiveSkill(isOn);
    },

    getDiceCheatNumber: function(diceIndex){
        return parseInt(this._rootNode.getChildByName("label_dice_"+diceIndex).getString());
    },

    getFortuneCheatNumber: function(){
        return this.fortuneCheatNumber;
    },

    open: function(){
        this.isShow = true;
        this.runAction(cc.moveBy(0.5, -430, 0).easing(cc.easeBackOut()));
    },

    close: function(){
        this.isShow = false;
        this.runAction(cc.moveBy(0.5, 430, 0).easing(cc.easeBackOut()));
    },

    onShowBtnClick:function()
    {
        this.isShow = !this.isShow;
        if (this.isShow){
            this.open();
            this.setOpacity(255);
        }
        else{
            this.close();
            this.setOpacity(100);
        }
    },
});