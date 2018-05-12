'use strict';

function GraphicEngine() {
    var DEG_TO_RAD = 0.0174532925199433;

    // Instance pointer
    var instance = this;


    //============================== IMAGE LOADER ===================================
    var imageNumber = 0;                 // Number of image in the array
    var imageLoadedNumber = 0;           // Number of completely loaded image
    var imageObjectArray = [];  // Image object array
    var imagePathArray = [];    // The path of the image array

    var globalAlpha = 1;

    var alphaMax = 255;

    /**
     * @return {number} id
     * */
        // Load an image right away ----------------------------------------
    this.LoadImage = function (path) {
        var searchPath = "src/Observer/";
        if (path && path.indexOf(searchPath) == -1) {
            path = searchPath + path;
        }
        cc.log('graphic engine load image', path);
        // Check if that image was already existed. Return id if existed.
        for (var i = 0; i < imageNumber; i++) {
            if (imagePathArray[i] == path) {
                return i;
            }
        }

        // If not existed, load it
        imagePathArray[imageNumber] = path;
        //imageObjectArray[imageNumber] = cc.spriteFrameCache.addSpriteFrames(path);
        //imageObjectArray[imageNumber].src = path;
        //imageObjectArray[imageNumber].onload = function () {
        //imageLoadedNumber++;
        //}
        cc.textureCache.addImageAsync(path, function () {
            ++imageLoadedNumber;
        });


        // Return id
        return imageNumber++;
    };
    // ------------------------------------------------------------------


    // Get image by ID --------------------------------------------------
    /**
     * @return sprite
     * */
    this.GetImage = function (id) {
        //return imageObjectArray[id];
        cc.log('GraphicEngine GetImage with id', id, imagePathArray[id]);
        return fr.createSprite(imagePathArray[id]);
    };
    // ------------------------------------------------------------------


    // Load an image when network is free -------------------------------
    this.LoadImageWhenNetworkFree = function (path) {

    };
    // ------------------------------------------------------------------


    // Get image loading progress, return from 0 to 1 -------------------
    /**@return number from 0 to 1*/
    this.GetLoadingProgress = function () {
        if (!imageNumber) {
            return 1;
        }
        return imageLoadedNumber / imageNumber;
    };
    // ------------------------------------------------------------------

    //============================== IMAGE LOADER ===================================


    //================================ RENDERER =====================================
    this.SetGlobalAlpha = function (alpha) {
        cc.log("GraphicEngine SetGlobalAlpha", alpha);
        globalAlpha = alpha;
    };

    // Clear entire canvas or a portion of it ---------------------------
    this.ClearCanvas = function (canvas, context, x, y, w, h) {
        cc.log("GraphicEngine ClearCanvas", !!canvas, !!context, x, y, w, h);
        if (x == null) x = 0;
        if (y == null) y = 0;
        if (w == null) w = CANVAS_W;
        if (h == null) x = CANVAS_H;

        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (canvas) {
            if (x + w > canvas.width) x = canvas.width - w;
            if (y + h > canvas.height) y = canvas.height - h;
            if (context.removeAllChildren) {
                context.removeAllChildren();
            }
        }
    };
    // ------------------------------------------------------------------


    this.CopyCanvas = function (desContext, sourceCanvas, sx, sy, sw, sh, dx, dy, dw, dh, alpha) {
        cc.log("GraphicEngine CopyCanvas", !!desContext, !!sourceCanvas, sx, sy, sw, sh, dx, dy, dw, dh, alpha);
        if (sourceCanvas && desContext) {
            if (sw == null) sw = sourceCanvas.width;
            if (sh == null) sh = sourceCanvas.height;
            if (dw == null) dw = sourceCanvas.width;
            if (dh == null) dh = sourceCanvas.height;

            if (sx < 0) sx = 0;
            if (sy < 0) sy = 0;
            if (sx + sw > sourceCanvas.width) sx = sourceCanvas.width - sw;
            if (sy + sh > sourceCanvas.height) sy = sourceCanvas.height - sh;

            if (alpha == null) alpha = 1;
            if (alpha > 1) alpha = 1;
            if (alpha < 0) alpha = 0;

            if (alpha * globalAlpha > 0) {
                desContext.opacity = alphaMax * alpha * globalAlpha;
                if (desContext.addChild) {
                    desContext.addChild(sourceCanvas);
                    //sx, sy, sw, sh, dx, dy, dw, dh
                    sourceCanvas.attr({
                        anchorX: 0,
                        anchorY: 0,
                        x: sx,
                        y: sy
                    });
                }
                desContext.opacity = alphaMax * globalAlpha;
            }
        } else {
            cc.error("not exist desContext or sourceCanvas ", !!desContext, !!sourceCanvas);
        }
    };


    this.FillCanvas = function (context, r, g, b, alpha, x, y, w, h) {
        cc.log("GraphicEngine FillCanvas", !!context, r, g, b, alpha, x, y, w, h);
        if (x == null) x = 0;
        if (y == null) y = 0;
        if (w == null) w = CANVAS_W;
        if (h == null) h = CANVAS_H;

        if (alpha == null) alpha = 1;
        if (alpha > 1) alpha = 1;
        if (alpha < 0) alpha = 0;

        if (context) {
            context.opacity = alphaMax * alpha * globalAlpha;
            context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            if (context.setColor) {
                context.setColor(cc.color(r, g, b));
                context.attr({
                    anchorX: 0,
                    anchorY: 0,
                    x: x,
                    y: y,
                    width: w,
                    height: h
                });
            }
            context.opacity = alphaMax * globalAlpha;
        } else {
            cc.error("not exist context", !!context);
        }
    };

    // Draw a loaded image to the canvas context ------------------------
    this.Draw = function (context, imageID, sx, sy, sw, sh, dx, dy, dw, dh, alpha, flipX, flipY, angle, cx, cy) {
        cc.log("GraphicEngine Draw with option:", !!context);
        cc.log("imageID", imageID, "sx", sx, "sy", sy,
            "sw", sw, "sh", sh,
            "dx", dx, "dy", dy,
            "dw", dw, "dh", dh,
            "alpha", alpha, "flipX", flipX, "flipY", flipY, "angle", angle,
            "cx", cx, "cy", cy);

        if (alpha == null) alpha = 1;

        if (alpha > 1) alpha = 1;
        if (alpha < 0) alpha = 0;

        if (flipX == null) flipX = 0;
        if (flipY == null) flipY = 0;
        if (angle == null) angle = 0;


        var image = instance.GetImage(imageID);

        var save = angle || flipX || flipY;

        if (save && context.retain) {
            cc.log('save --> retain context');
            context.retain();
        }

        var signX = (flipX == 0) ? 1 : -1;
        var signY = (flipY == 0) ? 1 : -1;

        if (flipX == 0 && flipY == 0) {

        }
        else if (flipX == 1 && flipY == 1) {
            context.setPosition(sw, sh);
            context.setScale(-1, -1);
        }
        else if (flipX == 1 && flipY == 0) {
            context.setPosition(sw, 0);
            context.setScale(-1, 1);
        }
        else if (flipX == 0 && flipY == 1) {
            context.setPosition(0, sh);
            context.setScale(1, -1);
        }


        if (cx == null) cx = dw * 0.5;
        if (cy == null) cy = dh * 0.5;
        var centerX = dx + cx;
        var centerY = dy + cy;


        if (angle != 0) {
            if (flipX == 0 && flipY == 0) {
                context.setPosition(centerX, centerY);
                context.setRotation(angle * DEG_TO_RAD * signX * signY);
                context.setPosition(-centerX, -centerY);
            }
            else if (flipX == 1 && flipY == 0) {
                context.setPosition(sw - centerX, centerY);
                context.setRotation(angle * DEG_TO_RAD * signX * signY);
                context.setPosition(-sw + centerX, -centerY);
            }
            else if (flipX == 0 && flipY == 1) {
                context.setPosition(centerX, sh - centerY);
                context.setRotation(angle * DEG_TO_RAD * signX * signY);
                context.setPosition(-centerX, -sh + centerY);
            }
            else if (flipX == 1 && flipY == 1) {
                context.setPosition(sw - centerX, sh - centerY);
                context.setRotation(angle * DEG_TO_RAD * signX * signY);
                context.setPosition(-sw + centerX, -sh + centerY);
            }
        }

        dx = dx * signX;
        dy = dy * signY;


        if (dw > 0 && dh > 0) {
            context.opacity = alphaMax * alpha * globalAlpha;
            context.addChild(image);
            //sx, sy, sw, sh, dx, dy, dw, dh
            image.attr({
                anchorX: 0,
                anchorY: 0,
                x: dx,
                y: dy,
                width: dw,
                height: dh
            });
            context.opacity = alphaMax * globalAlpha;
        }


        if (save && context.release) {
            cc.log('release context');
            context.release();
        }
    };
    // ------------------------------------------------------------------


    // Draw an image quickly without setting param ----------------------
    this.DrawFast = function (context, imageID, dx, dy) {
        cc.log("GraphicEngine Draw an image quickly without setting param", !!context);
        cc.log("imageID", imageID, "dx", dx, "dy", dy);
        var image = instance.GetImage(imageID);
        context.opacity = alphaMax * globalAlpha;
        context.addChild(image);
        image.attr({
            anchorX: 0,
            anchorY: 0,
            x: dx,
            y: dy
        });
        context.opacity = alphaMax;
    };
    // ------------------------------------------------------------------


    // Set draw mode
    this.SetDrawModeAddActive = function (context, active) {
        cc.log("GraphicEngine SetDrawModeAddActive Set draw mode", !!context);
        cc.log("active", active);
        if (active == true) {
            context.globalCompositeOperation = "lighter";
        }
        else {
            context.globalCompositeOperation = "source-over";
        }
    };


    // Draw text --------------------------------------------------------
    // Draw text with RGB color value.
    var LINE_HEIGHT = 1.5;


    this.DrawTextRGB = function (context, text, x, y, w, font, size, bold, italic, alignW, alignH, red, green, blue, alpha, breakLine, stroke, strokeR, strokeG, strokeB) {
        cc.log("GraphicEngine DrawTextRGB", !!context);
        cc.log("text", text, "x", x, "y", y, "w", w,
            "font", font, "size", size, "bold", bold, "italic", italic, "italic", italic,
            "more: ", alignW, alignH, red, green, blue, alpha
        );

        if (alpha == null) alpha = 1;
        if (alpha < 1) {
            context.opacity = alphaMax * alpha * globalAlpha;
        }

        if (font == null) font = res.FONT_GAME;
        if (size == null) size = 12;
        if (bold == true)
            font = res.FONT_GAME_BOLD;
        else
            bold = false;
        if (italic == true) {
            font = res.FONT_GAME_ITALIC;
            if (bold) {
                font = res.FONT_GAME_BOLD_ITALIC;
            }
        }
        else
            italic = false;

        if (alignW == null) alignW = cc.ALIGN_BOTTOM_LEFT;
        if (alignH == null) alignH = cc.ALIGN_TOP;

        var lb = new ccui.Text(text, font, size);
        lb.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        lb.setColor(cc.color(red, green, blue));
        lb.setTextAreaSize(cc.size(w, 0));
        context.addChild(lb);
        lb.attr({
            anchorX: 0,
            anchorY: 0,
            x: x,
            y: y
        });
        if (alpha < 1) {
            context.opacity = alphaMax * globalAlpha;
        }
    };
    // ------------------------------------------------------------------


    this.DrawCircle = function (context, centerX, centerY, radius, lineWidth, red, green, blue, alpha) {
        cc.log("GraphicEngine require DrawCircle", !!context, centerX, centerY, radius, lineWidth, red, green, blue, alpha);
        /*context.beginPath();
         context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
         context.lineWidth = lineWidth;
         context.strokeStyle = "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
         context.stroke();*/
    };

    this.DrawRect = function (context, x, y, w, h, lineWidth, red, green, blue, alpha) {
        cc.log("GraphicEngine require DrawRect", !!context, x, y, w, h, lineWidth, red, green, blue, alpha);
        /*context.beginPath();
         context.rect(x, y, w, h);
         context.lineWidth = lineWidth;
         context.strokeStyle = "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
         context.stroke();*/
    };
}


