/**
 * Created by GSN on 7/21/2015.
 */

var MathUtil={};
MathUtil.randomBetween = function(min, max){
    return (Math.random() * (max - min)) + min;
    //var tmp = (Math.random() * (max - min)) + min;
    //return tmp;
};

MathUtil.randomBetweenFloor = function(min, max){
    return Math.floor(MathUtil.randomBetween(min, max));
    //var tmp = Math.floor(MathUtil.randomBetween(min, max));
    //return tmp;
};

MathUtil.getSign = function(number){
    return number>0?1:-1;
};

MathUtil.getDistance = function(point1, point2){
    return Math.sqrt(Math.pow((point1.x-point2.x),2) + Math.pow(point1.y-point2.y, 2));
};

MathUtil.getAngleOfLine = function(point1, point2){
    var deltaX = point2.x-point1.x;
    var deltaY = point2.y-point1.y;
    var radian = Math.atan(deltaY/deltaX);
    if(deltaX < 0)
        radian+=Math.PI;

    return 180 - radian*180/Math.PI;
};

