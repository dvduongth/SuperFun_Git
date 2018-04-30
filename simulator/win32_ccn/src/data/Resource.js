/**
 * Created by GSN on 6/2/2015.
 */

var GuiId = {
    LOGIN: 0,
    LOADING: 1,
    LOBBY : 2,
    PLAYER_INFO: 3,
    CHANNEL: 4,
    DICE_SHOP: 5,
    GACHA: 6,
    OPEN_CHARACTER: 7,
    CHARACTER_CONGRATS: 8,
    CHEAT_INFO:9,
    GAME_INFO: 10,
    SELECT_CHARACTER: 11,
    SELECT_CHARACTER_CONFIRM: 12,
    UPGRADE_CHARACTER: 13,
    SELL_CHARACTER: 14,
    AUTO_PICK_CHARACTER: 15,
    FIND_OPPONENT: 20,
    REST_ROOM: 21,
    CHOOSE_CARD : 22,
    MAIN_BOARD: 23,
    CHEAT: 24,
    SETTING_IN_GAME: 25,
    ACTIVE_FORTUNE: 26,
    ACTIVE_FOC: 27,
    ROB_GOLD: 28,
    END_GAME: 29,
    MINI_GAME: 30,
    HORSE_RACE_GAME: 31,
    MINI_GAME_TUXI:32,
    BUY_GOLD_PROMOTION : 40,
    BUY_GOLD: 41,
    BUY_GOLD_BY_G_CONFIRM: 42,
    BUY_G_PROMOTION: 43,
    WAITING_GUI : 44,
    MAIL: 45,
    POPUP_EVENT_DAILY_LOGIN: 46,
    POPUP_GIFT_CONGRATS: 47,
    ACCUMULATION_PAYMENT: 48,
    VIP_REGISTER: 49,
    VIP_INFO: 50,
    VIP_EXPIRED: 51,
    VIP_SUCCESS: 52,
    VIP_FAIL: 53,
    POPUP_DAILY_GIFT_VIP_CONGRATS: 54,
    CHEAT_PAYMENT: 55,
    NOT_ENOUGH_G: 56,
    NOT_ENOUGH_GOLD: 57,
    INVITE_FRIEND: 58,
    SELFIE: 59,
    POPUP_NOTIFICATION: 60,
    SETTING_LOBBY: 61,
    GIFT_CODE: 62,
    CHARACTER_BOOK: 63,
    CARD_BOOK: 64,
    DICE_BOOK: 65,
    SKILL_BOOK: 66,
    PLAYER_INFO_PANEL: 67,
    HISTORY_LOG:68,
    DISCONNECT: 69,
    CHAT_IN_GAME:70,
    MINI_GAME_2:71,
    LINE_CONTROL:72,
    CONFLICT: 73,
    AUTO_PLAY:74,
    CHANEL_BET:75,
    PLAYER_POSITION:76,
    GUI_SANKHOBAU:77,
    DETAIL_INFO: 78,
    POPUP_PAY_FOR_SUMMON: 79,
    GUI_QUEST: 80
};

