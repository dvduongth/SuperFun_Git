/**
 * Created by user on 10/3/2016.
 */

var GuiCharacterCongrats = BaseGui.extend({

    characterDataList: [],

    CHARACTER_TABLE_SIZE: null,
    CHARACTER_TABLE_CELL_SIZE: cc.size(300*0.8, 374*0.8),

    ctor: function(characterDataList){
        this._super();
        this.setFog(true);
        //this.setAppearEffect(AppearEffects.ZOOM);

        this.characterDataList = characterDataList;

        if (characterDataList.length<=3){
            for(var i=0; i< characterDataList.length; i++) {
                var characterData = characterDataList[i];
                var card = GraphicSupporter.drawCard(characterData);
                card.setPosition(cc.winSize.width * (i + 1) / (characterDataList.length + 1), cc.winSize.height / 2);
                this.addChild(card);

                card.setScale(0);
                card.runAction(cc.sequence(
                    cc.delayTime((i+1)*0.15),
                    cc.scaleTo(0.2, 0.7),
                    cc.callFunc(function(){
                        fr.Sound.playSoundEffect(resSound.g_card_receive);
                    })
                ));
            }
        }
        else{
            this.CHARACTER_TABLE_SIZE = cc.size(cc.winSize.width-100, 374*0.8);
            this.table = new cc.TableView(this, this.CHARACTER_TABLE_SIZE);
            this.table.setPosition(cc.winSize.width/2-this.CHARACTER_TABLE_SIZE.width/2, cc.winSize.height/2-this.CHARACTER_TABLE_SIZE.height/2);
            this.table.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
            this.table.setDelegate(this);
            this.addChild(this.table);
            this.table.reloadData();

            for(var i=0; i<characterDataList.length; i++){
                var cell = this.table.cellAtIndex(i);
                if (cell){
                    var card = cell.getChildByTag(1);
                    card.setScale(0);
                    card.runAction(cc.sequence(
                        cc.delayTime((i+1)*0.15),
                        cc.scaleTo(0.2, 0.7),
                        cc.callFunc(function(){
                            fr.Sound.playSoundEffect(resSound.g_card_receive);
                        })
                    ));
                }
            }
        }

        var closeBtn = fr.createSimpleButton("res/button/x.png", ccui.Widget.LOCAL_TEXTURE);
        closeBtn.setPosition(cc.winSize.width-150, cc.winSize.height-100);
        this.addChild(closeBtn);
        closeBtn.addClickEventListener(this.onCloseBtnClick.bind(this));
    },

    tableCellAtIndex:function (table, idx) {
        var cell = table.dequeueCell();
        var characterData = this.characterDataList[idx];
        var background;
        if (!cell) {
            cell = new cc.TableViewCell();
            var cellSize = this.tableCellSizeForIndex(table, idx);
            background = GraphicSupporter.drawCard(characterData);
            background.setTouchEnabled(false);
            background.setPosition(cellSize.width/2, cellSize.height/2);
            background.setTag(1);
            cell.addChild(background);
        }
        else{
            background = cell.getChildByTag(1);
            GraphicSupporter.changeCard(background, characterData);
        }
        background.setScale(0.7);
        return cell;
    },

    tableCellSizeForIndex:function (table, idx) {
        return this.CHARACTER_TABLE_CELL_SIZE;
    },

    numberOfCellsInTableView:function (table) {
        return this.characterDataList.length;
    },

    onCloseBtnClick: function(){
        this.destroy();
    },
});