/**
 * Created by CPU11661_LOCAL on 6/27/2017.
 */
var GuiRecieveGiftTopRanking = BaseGui.extend({
    ctor: function () {
        this._super(res.ZCSD_POPUP_EVENT_TOP_RANKING_RECIEVE_GIFT);
        this.setFog(true);
        this.setAppearEffect(AppearEffects.ZOOM);

        this.btnRecieve = null;
        this.lbLastRank = null;
        this.iconAchivement = null;
        this.lbAchievement = null;
        this.lbTime = null;
        this.listItemGift =[];
        this.bg = null;
        this.cellSize = cc.size(126, 140);
        this.syncChildrenInNode(this._rootNode);
    },
    setMyInfo:function(myInfo)
    {
        this.lbLastRank.setString(myInfo.lastIndex);
        this.iconAchivement.visible = false;
        if(myInfo.lastIndex<=10)
        {
            this.iconAchivement.visible = true;
            this.lbAchievement.setString(myInfo.lastIndex);
        }
        var listGift = TopRankingConfig.getInstance().getListGift(myInfo.lastIndex);

        var len = listGift.length;
        var dxChange = this.cellSize.width+15;
        var dx = this.bg.width/2-((len-1)/2)*(dxChange);
        for(var i=0;i<len;i++)
        {
            var itemGift = new ElementGiftBattle(res.ZCSD_POPUP_EVENT_TOP_RANKING_ITEM_GIFT);
            itemGift.setInfo(listGift[i]);
            itemGift.setPosition(dx + i*(dxChange),this.cellSize.height/2 + 115);
            this.listItemGift.push(itemGift);
            this.bg.addChild(itemGift);
        }

    },
    onTouchUIEndEvent: function (sender) {
        switch (sender) {
            case this.btnRecieve:
                this.playEffectFlyGift();
                this.destroy(DestroyEffects.ZOOM);
                break;
            default :
                break;
        }
    },
    playEffectFlyGift:function()
    {
      for(var i=0;i<this.listItemGift.length;i++)
      {
          var itemGift = this.listItemGift[i];
          var giftIcon = fr.createSprite(GiftData.getGiftResourceByType(itemGift.giftData.type, itemGift.giftData.quantity));
          giftIcon.setPosition(itemGift.sprIcon.parent.convertToWorldSpace(itemGift.sprIcon.getPosition()));
          gv.layerMgr.getLayerByIndex(LayerId.LAYER_POPUP).addChild(giftIcon);
          GameUtil.flyToMail(giftIcon);
      }
    },
});