var res = {

    //Chat in game :)
    CHAT_BACKGROUND:"res/game/guichatingame/gui_background.png",
    CHAT_CLICK:"res/game/guichatingame/icon_chat.png",
    CHAT_POPUP:"res/game/guichatingame/popup.png",
    //Icon chat in game:)
    ICON_1:"res/game/guichatingame/icon/1.png",
    ICON_2:"res/game/guichatingame/icon/2.png",
    ICON_3:"res/game/guichatingame/icon/3.png",
    ICON_4:"res/game/guichatingame/icon/4.png",
    ICON_5:"res/game/guichatingame/icon/5.png",
    ICON_6:"res/game/guichatingame/icon/6.png",
    ICON_7:"res/game/guichatingame/icon/7.png",
    ICON_8:"res/game/guichatingame/icon/8.png",
    ICON_9:"res/game/guichatingame/icon/9.png",
    ICON_10:"res/game/guichatingame/icon/10.png",
    ICON_11:"res/game/guichatingame/icon/11.png",
    ICON_12:"res/game/guichatingame/icon/12.png",
    ICON_13:"res/game/guichatingame/icon/13.png",
    ICON_14:"res/game/guichatingame/icon/14.png",
    ICON_15:"res/game/guichatingame/icon/15.png",
    ICON_16:"res/game/guichatingame/icon/16.png",
    ICON_17:"res/game/guichatingame/icon/17.png",
    ICON_18:"res/game/guichatingame/icon/18.png",
    ICON_19:"res/game/guichatingame/icon/19.png",


    //History Log
    TRIANGLE_BUTTON:"res/game/history_log/triangle_button.png",
    BACKGROUND_HISTORY:"res/game/history_log/history_bg.png",
    RED_HORSE:"res/game/history_log/red_horse.png",
    BLUE_HORSE:"res/game/history_log/blue_horse.png",
    YELLOW_HORSE:"res/game/history_log/yellow_horse.png",
    GREEN_HORSE:"res/game/history_log/green_horse.png",

    //mini game
    COIN_RIGHT_SIDE:"res/game/miniGame/_0013_Layer-4.png",
    COIN_LEFT_SIDE:"res/game/miniGame/_0006_Layer-267-copy-2.png",
    GREEN_ARROW: "res/game/miniGame/greenArrow.png",
    RED_ARROW: "res/game/miniGame/redArrow.png",
    MONEY_PILE: "res/game/miniGame/tien.png",
    RIGHT: "res/game/miniGame/o.png",
    WRONG: "res/game/miniGame/x.png",

    //dice shop
    DICE_GOLD: "res/lobby/diceShop/dice5.png",
    DICE_WHITE:"res/lobby/diceShop/dice4.png",
    DICE_WOOD:"res/lobby/diceShop/dice3.png",
    DICE_CANDY:"res/lobby/diceShop/dice1.png",
    DICE_ELECTRONIC:"res/lobby/diceShop/dice2.png",

    //font
    FONT_BITMAP_NUMBER_1:"fonts/number_1.fnt",
    FONT_BITMAP_DICE_NUMBER: "fonts/diceNumber.fnt",
    FONT_VREVUE_TFF: "res/fonts/vni.common.VREVUE.ttf",
    FONT_UNICODE_VREVUE_TFF: "res/fonts/unicode.revueb.ttf",
    FONT_UNICODE_ARIAL_MS: "res/fonts/ARIALUNI.TTF",

    FONT_GAME: "fonts/font_game.ttf",
    FONT_GAME_BOLD: "fonts/font_game_bold.ttf",
    FONT_GAME_ITALIC: "fonts/font_game_italic.ttf",
    FONT_GAME_BOLD_ITALIC: "fonts/font_game_bold_italic.ttf",
    FONT_ARIAL: "Arial",

    //zcsd
    //screen
    ZCSD_ROOT: "",

    //Login
    ZCSD_GUI_LOGIN: "zcsd/gui/login/Gui_Login.json",
    ZCSD_GUI_DISCONNECT: "zcsd/gui/login/Gui_Disconnect.json",

    //Lobby
    ZCSD_GUI_LOBBY:"zcsd/gui/lobby/Gui_Lobby.json",
    ZCSD_GUI_MAIL:"zcsd/gui/lobby/Gui_Mail.json",
    ZCSD_GUI_PLAYER_INFO:"zcsd/gui/lobby/Gui_PlayerInfo.json",
    ZCSD_GUI_SETTING_LOBBY:"zcsd/gui/lobby/Gui_SettingLobby.json",
    ZCSD_GUI_GIFT_CODE:"zcsd/gui/lobby/Gui_GiftCode.json",
    ZCSD_GUI_INVITE_FRIEND:"zcsd/gui/lobby/Gui_InviteFriend.json",
    ZCSD_GUI_SELFIE:"zcsd/gui/lobby/Gui_Selfie.json",
    ZCSD_GUI_CHANNEL:"zcsd/gui/lobby/Gui_Channel.json",
    ZCSD_GUI_FIND_OPPONENT:"zcsd/gui/lobby/Gui_FindOpponent.json",

    ZCSD_GUI_DICE_SHOP: "zcsd/gui/lobby/gameInfo/Gui_DiceShop.json",
    ZCSD_GUI_GACHA: "zcsd/gui/lobby/Gui_Gacha.json",
    ZCSD_GUI_CHEAT_INFO: "zcsd/gui/lobby/Gui_CheatInfo.json",
    ZCSD_GUI_GAME_INFO: "zcsd/gui/lobby/gameInfo/Gui_GameInfo.json",
    ZCSD_GUI_SELECT_CHARACTER: "zcsd/gui/lobby/gameInfo/Gui_SelectCharacter.json",
    ZCSD_GUI_SELECT_CHARACTER_CONFIRM: "zcsd/gui/lobby/gameInfo/Gui_SelectCharacterConfirm.json",

    ZCSD_GUI_UPGRADE_CHARACTER: "zcsd/gui/lobby/gameInfo/Gui_UpgradeCharacter.json",
    ZCSD_GUI_SELL_CHARACTER: "zcsd/gui/lobby/gameInfo/Gui_SellCharacter.json",
    ZCSD_GUI_AUTO_PICK: "zcsd/gui/lobby/gameInfo/Gui_AutoPick.json",

    ZCSD_GUI_CHARACTER_BOOK: "zcsd/gui/lobby/gameInfo/Gui_CharacterBook.json",
    ZCSD_GUI_CARD_BOOK: "zcsd/gui/lobby/gameInfo/Gui_CardBook.json",
    ZCSD_GUI_DICE_BOOK: "zcsd/gui/lobby/gameInfo/Gui_DiceBook.json",
    ZCSD_GUI_SKILL_BOOK: "zcsd/gui/lobby/gameInfo/Gui_SkillBook.json",

    ZCSD_GUI_BUY_GOLD_PROMOTION: "zcsd/gui/lobby/payment/Gui_BuyGoldPromotion.json",
    ZCSD_GUI_BUY_GOLD: "zcsd/gui/lobby/payment/Gui_BuyGold.json",
    ZCSD_GUI_BUY_GOLD_BY_G_CONFIRM: "zcsd/gui/lobby/payment/Gui_BuyGoldByGConfirm.json",
    ZCSD_GUI_BUY_G_PROMOTION: "zcsd/gui/lobby/payment/Gui_BuyGPromotion.json",
    ZCSD_GUI_VIP_PAYMENT: "zcsd/gui/lobby/payment/Gui_VipPayment.json",
    ZCSD_GUI_NOT_ENOUGH_G: "zcsd/gui/lobby/payment/Gui_NotEnoughG.json",
    ZCSD_GUI_NOT_ENOUGH_GOLD: "zcsd/gui/lobby/payment/Gui_NotEnoughGold.json",
    ZCSD_GUI_CHEAT_PAYMENT: "zcsd/gui/lobby/payment/Gui_CheatPayment.json",
    ZCSD_GUI_ACCUMULATION_PAYMENT: "zcsd/gui/lobby/event/Gui_AccumulationPayment.json",
    ZCSD_POPUP_EVENT_DAILY_LOGIN: "zcsd/gui/lobby/event/Popup_EventDailyLogin.json",
    ZCSD_GUI_VIP_REGISTER: "zcsd/gui/lobby/invest/Gui_Vip_Register.json",
    ZCSD_GUI_VIP_INFO: "zcsd/gui/lobby/invest/Gui_Vip_Info.json",
    ZCSD_GUI_VIP_EXPIRED: "zcsd/gui/lobby/invest/Gui_Vip_Expired.json",
    ZCSD_GUI_VIP_SUCCESS: "zcsd/gui/lobby/invest/Gui_Vip_Success.json",
    ZCSD_GUI_VIP_FAIL: "zcsd/gui/lobby/invest/Gui_Vip_FAIL.json",
    ZCSD_POPUP_DAILY_GIFT_VIP_CONGRATS: "zcsd/gui/lobby/invest/Popup_Daily_Gift_Vip_Congrats.json",



    //MainGame
    ZCSD_GUI_CHOOSE_CARD: "zcsd/gui/mainGame/Gui_ChooseCard.json",
    ZCSD_GUI_MAIN_BOARD:"zcsd/gui/mainGame/Gui_MainBoard.json",
    ZCSD_GUI_CHEAT:"zcsd/gui/mainGame/Gui_Cheat.json",
    ZCSD_GUI_SETTING_IN_GAME:"zcsd/gui/mainGame/Gui_SettingInGame.json",
    ZCSD_GUI_ACTIVE_FORTUNE:"zcsd/gui/mainGame/Gui_ActiveFortune.json",
    ZCSD_GUI_ACTIVE_FOC:"zcsd/gui/mainGame/Gui_ActiveFoC.json",
    ZCSD_GUI_PLAYER_INFO_PANEL:"zcsd/gui/mainGame/Gui_PlayerInfoPanel.json",
    ZCSD_GUI_DETAIL_INFO:"zcsd/gui/mainGame/Gui_DetailInfo.json",
    ZCSD_GUI_ROB_GOLD:"zcsd/gui/mainGame/Gui_RobGold.json",
    ZCSD_GUI_END_GAME:"zcsd/gui/mainGame/Gui_EndGame.json",
    ZCSD_POPUP_PAY_FOR_SUMMON:"zcsd/gui/mainGame/popup/Popup_PayForSummon.json",
    ZCSD_POPUP_PAY_FOR_ESCAPE_ZOO:"zcsd/gui/mainGame/popup/Popup_PayForEscapeZoo.json",
    ZCSD_POPUP_UP_TILE:"zcsd/gui/mainGame/popup/Popup_UpTile.json",

    //ZCSD_NODE_FRIEND_TABLE:"zcsd/node/Node_FriendTable.json",
    //ZCSD_NODE_DICE_CONTROL:"zcsd/node/Node_DiceControl.json",

    //popup
    ZCSD_POPUP_MINI_GAME:"zcsd/game/mini_game/PopupMiniGame.json",

    ZCSD_GUI_MINI_GAME:"zcsd/gui/mainGame/Gui_MiniGame.json",
    ZCSD_GUI_HORSE_RACE_GAME:"zcsd/gui/mainGame/GuiHorseRaceGame.json",


    ZCSD_NODE_FRIEND_TABLE:"zcsd/node/Node_FriendTable.json",
    ZCSD_NODE_DICE_CONTROL:"zcsd/node/Node_DiceControl.json",

    ZCSD_GUI_SANKHOBAU : "zcsd/gui/mainGame/Gui_SanKhoBau.json",
    ZCSD_GUI_MINIGAME2 : "zcsd/gui/mainGame/GuiMiniGame2.json",
    ZCSD_GUI_GOLD :"zcsd/gui/mainGame/Gui_Money.json",
    ZCSD_GUI_TUXI:"zcsd/gui/mainGame/Gui_MiniGame_123.json",
    ZCSD_GUI_LOGIN_ZINGME :"zcsd/gui/login/Gui_Login_Zingme.json",
    ZCSD_GUI_POPUP_BOOM: "zcsd/gui/mainGame/popup/Popup_Boom.json",

    ZCSD_GUI_QUEST: "zcsd/gui/quest/Gui_Quest.json",
    ZCSD_ELEMENT_DAILY_QUEST: "zcsd/gui/quest/dailyQuest/Element_Daily_Quest.json",
    ZCSD_ELEMENT_EVENT_QUEST: "zcsd/gui/quest/event/Element_Event_Quest.json",
};