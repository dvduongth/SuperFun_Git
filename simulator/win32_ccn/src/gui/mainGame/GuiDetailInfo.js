/**
 * Created by user on 21/12/2016.
 */

var GuiDetailInfo = BasePopup.extend({
    ctor: function(standPos, characterData){
        this._super(res.ZCSD_GUI_DETAIL_INFO);

        this.bg = this._rootNode.getChildByName("bg");

        this.btnAuto = this.bg.getChildByName("btn_auto_play");
        this.btnAuto.addClickEventListener(this.onAutoBtnClick.bind(this));
        this.btnAuto.setVisible(standPos==0);

        this.btnClose = this.bg.getChildByName("btn_close");
        this.btnClose.addClickEventListener(this.destroy.bind(this));

        var card = GraphicSupporter.drawCard(characterData);
        card.setPosition(120, this.bg.getContentSize().height/2+30);
        card.setScale(0.6);
        this.bg.addChild(card);

        var skillTable = new CharacterSkillTable(characterData, 1);
        skillTable.setPosition(this.bg.getContentSize().width*2/3, this.bg.getContentSize().height/2+20);
        skillTable.setScale(1.1);
        this.bg.addChild(skillTable);
    },

    onAutoBtnClick: function(){
        //Todo: bat che do auto play
        this.destroy();
        gv.guiMgr.getGuiById(GuiId.AUTO_PLAY).Enable_Auto_Mode();
    },

});