function DrawTextRequest(text, w, font, size, bold, italic, alignW, alignH, red, green, blue, breakLine, stroke, strokeR, strokeG, strokeB) {
    cc.log("GraphicEngine DrawTextRequest", text, w, font, size, bold, italic, alignW, alignH, red, green, blue, breakLine, stroke, strokeR, strokeG, strokeB);
    var instance = this;
    this.m_text = text;
    this.m_w = w;
    this.m_font = font;
    this.m_size = size;
    this.m_bold = bold;
    this.m_italic = italic;
    this.m_alignW = alignW;
    this.m_alignH = alignH;
    this.m_red = red;
    this.m_green = green;
    this.m_blue = blue;
    this.m_breakLine = breakLine;
    this.m_canvas = null;
    this.m_stroke = stroke;
    this.m_strokeR = strokeR;
    this.m_strokeG = strokeG;
    this.m_strokeB = strokeB;


    this.Compare = function (text, w, font, size, bold, italic, alignW, alignH, red, green, blue, breakLine, stroke, strokeR, strokeG, strokeB) {
        if (instance.m_text == text &&
            instance.m_w == w &&
            instance.m_font == font &&
            instance.m_size == size &&
            instance.m_bold == bold &&
            instance.m_italic == italic &&
            instance.m_alignW == alignW &&
            instance.m_alignH == alignH &&
            instance.m_red == red &&
            instance.m_green == green &&
            instance.m_blue == blue &&
            instance.m_breakLine == breakLine &&
            instance.m_stroke == stroke &&
            instance.m_strokeR == strokeR &&
            instance.m_strokeG == strokeG &&
            instance.m_strokeB == strokeB) {
            return true;
        }
    }
}

var textRequest = [];