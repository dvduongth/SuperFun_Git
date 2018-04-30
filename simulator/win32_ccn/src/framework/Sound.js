/**
 * Created by GSN on 8/20/2015.
 */

var PieceSoundAction = {
    JUMP: 0,
    JUMP_ATTACK: 1,
    LAND: 2,
    ATTACK: 3,
};

fr.Sound = {};
fr.Sound.isFirstRun = false;

fr.Sound.playSoundEffect = function(soundPath, isLoop){
    cc.log("playSoundEffect: " + soundPath);
    if (soundPath == undefined){
        cc.log("fuck");
    }
    if (this.effectOn){
        isLoop = typeof isLoop !== 'undefined' ? isLoop : false;
        cc.audioEngine.playEffect(soundPath, isLoop);
    }
};

fr.Sound.setSound = function(isOn){
    this.effectOn = isOn;
    this.saveSetting();
},

fr.Sound.setMusic = function(isOn) {
    this.musicOn = isOn;
    if (this.musicOn)
    {
        cc.audioEngine.resumeMusic();
    }else
    {
        cc.audioEngine.pauseMusic();
    }
    this.saveSetting();
},

fr.Sound.playRollDiceSoundEffect = function(diceId){
    switch (diceId){
        case DiceName.DICE_2:
            fr.Sound.playSoundEffect(resSound.dice_bone_00);
            return;
        case DiceName.DICE_3:
            fr.Sound.playSoundEffect(resSound.dice_wood_00);
            return;
        case DiceName.DICE_4:
            fr.Sound.playSoundEffect(resSound.dice_electric_00);
            return;
        case DiceName.DICE_5:
            fr.Sound.playSoundEffect(resSound.dice_gold_00);
            return;


    }
    var index = Math.floor(MathUtil.randomBetween(0, 2));
    var soundPath = "sounds/sound/dice_normal_0" + index + ".mp3";
    fr.Sound.playSoundEffect(soundPath);
},

fr.Sound.playPieceSoundEffect = function(color, action){
    var animal = "";

    switch (color) {
        case PlayerColor.BLUE:
        case PlayerColor.GREEN:
            animal = "hippo";
            break;
        case PlayerColor.RED:
        case PlayerColor.YELLOW:
            animal = "snake";
            break;
        default :
            animal = "hippo";
            //cc.log("color = " + color + " CANNOT FIND SOUND!!!!!!!!!!!!");
    }

    var actionStr = "";
    switch (action) {
        case PieceSoundAction.JUMP:
            actionStr = "jump";
            break;
        case PieceSoundAction.JUMP_ATTACK:
            actionStr = "jump_atk";
            break;
        case PieceSoundAction.LAND:
        {
            var index = MathUtil.randomBetween(0, 3);
            actionStr = "land_0" + index;
            break;
        }
        case PieceSoundAction.ATTACK:
        {
            var index = MathUtil.randomBetween(0, 3);
            actionStr = "hit_0" + index;
            break;
        }
    }

    var soundPath = "";
    if (action == PieceSoundAction.ATTACK){
        soundPath = "sounds/sound/" + actionStr + ".mp3"
    }
    else{
        soundPath = "sounds/sound/" + animal + "_" + actionStr + ".mp3"
    }
    fr.Sound.playSoundEffect(soundPath);
};

fr.Sound.playMusic = function(musicPath, isLoop){
    isLoop = typeof  isLoop !== 'undefined' ? isLoop : true;
    cc.audioEngine.playMusic(musicPath, isLoop);
    if(!this.musicOn){
        cc.audioEngine.pauseMusic();
    }
};
fr.Sound.stopMusic = function()
{
    cc.audioEngine.stopMusic();
};
fr.Sound.loadSetting = function()
{
    cc.audioEngine.setEffectsVolume(1);
    cc.audioEngine.setMusicVolume(1);
    fr.Sound.effectOn = fr.LocalStorage.getBoolFromKey("sound_effect",true);
    fr.Sound.musicOn= fr.LocalStorage.getBoolFromKey("sound_music",true);
};
fr.Sound.saveSetting = function()
{
    fr.LocalStorage.setBoolFromKey("sound_effect", fr.Sound.effectOn);
    fr.LocalStorage.setBoolFromKey("sound_music", fr.Sound.musicOn);
};

fr.Sound.preloadEffect = function (soundPath)
{
    cc.audioEngine.preloadEffect(soundPath);
};

fr.Sound.playEffectClickButton = function()
{
    fr.Sound.playSoundEffect(resSound.m_button_click);
};

fr.Sound.playEffectCancelButton = function()
{
    fr.Sound.playSoundEffect(resSound.m_button_cancel);
};

fr.Sound.playEnterTileSound = function(tile)
{
    if (tile.type == TileType.TILE_DESTINATION){
        var number = tile.getTileNumber();
        fr.Sound.playSoundEffect("sounds/sound/g_stair_0" + number +".mp3");
    }
    else{
        var stepCount = tile.stepCount % 8;
        fr.Sound.playSoundEffect("sounds/sound/g_jump_0" + stepCount + ".mp3");
    }
};

fr.Sound.playJumpSoundEffect = function(stepCount){

};

