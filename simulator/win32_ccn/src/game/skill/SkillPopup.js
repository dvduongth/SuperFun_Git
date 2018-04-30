/**
 * Created by GSN on 4/22/2016.
 */
/**
 * Created by GSN on 3/22/2016.
 */

//class the hien bang thong bao skill, hien thi khi bat dau moi skill

var SkillPopup = cc.Node.extend({

    ctor : function(skillId, standPos){
        this._super();

        var isFlip = (standPos<2);

        var bgSprite = fr.createSprite("res/game/skill/skill_bg.png");
        bgSprite.setFlippedX(isFlip);

        var labelText;

        var icon = fr.createSprite("res/game/skill/skill_icon_"+skillId+".png");
        if (100<skillId && skillId<200)
            labelText = fr.createSprite("res/game/skill/skill_label_"+skillId+".png");
        else{
            labelText = new ccui.Text(fr.Localization.text("skill_name_"+skillId), res.FONT_GAME_BOLD_ITALIC, 22);
            labelText.setColor(cc.YELLOW);
        }

        if(isFlip){
            icon.setPosition(20,bgSprite.getContentSize().height/2);
            labelText.setPosition(bgSprite.getContentSize().width*5.5/10, bgSprite.getContentSize().height/2);
            //descriptionText.setPosition(bgSprite.getContentSize().width*4/10, bgSprite.getContentSize().height/3);
        }
        else{
            icon.setPosition(bgSprite.getContentSize().width-20,bgSprite.getContentSize().height/2);
            labelText.setPosition(bgSprite.getContentSize().width*4.5/10, bgSprite.getContentSize().height/2);
            //descriptionText.setPosition(bgSprite.getContentSize().width*6/10, bgSprite.getContentSize().height/3);
        }

        icon.setScale(0.6);
        bgSprite.addChild(icon,0);
        //bgSprite.addChild(descriptionText,0);
        bgSprite.addChild(labelText,0);

        this.addChild(bgSprite);

        this.contentSize = bgSprite.getContentSize();
    },

    getSkillPopupSize : function(){
        return this.contentSize;
    }
});