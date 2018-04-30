/**
 * Created by GSN on 7/8/2015.
 */

InPacketFactory = cc.Class.extend({
    ctor: function () {
    },

    createPacket: function (cmdId, pkg) {

        cc.log("Create packet: "+cmdId);

        var pk = null;
        switch (cmdId) {
            case  gv.CMD.HAND_SHAKE:
            {
                pk = gv.poolObjects.get(CmdReceiveHandshake);

                break;
            }
            case gv.CMD.USER_DISCONNECTED:
            {
                pk = gv.poolObjects.get(CmdReceiveOnClientDisconnected);
                break;
            }

            case gv.CMD.USER_LOGIN:
            {
                pk = gv.poolObjects.get(CmdReceiveLogin);
                break;
            }

            case gv.CMD.GET_PLAYER_DATA:
            {
                pk = gv.poolObjects.get(CmdReceiveGetPlayerData);
                break;
            }

            case gv.CMD.GET_FRIEND_RANK:
            {
                pk = gv.poolObjects.get(CmdReceiveGetFriendListData);
                break;
            }

            case  gv.CMD.MATCH_INFO :
            {
                pk = gv.poolObjects.get(CmdReceiveMatchInfo);
                break;
            }

            case gv.CMD.PLAYER_JOIN_MATCH :
            {
                pk = gv.poolObjects.get(CmdReceivePlayerJoinGame);
                break;
            }
            case gv.CMD.PLAYER_LEAVE_MATCH :
            {
                pk = gv.poolObjects.get(CmdReceivePlayerLeaveGame);
                break;
            }
            case  gv.CMD.MATCH_START :
            {
                pk = gv.poolObjects.get(CmdReceiveMatchStart);
                break;
            }
            case  gv.CMD.PLAYER_ROLL_DICE_COMMON :
            {
                pk = gv.poolObjects.get(CmdReceiveCommonRollDice);
                break;
            }
            case  gv.CMD.MATCH_NEXT_TURN :
            {
                pk = gv.poolObjects.get(CmdReceiveNextTurn);
                break;
            }
            case  gv.CMD.PLAYER_ACTIVE_PIECE :
            {
                pk = gv.poolObjects.get(CmdReceiveActivePiece);
                break;
            }
            case gv.CMD.PLAYER_RESPONSE_SKILL:
            {
                pk = gv.poolObjects.get(CmdReceivePlayerResponseSkill);
                break;
            }
            case  gv.CMD.MATCH_END_GAME :
            {
                pk = gv.poolObjects.get(CmdReceiveEndGame);
                break;
            }

            case gv.CMD.PLAYER_TUXI_MINI_GAME :
            {
                pk = gv.poolObjects.get(CmdReceiveMiniGameTuXi);
                break;
            }
            case gv.CMD.GET_ALL_CHARACTER:
            {
                pk = gv.poolObjects.get(CmdReceiveGetAllCharacter);
                break;
            }
            case gv.CMD.DO_GACHA:
            {
                pk = gv.poolObjects.get(CmdReceiveDoGaCha);
                break;
            }
            case gv.CMD.CHEAT_ADD_CHAR_WITH_SKILL_SET:
            {
                pk = gv.poolObjects.get(CmdReceiveCheatCharacter);
                break;
            }
            case gv.CMD.UPGRADE_CHARACTER :
            {
                pk = gv.poolObjects.get(CmdReceiveUpgradeCharacter);
                break;
            }
            case gv.CMD.SELL_CHARACTER:
            {
                pk = gv.poolObjects.get(CmdReceiveSellCharacter);
                break;
            }
            case gv.CMD.GET_GLOBAL_RANK:
            {
                pk = gv.poolObjects.get(CmdReceiveGetGlo);
                break;
            }
            case gv.CMD.GET_EVENT_DATA:
            {
                pk = gv.poolObjects.get(CmdReceiveEventData);
                break;
            }
            case gv.CMD.GET_MAIL_DATA:
            {
                pk = gv.poolObjects.get(CmdReceiveGetMailData);
                break;
            }
            case gv.CMD.RECEIVE_MAIL_ITEM:
            {
                pk = gv.poolObjects.get(CmdReceiveMailItem);
                break;
            }
            case gv.CMD.UPDATE_MAIL_DATA:
            {
                pk = gv.poolObjects.get(CmdReceiveUpdateMailData);
                break;
            }
            case gv.CMD.MATCH_CHEAT_ACTIVE_SKILL:
            {
                pk = gv.poolObjects.get(CmdReceiveCheatActiveSkill);
                break;
            }
            case gv.CMD.DAILY_CHECKIN:
            case gv.CMD.DAILY_SUPPORT_CLAIM:
            case gv.CMD.INVITE_FRIEND_CLAIM:
            case gv.CMD.PAYING_ACCUMULATE_CLAIM:
            case gv.CMD.SELFIE_CHARACTER_CLAIM:
            case gv.CMD.UPDATE_NUMBER_INVITED_FRIEND:
                pk = gv.poolObjects.get(CmdReceiveEmptyPacket);
                break;


            case gv.CMD.GET_ALL_DICE:
            {
                pk = gv.poolObjects.get(CmdReceiveGetAllDice);
                break;
            }
            case gv.CMD.PAYMENT_UPDATE:
            {
                pk = gv.poolObjects.get(CmdReceivePaymentUpdate);
                break;
            }
            //cuong case nhan goi tin
            case gv.CMD.PLAYER_CHAT:
            {
                pk = gv.poolObjects.get(CmdReceiveChat);
                break;
            }
           /* case gv.CMD.PLAYER_SINGLE_MINIGAME_PLAY:
            {
                pk = gv.poolObjects.get(CmdReceiveClickMinigame2);
                break;
            }*/

            case gv.CMD.HORSERACE_MINIGAME_PLAY:
            {
                pk = gv.poolObjects.get(CmdReceiveSelectionMiniGame);
                break;
            }
            case gv.CMD.PLAYER_CONTROL_CELL:
            {
                pk = gv.poolObjects.get(CmdReceivePlayerControlCell);
                break;
            }
            case gv.CMD.PLAYER_PAY_TO_SUMMON:
            {
                pk = gv.poolObjects.get(CmdReceivePlayerPayToSummon);
                break;
            }
            case gv.CMD.PLAYER_SWITCH_AUTO:
            {
                pk = gv.poolObjects.get(CmdReceiveAutoPlay);
                break;
            }
            case gv.CMD.TREASURE_ATTEMPT:{
                pk = gv.poolObjects.get(CmdReceiveRollDiceEven);
                break;
            }
            case gv.CMD.GET_SPECIAL_EVEN_DATA:{
                pk = gv.poolObjects.get(CmdReceiveGetSpecialEvenData);
                break;
            }
            //case gv.CMD.PLAYER_CONTROL_CELL:{
            //    pk = gv.poolObjects.get(CmdReceiveControlCell);
            //    break;
            //}

            default:
                //cc.error("Invalid packet command: " + cmdId);
                return null;
        }

        if(pk!=null)
        {
            pk.init(pkg);
            if ( pk.getError() == 0 ) {
                pk.readData();
            }
            else{
                cc.log("Packet : "+cmdId+" Error Code: " + pk.getError());
            }
        }
        else{
            cc.log("[ERROR] Packet error: "+cmdId);
        }

        return pk;
    }
});