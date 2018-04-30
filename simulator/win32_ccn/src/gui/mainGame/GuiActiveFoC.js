/**
 * Created by user on 24/11/2015.
 */

var GuiActiveFoC = BaseGui.extend({
    callback : null,
    skillLabel : null,
    successRateLabel : null,

    ctor: function (number) {
        this._super(res.ZCSD_GUI_ACTIVE_FOC);
        this.setFog(true);

        var yesBtn = this._rootNode.getChildByName("btn_yes");
        yesBtn.addClickEventListener(this.onYesBtnClick.bind(this));

        var noBtn = this._rootNode.getChildByName("btn_no");
        noBtn.addClickEventListener(this.onNoBtnClick.bind(this));

        this.skillLabel = this._rootNode.getChildByName("label_skill_name");
        this.successRateLabel = this._rootNode.getChildByName("label_percentage");
    },

    onYesBtnClick: function(){
        if(this.callback!=null){
            this.callback(true);
        }
        this.destroy();
    },

    onNoBtnClick: function(){
        if(this.callback!=null){
            this.callback(false);
        }
        this.destroy();
    },

    setSuccessRate : function(percent){
        this.skillLabel.setString("Success rate: "+percent+" %");
    },

    setCurrentSkillName : function(skillName){
        this.successRateLabel.setString("Current skill: " + skillName);
    },

    setCompletedCallback : function(callback){
        this.callback = callback;
    }
});
