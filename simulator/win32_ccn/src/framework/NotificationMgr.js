/**
 * Created by user on 20/3/2017.
 */

gv.notificationMgr = {
    onStart:function(){

        fr.platformWrapper.cancelAllNotification();
        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function()
        {
            //TestNotification.test();

            gv.notificationMgr.showNotification();

        });
        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function()
        {
            fr.platformWrapper.cancelAllNotification();
        });
    },
    showNotification:function()
    {
        this.addDailyGoldBonus();
        this.addVipNotification();
        this.addNotificationForUserNotPlayGameAWeek();
        fr.platformWrapper.showNotify();
    },
    addVipNotification:function()
    {
        if(gv.myInfo == undefined)
        {
            return;
        }
        if(gv.myInfo.isVip())
        {
            var nextTimeGetVip = new Date(gv.gameConfig.cGiftBonus.getNextTimeRevGiftBonus(gv.myInfo.lastTimeRevVipBonus));
            nextTimeGetVip.setHours(7);
            nextTimeGetVip.setMinutes(0);
            nextTimeGetVip.setSeconds(0);
            nextTimeGetVip.setMilliseconds(0);

            if(nextTimeGetVip.getTime() < gv.myInfo.vipExpiredTime)
            {
                var notify = {
                    contentText:fr.Localization.text("lang_notify_vip_gift"),
                    time:Date.now() + nextTimeGetVip.getTime() - gv.myInfo.getCurTimeServer(),
                    sound:'default'
                };

                fr.platformWrapper.addNotify(notify);
            }
        }
    },
    addDailyGoldBonus:function()
    {
        if(gv.myInfo == undefined)
        {
            return;
        }
        var isCanReceive = gv.myInfo.getGold() < 3000;
        if(isCanReceive)
        {
            var currentTime = gv.myInfo.getCurTimeServer();

            var nextTime = Date.now() + (gv.gameConfig.cGiftBonus.getNextTimeDailyGoldBonus(currentTime) - currentTime);
            var notify = {
                contentText:fr.Localization.text("lang_notify_daily_gold_bonus"),
                time:nextTime,
                sound:'default'
            };

            fr.platformWrapper.addNotify(notify);
        }
    },
    addNotificationForUserNotPlayGameAWeek:function()
    {
        if(gv.myInfo == undefined)
        {
            return;
        }
        var nextTime = Date.now() + 7*24*3600*1000;
        var nextDate = new Date(nextTime);
        nextDate.setHours(20);
        nextDate.setMinutes(0);
        nextDate.setSeconds(0);
        nextDate.setMilliseconds(0);
        var notify = {
            contentText:fr.Localization.text("lang_notify_for_user_not_play"),
            time:nextTime,
            sound:'default'
        };

        fr.platformWrapper.addNotify(notify);
    }
};