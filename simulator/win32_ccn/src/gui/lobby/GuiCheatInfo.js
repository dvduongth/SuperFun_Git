/**
 * Created by user on 23/2/2016.
 */

var GuiCheatInfo = BaseGui.extend({

    ctor:function() {
        this._super(res.ZCSD_GUI_CHEAT_INFO);

        var closeBtn = this._centerNode.getChildByName('btn_close');
        closeBtn.addClickEventListener(function(){
            this.setVisible(false);
            this.setFog(false);
        }.bind(this));

        //cheat character
        this.textFiledCharId = this._centerNode.getChildByName('textField_char_id');
        this.textFiledCharId.addEventListener(this.onCharacterIdChanged.bind(this));

        this.charIdLb = this._centerNode.getChildByName('text_char_id');
        this.charIdLb.setString("");

        this.textFiledSkill = this._centerNode.getChildByName('textField_skill');
        this.textFiledSkill.addEventListener(this.onSkillChanged.bind(this));

        this.skillLb = this._centerNode.getChildByName('text_skill');
        this.skillLb.setString("");

        this.sendBtn = this._centerNode.getChildByName("send_btn");
        this.sendBtn.addClickEventListener(this.onSendBtnClick.bind(this));


        var cbPlayMode = this._centerNode.getChildByName("checkbox_playMode");
        CheatConfig.PLAY_WITH_BOT = cbPlayMode.isSelected();
        cbPlayMode.addClickEventListener(function(){
            CheatConfig.PLAY_WITH_BOT = cbPlayMode.isSelected();
        });

        var cbPayment = this._centerNode.getChildByName("checkbox_cheatPayment");
        CheatConfig.PAYMENT = cbPayment.isSelected();
        cbPayment.addClickEventListener(function(){
            CheatConfig.PAYMENT = cbPayment.isSelected();
        });
    },

    onSendBtnClick: function(){
        this.sendBtn.setVisible(false);

        var charId = this.charIdLb.getString();

        var skillList = [];
        var skillStr = this.skillLb.getString();
        while (true){
            var index = skillStr.indexOf(",");
            if (index != -1){
                var skillId = parseInt(skillStr.substring(0, index));
                skillList.push(skillId);
                skillStr = skillStr.substring(index+1, skillStr.length);
            }
            else{
                var skillId = parseInt(skillStr);
                skillList.push(skillId);
                break;
            }
        }
        gv.gameClient.sendCheatCharacter(charId, skillList);
        NotificationHandler.getInstance().addHandler(NotificationHandlerId.CHEAT_ADD_CHARACTER_RESULT, this.onCheatCharacterResult.bind(this));
    },

    onCheatCharacterResult: function(){
        this.sendBtn.setVisible(true);
        NotificationHandler.getInstance().removeHandler(NotificationHandlerId.CHEAT_ADD_CHARACTER_RESULT);
    },

    onCharacterIdChanged: function(sender){
        if (this.charIdLb.getString().length>=20) return;
        this.charIdLb.setString(sender.getString());
    },

    onSkillChanged: function(sender){
        if (this.skillLb.getString().length>=20) return;
        this.skillLb.setString(sender.getString());
    },
});