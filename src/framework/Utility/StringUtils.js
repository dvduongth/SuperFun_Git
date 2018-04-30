/**
 * Created by KienVN on 5/28/2015.
 */

var StringUtil={};

StringUtil.toMoneyString = function(num)
{
    var isNegative = false;
    var formattedNumber = num;
    if(num < 0){
        isNegative = true;
    }
    num = Math.abs(num);
    var hau_to;
    if(num >= 1000000000){
        hau_to = 'G';
        formattedNumber = (num/1000000000).toFixed(3);
    } else if (num >= 1000000){
        hau_to = 'M';
        formattedNumber = (num/1000000).toFixed(3);
    } else if (num >= 1000){
        hau_to = 'K';
        formattedNumber = (num/1000).toFixed(3);
    }else
    {
        formattedNumber = num.toString();
    }

    formattedNumber = formattedNumber.replace('.000',hau_to).replace('.00',hau_to).replace('.0',hau_to);
    var indexOfDot = formattedNumber.indexOf('.');
    if(indexOfDot > 0)
    {
        var buff = formattedNumber.substring(indexOfDot + 1);
        if(buff[2] == '0')
        {
            buff = buff.replace(/0/g,'');
            formattedNumber = formattedNumber.substring(0,indexOfDot+1) + buff + hau_to;
        }
        else{
            formattedNumber = formattedNumber.replace('.',hau_to).replace(/00$/,'').replace(/0$/,'');
        }
    }
    if(isNegative)
    {
        formattedNumber = '-' + formattedNumber;
    }
    return formattedNumber;
};

StringUtil.limitWordNumber = function(str, num){
    var result = str;
    if (str.length>num){
        result = str.substring(0, num-3) + "...";
    }
    return result;
};

StringUtil.normalizeNumber = function(number) {
    var str = number.toString();
    var count = 0;
    for(var i = str.length-1; i>=1; i--){
        if (str[i] == '.') continue;
        count++;
        if ((count==3) && (parseInt(str[i-1]).toString() !== "NaN")){
            str = str.slice(0,i) + "." + str.slice(i);
            count = 0;
        }
    }
    return str;
};

StringUtil.getNumberFromNormalizeNumber = function(normalizeNumber){
    normalizeNumber = normalizeNumber.replace(",", "");
    return parseInt(normalizeNumber);
};

StringUtil.toStringTime = function(seconds){
    var hour = Math.floor(seconds/3600);
    var minute = Math.floor((seconds%3600)/60);
    var second = Math.floor(seconds-hour*3600-minute*60);
    return (hour>=10?hour:"0"+hour) + ":"+(minute>=10?minute:"0"+minute)+":"+(second>=10?second:"0"+second);
};

StringUtil.toStringWithLimitedWordPerLine = function(text, limitedWordPerLine){
    var count = 0;
    while (true){
        count+=limitedWordPerLine;
        if (count<text.length-1){
            var lastSpaceIndex = count;
            for (var i=count; i>=0; i--){
                if (text[i] == " "){
                    lastSpaceIndex = i;
                    break;
                }
            }
            var head = text.slice(0,lastSpaceIndex+1);
            var tail = text.slice(lastSpaceIndex);
            while ((tail.length>0) && (tail[0] == " ")){
                tail = tail.slice(1, tail.length);
            }
            text =  head+ "\n" + tail;
            count++;
        }
        else{
            break;
        }
    }
    return text;
};

