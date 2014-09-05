"use strict";

var debug = false;

var ScrollArrowType = {
    ARROW_TOP:0,
    ARROW_RIGHT:1,
    ARROW_BOTTOM:2,
    ARROW_LEFT:3
};
var ScrollOverType = {
    NONE:0,
    OVER:1,
    ACTIVE:2,
    STABLE:3
};

var ArrowStatus = {
    upLeftArrowHover_downRightArrowNonActive:0,
    upLeftArrowActive_downRightArrowNonActive:1,
    upLeftArrowNonActive_downRightArrowHover:2,
    upLeftArrowNonActive_downRightArrowActive:3,
    upLeftArrowNonActive_downRightArrowNonActive:4,
    arrowHover:5
}

function GetClientWidth( elem ) {
    var _w = elem.clientWidth;
    if ( 0 != _w )
        return _w;

    var _string_w = "" + elem.style.width;
    if ( -1 < _string_w.indexOf( "%" ) )
        return 0;

    var _intVal = parseInt( _string_w );
    if ( !isNaN( _intVal ) && 0 < _intVal )
        return _intVal;

    return 0;
}
function GetClientHeight( elem ) {
    var _w = elem.clientHeight;
    if ( 0 != _w )
        return _w;

    var _string_w = "" + elem.style.height;
    if ( -1 < _string_w.indexOf( "%" ) )
        return 0;

    var _intVal = parseInt( _string_w );
    if ( !isNaN( _intVal ) && 0 < _intVal )
        return _intVal;

    return 0;
}

function CArrowDrawer( settings ) {
    // размер квадратика в пикселах
    this.Size = 16;
    this.SizeW = 16;
    this.SizeH = 16;
    this.IsRetina = false;

    // просто рисовать - неправильно. рисуется с антиалиазингом - и получается некрасиво
    /*this.ColorGradStart = {R:69, G:70, B:71};
     this.ColorGradEnd = {R:116, G:117, B:118};*/

    function HEXTORGB(colorHEX){
        return {
            R:parseInt(colorHEX.substring(0,2),16),
            G:parseInt(colorHEX.substring(2,4),16),
            B:parseInt(colorHEX.substring(4,6),16)
        }
    }
    this.ColorGradStart = [];
    this.ColorGradEnd = [];

    this.ColorGradStart[ScrollOverType.NONE] = HEXTORGB("cfcfcf")//{R:207, G:207, B:207};
    this.ColorGradEnd[ScrollOverType.NONE] = HEXTORGB("cfcfcf")//{R:207, G:207, B:207};

    this.ColorGradStart[ScrollOverType.OVER] = HEXTORGB("f1f1f1")//{R:241, G:241, B:241};
    this.ColorGradEnd[ScrollOverType.OVER] = HEXTORGB("f1f1f1")//{R:241, G:241, B:241};

    this.ColorGradStart[ScrollOverType.ACTIVE] = HEXTORGB("f1f1f1")//{R:207, G:207, B:207};
    this.ColorGradEnd[ScrollOverType.ACTIVE] = HEXTORGB("f1f1f1")//{R:207, G:207, B:207};

    this.ColorGradStart[ScrollOverType.STABLE] = HEXTORGB("cfcfcf")//{R:203, G:203, B:203};
    this.ColorGradEnd[ScrollOverType.STABLE] = HEXTORGB("cfcfcf")//{R:203, G:203, B:203};

    this.ColorBorder = settings && settings.strokeStyle ? settings.strokeStyle : "#BBBEC2";
    this.ColorBackNone = settings && settings.scrollBackgroundColor ? settings.scrollBackgroundColor : "#F4F4F4";
    this.ColorBackOver = "#cfcfcf"//settings && settings.scrollerColorOver ? settings.scrollerColorOver : "#D8DADC";
    this.ColorBackActive = "#848484"//settings && settings.scrollBackgroundColorHover ? settings.scrollBackgroundColorHover : "#7A7A7A";

    // вот такие мега настройки для кастомизации)
    this.IsDrawBorderInNoneMode = false;
    this.IsDrawBorders = true

    // имя - направление стрелки
    this.ImageLeft = null;
    this.ImageTop = null;
    this.ImageRight = null;
    this.ImageBottom = null;

    this.IsNeedInvertOnActive = settings && settings.isNeedInvertOnActive ? settings.isNeedInvertOnActive : false;
}
CArrowDrawer.prototype.InitSize = function ( sizeW, sizeH, is_retina ) {
    if ( ( sizeH == this.SizeH || sizeW == this.SizeW ) && is_retina == this.IsRetina && null != this.ImageLeft )
        return;

    this.SizeW = Math.max( sizeW, 1 );
    this.SizeH = Math.max( sizeH, 1 );
    this.IsRetina = is_retina;

    if ( this.IsRetina ) {
        this.SizeW <<= 1;
        this.SizeH <<= 1;
    }

    this.ImageLeft = [document.createElement( 'canvas' ), document.createElement( 'canvas' ), document.createElement( 'canvas' ), document.createElement( 'canvas' )];
    this.ImageTop = [document.createElement( 'canvas' ), document.createElement( 'canvas' ), document.createElement( 'canvas' ), document.createElement( 'canvas' )];
    this.ImageRight = [document.createElement( 'canvas' ), document.createElement( 'canvas' ), document.createElement( 'canvas' ), document.createElement( 'canvas' )];
    this.ImageBottom = [document.createElement( 'canvas' ), document.createElement( 'canvas' ), document.createElement( 'canvas' ), document.createElement( 'canvas' )];

    this.ImageLeft[ScrollOverType.NONE].width = this.SizeW;
    this.ImageLeft[ScrollOverType.NONE].height = this.SizeH;
    this.ImageLeft[ScrollOverType.OVER].width = this.SizeW;
    this.ImageLeft[ScrollOverType.OVER].height = this.SizeH;
    this.ImageLeft[ScrollOverType.ACTIVE].width = this.SizeW;
    this.ImageLeft[ScrollOverType.ACTIVE].height = this.SizeH;
    this.ImageLeft[ScrollOverType.STABLE].width = this.SizeW;
    this.ImageLeft[ScrollOverType.STABLE].height = this.SizeH;

    this.ImageTop[ScrollOverType.NONE].width = this.SizeW;
    this.ImageTop[ScrollOverType.NONE].height = this.SizeH;
    this.ImageTop[ScrollOverType.OVER].width = this.SizeW;
    this.ImageTop[ScrollOverType.OVER].height = this.SizeH;
    this.ImageTop[ScrollOverType.ACTIVE].width = this.SizeW;
    this.ImageTop[ScrollOverType.ACTIVE].height = this.SizeH;
    this.ImageTop[ScrollOverType.STABLE].width = this.SizeW;
    this.ImageTop[ScrollOverType.STABLE].height = this.SizeH;

    this.ImageRight[ScrollOverType.NONE].width = this.SizeW;
    this.ImageRight[ScrollOverType.NONE].height = this.SizeH;
    this.ImageRight[ScrollOverType.OVER].width = this.SizeW;
    this.ImageRight[ScrollOverType.OVER].height = this.SizeH;
    this.ImageRight[ScrollOverType.ACTIVE].width = this.SizeW;
    this.ImageRight[ScrollOverType.ACTIVE].height = this.SizeH;
    this.ImageRight[ScrollOverType.STABLE].width = this.SizeW;
    this.ImageRight[ScrollOverType.STABLE].height = this.SizeH;

    this.ImageBottom[ScrollOverType.NONE].width = this.SizeW;
    this.ImageBottom[ScrollOverType.NONE].height = this.SizeH;
    this.ImageBottom[ScrollOverType.OVER].width = this.SizeW;
    this.ImageBottom[ScrollOverType.OVER].height = this.SizeH;
    this.ImageBottom[ScrollOverType.ACTIVE].width = this.SizeW;
    this.ImageBottom[ScrollOverType.ACTIVE].height = this.SizeH;
    this.ImageBottom[ScrollOverType.STABLE].width = this.SizeW;
    this.ImageBottom[ScrollOverType.STABLE].height = this.SizeH;


    var len = 6;
    if ( this.SizeH < 6 )
        return;
//        else (this.SizeH > 12)
//        len = this.Size - 8;

    // теперь делаем нечетную длину
    if ( 0 == (len & 1) )
        len += 1;

    var countPart = (len + 1) >> 1,
        plusColor, _data, px,
        _x = ((this.SizeW - len) >> 1),
        _y = this.SizeH - ((this.SizeH - countPart) >> 1),
        _radx = _x + (len >> 1),
        _rady = _y - (countPart >> 1),
        ctx_lInactive, ctx_tInactive, ctx_rInactive, ctx_bInactive,
        r, g, b;

    for ( var index = 0; index < this.ImageTop.length; index++ ) {
        var __x = _x, __y = _y, _len = len;
        r = this.ColorGradStart[index].R;
        g = this.ColorGradStart[index].G;
        b = this.ColorGradStart[index].B;

        ctx_tInactive = this.ImageTop[index].getContext( '2d' );
        ctx_lInactive = this.ImageLeft[index].getContext( '2d' );
        ctx_rInactive = this.ImageRight[index].getContext( '2d' );
        ctx_bInactive = this.ImageBottom[index].getContext( '2d' );

        plusColor = (this.ColorGradEnd[index].R - this.ColorGradStart[index].R) / countPart;

        _data = ctx_tInactive.createImageData( this.SizeW, this.SizeH );
        px = _data.data;

        while ( _len > 0 ) {
            var ind = 4 * ( this.SizeW * __y + __x );
            for ( var i = 0; i < _len; i++ ) {
                px[ind++] = r;
                px[ind++] = g;
                px[ind++] = b;
                px[ind++] = 255;
            }

            r = (r + plusColor) >> 0;
            g = (g + plusColor) >> 0;
            b = (b + plusColor) >> 0;

            __x += 1;
            __y -= 1;
            _len -= 2;
        }

        ctx_tInactive.putImageData( _data, 0, 0 );

        ctx_lInactive.translate( _radx - 1, _rady + 2 );
        ctx_lInactive.rotate( -Math.PI / 2 );
        ctx_lInactive.translate( -_radx, -_rady );
        ctx_lInactive.drawImage( this.ImageTop[index], 0, 0 );

        ctx_rInactive.translate( _radx + 2, _rady + 1 );
        ctx_rInactive.rotate( Math.PI / 2 );
        ctx_rInactive.translate( -_radx, -_rady );
        ctx_rInactive.drawImage( this.ImageTop[index], 0, 0 );

        ctx_bInactive.translate( _radx + 1, _rady + 3 );
        ctx_bInactive.rotate( Math.PI );
        ctx_bInactive.translate( -_radx, -_rady );
        ctx_bInactive.drawImage( this.ImageTop[index], 0, 0 );

    }

    if ( this.IsRetina ) {
        this.SizeW >>= 1;
        this.SizeH >>= 1;
    }
}
CArrowDrawer.prototype.drawArrow = function ( type, mode, ctx, w, h ) {

    if ( mode === null || mode === undefined ) {
        mode = ScrollOverType.NONE;
    }

    var img = this.ImageTop[mode],
        x = 0, y = 0, is_vertical = true,
        bottomRightDelta = 4;

    switch ( type ) {
        case ScrollArrowType.ARROW_LEFT:
        {
            x = -1;
            is_vertical = false;
            img = this.ImageLeft[mode];
            break;
        }
        case ScrollArrowType.ARROW_RIGHT:
        {
            is_vertical = false;
            x = w - this.SizeW - bottomRightDelta;
            img = this.ImageRight[mode];
            break;
        }
        case ScrollArrowType.ARROW_BOTTOM:
        {
            y = h - this.SizeH - bottomRightDelta;
            img = this.ImageBottom[mode];
            break;
        }
        default:
            y = -1;
            break;
    }

    ctx.lineWidth = 1;
    var strokeW = is_vertical ? this.SizeW - 1 : this.SizeW - 1;
    var strokeH = is_vertical ? this.SizeH - 1 : this.SizeH - 1;

    var xDeltaIMG = 2, yDeltaIMG = 0, xDeltaBORDER = 2.5, yDeltaBORDER = 2.5;
    ctx.fillStyle = this.ColorBackNone;
    ctx.fillRect( x + .5, y + .5, strokeW + 2.5, strokeH + 2.5 );
    ctx.beginPath();

    switch ( mode ) {
        case ScrollOverType.NONE:
        {

            ctx.drawImage( img, x + xDeltaIMG, y + yDeltaIMG, this.SizeW, this.SizeH );
//            ctx.strokeStyle = this.ColorBackNone;
//            ctx.rect( x + 2.5, y + 1.5, strokeW, strokeH );
//            if ( this.IsDrawBorders ) {
//                ctx.strokeStyle = this.ColorBorder;
//                ctx.rect( x + 2.5, y + 1.5, strokeW, strokeH );
//                ctx.stroke();
//            }
            break;
        }
        case ScrollOverType.OVER:
        {
            ctx.fillStyle = this.ColorBackOver;
//            ctx.fill();

//            ctx.fillStyle = this.ColorBackNone;
//            ctx.fillRect( x + .5, y + .5, strokeW+2.5, strokeH+2.5 );

            ctx.fillRect( x + 2, y + 2, strokeW + 1, strokeH + 1 );
            ctx.drawImage( img, x + xDeltaIMG, y + yDeltaIMG, this.SizeW, this.SizeH );
            /*if ( this.IsDrawBorders ) {
             ctx.strokeStyle = this.ColorBorder;
             ctx.rect( x + xDeltaBORDER, y + yDeltaBORDER, strokeW, strokeH );
             ctx.stroke();
             }*/
            break;
        }
        case ScrollOverType.ACTIVE:
        {
            ctx.fillStyle = this.ColorBackActive;
            ctx.fillRect( x + 2, y + 2, strokeW + 1, strokeH + 1 );
//            ctx.fill();

            if ( !this.IsNeedInvertOnActive ) {
                ctx.drawImage( img, x + xDeltaIMG, y + yDeltaIMG, this.SizeW, this.SizeH );
//                ctx.rect( x + xDeltaBORDER, y + yDeltaBORDER, strokeW, strokeH );
            }
            else {
                // slow method
                var _ctx = img.getContext( "2d" );

                var _data = _ctx.getImageData( 0, 0, this.SizeW, this.SizeH );
                var _data2 = _ctx.getImageData( 0, 0, this.SizeW, this.SizeH );

                var _len = 4 * this.SizeW * this.SizeH;
                for ( var i = 0; i < _len; i += 4 ) {
                    if ( _data.data[i + 3] == 255 ) {
                        _data.data[i] = 255;// - _data.data[i];
                        _data.data[i + 1] = 255;// - _data.data[i + 1];
                        _data.data[i + 2] = 255;// - _data.data[i + 2];
                    }
                }

                _ctx.putImageData( _data, 0, 0 );
                ctx.drawImage( img, x + xDeltaIMG, y + yDeltaIMG, this.SizeW, this.SizeH );

                for ( var i = 0; i < _len; i += 4 ) {
                    if ( _data.data[i + 3] == 255 ) {
                        _data.data[i] = 255 - _data.data[i];
                        _data.data[i + 1] = 255 - _data.data[i + 1];
                        _data.data[i + 2] = 255 - _data.data[i + 2];
                    }
                }
                _ctx.putImageData( _data2, 0, 0 );

                _data = null;
                _data2 = null;
            }
            /*if ( this.IsDrawBorders ) {
             ctx.strokeStyle = this.ColorBorder;
             ctx.rect( x + xDeltaBORDER, y + yDeltaBORDER, strokeW, strokeH );
             ctx.stroke();
             }*/
            break;
        }
        case ScrollOverType.STABLE:
        {
            ctx.drawImage( img, x + xDeltaIMG, y + yDeltaIMG, this.SizeW, this.SizeH );
            ctx.strokeStyle = this.ColorBackNone;
            if ( this.IsDrawBorders ) {
                ctx.strokeStyle = this.ColorBorder;
                ctx.rect( x + xDeltaBORDER, y + yDeltaBORDER, strokeW, strokeH );
                ctx.stroke();
            }
            break;
        }
        default:
            break;
    }

    ctx.beginPath();
}

/**
 * @constructor
 */
function ScrollObject( elemID, settings, dbg ) {
    if ( dbg )
        debug = dbg;
    var that = this;
    this.that = this;

    var extendSettings = function ( settings1, settings2 ) {
        var _st = {};
        if ( settings1 == null || settings1 == undefined )
            return settings2;
        else for ( var _item in settings1 ) {
            if ( typeof settings1[_item] === "object" )
                _st[_item] = extendSettings( _st, settings1[_item] );
            else
                _st[_item] = settings1[_item];
        }
        for ( var _item in settings2 ) {
            if ( !_st.hasOwnProperty( _item ) ) {
                if ( typeof settings2[_item] === "object" )
                    _st[_item] = extendSettings( _st, settings2[_item] );
                else
                    _st[_item] = settings2[_item];
            }
        }
        return _st;
    }

    function HEXTORGB(colorHEX){
        return {
            R:parseInt(colorHEX.substring(0,2),16),
            G:parseInt(colorHEX.substring(2,4),16),
            B:parseInt(colorHEX.substring(4,6),16)
        }
    }

    var scrollSettings = {
        showArrows:false,
        screenW:-1,
        screenH:-1,
        scrollerMinHeight:34,
        scrollerMaxHeight:99999,
        scrollerMinWidth:34,
        scrollerMaxWidth:99999,
        initialDelay:300,
        arrowRepeatFreq:50,
        trackClickRepeatFreq:70,
        scrollPagePercent:1. / 8,
        arrowDim:17,
        scrollerColor:"#f1f1f1",
        scrollerColorOver:"#cfcfcf",
        scrollerColorActive:"#cfcfcf",
        scrollBackgroundColor:"#F1F1F1",
        scrollBackgroundColorHover:"#F1F1F1",
        strokeStyle:"#cfcfcf",
        vscrollStep:10,
        hscrollStep:10,
        wheelScrollLines:1,
        arrowNormalColor : "#000000",
        arrowNormalBorderColor : "#000000",
        arrowNormalBackgroundColor : "#000000",
        arrowStableColor : "#000000",
        arrowStableBorderColor : "#000000",
        arrowStableBackgroundColor : "#000000",
        arrowOverColor : "#000000",
        arrowOverBorderColor : "#000000",
        arrowOverBackgroundColor : "#000000",
        arrowActiveColor : "#000000",
        arrowActiveBorderColor : "#000000",
        arrowActiveBackgroundColor : "#000000"
    };

    this.settings = extendSettings( settings, scrollSettings );

    this.ArrowDrawer = new CArrowDrawer( this.settings );

    this.mouseUp = false;
    this.mouseDown = false;

    this.that.mouseover = false;

    this.that.mouseOverOut = -1;

    this.scrollerMouseDown = false;
    this.scrollerStatus = ScrollOverType.NONE;

    this.moveble = false;
    this.lock = false;
    this.scrollTimeout = null;

    this.StartMousePosition = {x:0, y:0};
    this.EndMousePosition = {x:0, y:0};

    this.dragMinY = 0;
    this.dragMaxY = 0;

    this.scrollVCurrentY = 0;
    this.scrollHCurrentX = 0;
    this.arrowPosition = 0;

    this.verticalTrackHeight = 0;
    this.horizontalTrackWidth = 0;

    this.paneHeight = 0;
    this.paneWidth = 0;

    this.maxScrollY = 2000;
    this.maxScrollX = 2000;

    this.scrollCoeff = 0;

    this.scroller = {x:0, y:1, h:0, w:0};

    this.canvas = null;
    this.context = null;

    this.eventListeners = [];

    this.IsRetina = false;
    this.canvasW = 1;
    this.canvasH = 1;

    this.ScrollOverType1 = -1;
    this.ScrollOverType2 = -1;

    if ( window.devicePixelRatio == 2 )
        this.IsRetina = true;

    this.piperImgVert = [document.createElement( 'canvas' ),document.createElement( 'canvas' )]
    this.piperImgHor = [document.createElement( 'canvas' ),document.createElement( 'canvas' )]

    this.piperImgVert[0].width = 5;
    this.piperImgVert[0].height = 13;
    this.piperImgVert[1].width = 5;
    this.piperImgVert[1].height = 13;

    this.piperImgHor[0].width = 13;
    this.piperImgHor[0].height = 5;
    this.piperImgHor[1].width = 13;
    this.piperImgHor[1].height = 5;

    var r, g, b, ctx_piperImg, _data, px;
    r = HEXTORGB("CFCFCF");
    g = r.G;
    b = r.B;
    r = r.R;

    for(var index = 0; index < this.piperImgVert.length; index++){
        ctx_piperImg= this.piperImgVert[index].getContext( '2d' );
        _data = ctx_piperImg.createImageData( this.piperImgVert[index].width, this.piperImgVert[index].height );
        px = _data.data;

        for ( var i = 0; i < this.piperImgVert[index].width * this.piperImgVert[index].height * 4; ) {
            px[i++] = r;
            px[i++] = g;
            px[i++] = b;
            px[i++] = 255;
            i = ( i % 20 === 0 ) ? i + 20 : i
        }

        ctx_piperImg.putImageData( _data, 0, 0 )

        ctx_piperImg = this.piperImgHor[index].getContext( '2d' );

        _data = ctx_piperImg.createImageData( this.piperImgHor[index].width, this.piperImgHor[index].height );
        px = _data.data;

        for ( var i = 0; i < this.piperImgHor[index].width * this.piperImgHor[index].height * 4; ) {
            px[i++] = r;
            px[i++] = g;
            px[i++] = b;
            px[i++] = 255;
            i = ( i % 4 === 0 && i % 52 !== 0 ) ? i + 4 : i
        }

        ctx_piperImg.putImageData( _data, 0, 0 )

        r = HEXTORGB("F1F1F1");
        g = r.G;
        b = r.B;
        r = r.R;

    }

    this._init( elemID );
}
ScrollObject.prototype = {

    _init:function ( elemID ) {
        if ( !elemID ) return false;

        var holder = document.getElementById( elemID );

        if ( holder.getElementsByTagName( 'canvas' ).length == 0 )
            this.canvas = holder.appendChild( document.createElement( "CANVAS" ) );
        else {
            this.canvas = holder.children[1];
        }

        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";

        this.canvas.that = this;
        this.canvas.style.zIndex = 100;
        this.canvas.style.position = "absolute";
        this.canvas.style.top = "0px";
        if ( navigator.userAgent.toLowerCase().indexOf( "webkit" ) != -1 )
            this.canvas.style.webkitUserSelect = "none";

        this.context = this.canvas.getContext( '2d' );
        if ( !this.IsRetina )
            this.context.setTransform( 1, 0, 0, 1, 0, 0 );
        else
            this.context.setTransform( 2, 0, 0, 2, 0, 0 );

        if ( this.settings.showArrows )
            this.arrowPosition = this.settings.arrowDim + 2;

        this._setDimension( holder.clientHeight, holder.clientWidth );
        this.maxScrollY = holder.firstElementChild.clientHeight - this.settings.screenH > 0 ? holder.firstElementChild.clientHeight - this.settings.screenH : 0;
        this.maxScrollX = holder.firstElementChild.clientWidth - this.settings.screenW > 0 ? holder.firstElementChild.clientWidth - this.settings.screenW : 0;

        this.isVerticalScroll = holder.firstElementChild.clientHeight / Math.max( this.canvasH, 1 ) > 1;
        this.isHorizontalScroll = holder.firstElementChild.clientWidth / Math.max( this.canvasW, 1 ) > 1;

        this._setScrollerHW();

        this.paneHeight = this.canvasH - this.arrowPosition * 2;
        this.paneWidth = this.canvasW - this.arrowPosition * 2;

        this.RecalcScroller();

        this.canvas.onmousemove = this.evt_mousemove;
        this.canvas.onmouseout = this.evt_mouseout;
        this.canvas.onmouseup = this.evt_mouseup;
        this.canvas.onmousedown = this.evt_mousedown;
        this.canvas.onmousewheel = this.evt_mousewheel;
        this.canvas.onmouseover = this.evt_mouseover;

        var _that = this;
        this.canvas.ontouchstart = function ( e ) {
            _that.evt_mousedown( e.touches[0] );
            return false;
        }
        this.canvas.ontouchmove = function ( e ) {
            _that.evt_mousemove( e.touches[0] );
            return false;
        }
        this.canvas.ontouchend = function ( e ) {
            _that.evt_mouseup( e.changedTouches[0] );
            return false;
        }

        if ( this.canvas.addEventListener )
            this.canvas.addEventListener( 'DOMMouseScroll', this.evt_mousewheel, false );
        this._draw();
        this._drawArrow();

        return true;
    },
    getMousePosition:function ( evt ) {
        // get canvas position
        var obj = this.canvas;
        var top = 0;
        var left = 0;
        while ( obj && obj.tagName != 'BODY' ) {
            top += obj.offsetTop;
            left += obj.offsetLeft;
            obj = obj.offsetParent;
        }

        // return relative mouse position
        var mouseX = evt.clientX - left + window.pageXOffset;
        var mouseY = evt.clientY - top + window.pageYOffset;
        return {
            x:mouseX,
            y:mouseY
        };
    },
    RecalcScroller:function ( startpos ) {
        if ( this.isVerticalScroll ) {
            if ( this.settings.showArrows ) {
                this.verticalTrackHeight = this.canvasH - this.arrowPosition * 2;
                this.scroller.y = this.arrowPosition + 1;
            }
            else {
                this.verticalTrackHeight = this.canvasH;
                this.scroller.y = 1;
            }
            var percentInViewV;

            percentInViewV = (this.maxScrollY + this.paneHeight ) / this.paneHeight;
            this.scroller.h = Math.ceil( 1 / percentInViewV * this.verticalTrackHeight ) + 1;

            if ( this.scroller.h < this.settings.scrollerMinHeight )
                this.scroller.h = this.settings.scrollerMinHeight;
            else if ( this.scroller.h > this.settings.scrollerMaxHeight )
                this.scroller.h = this.settings.scrollerMaxHeight;
            this.scrollCoeff = this.maxScrollY / Math.max( 1, this.paneHeight - this.scroller.h );
            if ( startpos ) {
                this.scroller.y = startpos / this.scrollCoeff + this.arrowPosition;
            }
            this.dragMaxY = this.canvasH - this.arrowPosition - this.scroller.h;
            this.dragMinY = this.arrowPosition;
        }

        if ( this.isHorizontalScroll ) {
            if ( this.settings.showArrows ) {
                this.horizontalTrackWidth = this.canvasW - this.arrowPosition * 2;
                this.scroller.x = this.arrowPosition + 1;
            }
            else {
                this.horizontalTrackWidth = this.canvasW;
                this.scroller.x = 1;
            }
            var percentInViewH;
            percentInViewH = ( this.maxScrollX + this.paneWidth ) / this.paneWidth;
            this.scroller.w = Math.ceil( 1 / percentInViewH * this.horizontalTrackWidth );

            if ( this.scroller.w < this.settings.scrollerMinWidth )
                this.scroller.w = this.settings.scrollerMinWidth
            else if ( this.scroller.w > this.settings.scrollerMaxWidth )
                this.scroller.w = this.settings.scrollerMaxWidth;
            this.scrollCoeff = this.maxScrollX / Math.max( 1, this.paneWidth - this.scroller.w );
            if ( typeof startpos !== "undefined" ) {
                this.scroller.x = startpos / this.scrollCoeff + this.arrowPosition;
            }
            this.dragMaxX = this.canvasW - this.arrowPosition - this.scroller.w;
            this.dragMinX = this.arrowPosition;
        }
    },
    Repos:function ( settings, bIsHorAttack, bIsVerAttack ) {

        var _parentClientW = GetClientWidth( this.canvas.parentNode );
        var _parentClientH = GetClientHeight( this.canvas.parentNode );

        var _firstChildW = GetClientWidth( this.canvas.parentNode.firstElementChild );
        var _firstChildH = GetClientHeight( this.canvas.parentNode.firstElementChild );

        this._setDimension( _parentClientH, _parentClientW );
        this.maxScrollY = _firstChildH - settings.screenH > 0 ? _firstChildH - settings.screenH : 0;
        this.maxScrollX = _firstChildW - settings.screenW > 0 ? _firstChildW - settings.screenW : 0;

        this.isVerticalScroll = _firstChildH / Math.max( this.canvasH, 1 ) > 1 || this.isVerticalScroll || (true === bIsVerAttack);
        this.isHorizontalScroll = _firstChildW / Math.max( this.canvasW, 1 ) > 1 || this.isHorizontalScroll || (true === bIsHorAttack);
        this._setScrollerHW();

        this.paneHeight = this.canvasH - this.arrowPosition * 2;
        this.paneWidth = this.canvasW - this.arrowPosition * 2;
        this.RecalcScroller();
        if ( this.isVerticalScroll ) {
            this.scrollToY( this.scrollVCurrentY );
        }

        if ( this.isHorizontalScroll ) {
            this.scrollToX( this.scrollHCurrentX );
        }
        this._draw();
        this._drawArrow();
    },
    Reinit:function ( settings, pos ) {
        this._setDimension( this.canvas.parentNode.clientHeight, this.canvas.parentNode.clientWidth );
        this.maxScrollY = this.canvas.parentNode.firstElementChild.clientHeight - (settings.screenH || this.canvas.parentNode.offsetHeight) > 0 ?
            this.canvas.parentNode.firstElementChild.clientHeight - (settings.screenH || this.canvas.parentNode.offsetHeight) :
            0;

        this.maxScrollX = this.canvas.parentNode.firstElementChild.clientWidth - (settings.screenH || this.canvas.parentNode.offsetWidth) > 0 ?
            this.canvas.parentNode.firstElementChild.clientWidth - (settings.screenH || this.canvas.parentNode.offsetWidth) :
            0;

        this.isVerticalScroll = this.canvas.parentNode.firstElementChild.clientHeight / Math.max( this.canvasH, 1 ) > 1 || this.isVerticalScroll;
        this.isHorizontalScroll = this.canvas.parentNode.firstElementChild.clientWidth / Math.max( this.canvasW, 1 ) > 1 || this.isHorizontalScroll;
        this._setScrollerHW();

        this.paneHeight = this.canvasH - this.arrowPosition * 2;
        this.paneWidth = this.canvasW - this.arrowPosition * 2;
        this.RecalcScroller();
        this.reinit = true;
        if ( this.isVerticalScroll ) {
            pos !== undefined ? this.scrollByY( pos - this.scrollVCurrentY ) : this.scrollToY( this.scrollVCurrentY );
        }

        if ( this.isHorizontalScroll ) {
            pos !== undefined ? this.scrollByX( pos - this.scrollHCurrentX ) : this.scrollToX( this.scrollHCurrentX );
        }
        this.reinit = false;
        this._draw();
        this._drawArrow();
    },
    _scrollV:function ( that, evt, pos, isTop, isBottom, bIsAttack ) {
        if ( !this.isVerticalScroll ) {
            return;
        }

        if ( that.scrollVCurrentY !== pos || bIsAttack === true ) {
            that.scrollVCurrentY = pos;
            evt.scrollD = evt.scrollPositionY = that.scrollVCurrentY;
            evt.maxScrollY = that.maxScrollY;

            that._draw();
            that._drawArrow();
            that.handleEvents( "onscrollvertical", evt );
        }
        else if ( that.scrollVCurrentY === pos && pos > 0 && !this.reinit && !this.moveble && !this.lock ) {
            evt.pos = pos;
            that.handleEvents( "onscrollVEnd", evt );
        }
    },
    _correctScrollV:function ( that, yPos ) {
        if ( !this.isVerticalScroll )
            return null;

        var events = that.eventListeners["oncorrectVerticalScroll"];
        if ( events ) {
            if ( events.length != 1 )
                return null;

            return events[0].handler.apply( that, [yPos] );
        }
        return null;
    },
    _correctScrollByYDelta:function ( that, delta ) {
        if ( !this.isVerticalScroll )
            return null;

        var events = that.eventListeners["oncorrectVerticalScrollDelta"];
        if ( events ) {
            if ( events.length != 1 )
                return null;

            return events[0].handler.apply( that, [delta] );
        }
        return null;
    },
    _scrollH:function ( that, evt, pos, isTop, isBottom ) {
        if ( !this.isHorizontalScroll ) {
            return;
        }
        if ( that.scrollHCurrentX !== pos ) {
            that.scrollHCurrentX = pos;
            evt.scrollD = evt.scrollPositionX = that.scrollHCurrentX;
            evt.maxScrollX = that.maxScrollX;

            that._draw();
            that._drawArrow();
            that.handleEvents( "onscrollhorizontal", evt );
        }
        else if ( that.scrollHCurrentX === pos && pos > 0 && !this.reinit && !this.moveble && !this.lock ) {
            evt.pos = pos;
            that.handleEvents( "onscrollHEnd", evt );
        }

    },
    scrollByY:function ( delta, bIsAttack ) {
        if ( !this.isVerticalScroll ) {
            return;
        }

        var result = this._correctScrollByYDelta( this, delta );
        if ( result != null && result.isChange === true )
            delta = result.Pos;

        var destY = this.scrollVCurrentY + delta, isTop = false, isBottom = false, vend = false;

        if ( destY < 0 ) {
            destY = 0;
            isTop = true;
            isBottom = false;
        }
        else if ( destY > this.maxScrollY ) {
            // Новое смещение превышает maxScroll, надо вызвать ивент, спрашивающий что делать.
            // Чтобы не создавать новый, использую onscrollVEnd, он все равно больше нигде не используется
            // 50 = max число wheelScrollLine, если она больше, то будет работать неправильно
            for ( var c = 50; destY > this.maxScrollY && c > 0; --c ) {
                this.handleEvents( "onscrollVEnd", {} );
                vend = true;
            }
            if ( destY > this.maxScrollY ) {
                // Обработчик onscrollVEnd решил, что расширение области скрола не нужно, изменяем destY
                destY = this.maxScrollY;
            }
            isTop = false, isBottom = true;
        }

        this.scroller.y = destY / Math.max( 1, this.scrollCoeff ) + this.arrowPosition;
        if ( this.scroller.y < this.dragMinY )
            this.scroller.y = this.dragMinY + 1;
        else if ( this.scroller.y > this.dragMaxY )
            this.scroller.y = this.dragMaxY;

        var arrow = this.settings.showArrows ? this.arrowPosition : 0;
        if( this.scroller.y + this.scroller.h > this.canvasH - arrow - 2 ){
            this.scroller.y -= Math.abs(this.canvasH - arrow - 2 - this.scroller.y - this.scroller.h);
        }

        if ( vend ) {
            this.moveble = true;
        }
        this._scrollV( this, {}, destY, isTop, isBottom, bIsAttack );
        if ( vend ) {
            this.moveble = false;
        }
    },
    scrollToY:function ( destY ) {
        if ( !this.isVerticalScroll ) {
            return;
        }

        this.scroller.y = destY / Math.max( 1, this.scrollCoeff ) + this.arrowPosition;
        if ( this.scroller.y < this.dragMinY )
            this.scroller.y = this.dragMinY + 1;
        else if ( this.scroller.y > this.dragMaxY )
            this.scroller.y = this.dragMaxY;

        var arrow = this.settings.showArrows ? this.arrowPosition : 0;
        if( this.scroller.y + this.scroller.h > this.canvasH - arrow - 2 ){
            this.scroller.y -= Math.abs(this.canvasH - arrow - 2 - this.scroller.y - this.scroller.h);
        }

        this._scrollV( this, {}, destY, false, false );
    },
    scrollByX:function ( delta ) {
        if ( !this.isHorizontalScroll ) {
            return;
        }
        var destX = this.scrollHCurrentX + delta, isTop = false, isBottom = false, hend = false;

        if ( destX < 0 ) {
            destX = 0;
            isTop = true;
            isBottom = false;
        }
        else if ( destX > this.maxScrollX ) {
            for ( var c = 50; destX > this.maxScrollX && c > 0; --c ) {
                this.handleEvents( "onscrollHEnd", {} );
                hend = true;
            }
            if ( destX > this.maxScrollX ) {
                destX = this.maxScrollX;
            }
            isTop = false, isBottom = true;
        }

        this.scroller.x = destX / Math.max( 1, this.scrollCoeff ) + this.arrowPosition;
        if ( this.scroller.x < this.dragMinX )
            this.scroller.x = this.dragMinX + 1;
        else if ( this.scroller.x > this.dragMaxX )
            this.scroller.x = this.dragMaxX;

        if ( hend ) {
            this.moveble = true;
        }
        this._scrollH( this, {}, destX, isTop, isBottom );
        if ( hend ) {
            this.moveble = true;
        }
    },
    scrollToX:function ( destX ) {
        if ( !this.isHorizontalScroll ) {
            return;
        }

        this.scroller.x = destX / Math.max( 1, this.scrollCoeff ) + this.arrowPosition;
        if ( this.scroller.x < this.dragMinX )
            this.scroller.x = this.dragMinX + 1;
        else if ( this.scroller.x > this.dragMaxX )
            this.scroller.x = this.dragMaxX;

        this._scrollH( this, {}, destX, false, false );
    },
    scrollTo:function ( destX, destY ) {
        this.scrollToX( destX );
        this.scrollToY( destY );
    },
    scrollBy:function ( deltaX, deltaY ) {
        this.scrollByX( deltaX );
        this.scrollByY( deltaY );
    },

    roundRect:function ( x, y, width, height, radius ) {
        if ( typeof radius === "undefined" ) {
            radius = 1;
        }
        this.context.beginPath();
        this.context.moveTo( x + radius, y );
        this.context.lineTo( x + width - radius, y );
        this.context.quadraticCurveTo( x + width, y, x + width, y + radius );
        this.context.lineTo( x + width, y + height - radius );
        this.context.quadraticCurveTo( x + width, y + height, x + width - radius, y + height );
        this.context.lineTo( x + radius, y + height );
        this.context.quadraticCurveTo( x, y + height, x, y + height - radius );
        this.context.lineTo( x, y + radius );
        this.context.quadraticCurveTo( x, y, x + radius, y );
        this.context.closePath();
    },

    _clearContent:function () {
        this.context.clearRect( 0, 0, this.canvasW, this.canvasH );
    },
    _draw:function () {
        // очистку не нужно делать - если потом рисовать рект такой же
        //this._clearContent();
        var piperImgIndex = 0;
        this.context.beginPath();

        if ( this.isVerticalScroll ) {
            var _y = this.settings.showArrows ? this.arrowPosition : 0,
                _h = this.canvasH - (_y << 1);

            if ( _h > 0 ){
                this.context.rect( 1, _y, this.canvasW, _h );
            }
        }
        else if ( this.isHorizontalScroll ) {
            var _x = this.settings.showArrows ? this.arrowPosition : 0,
                _w = this.canvasW - (_x << 1);

            if ( _w > 0 ){
                this.context.rect( _x, 1, _w, this.canvasH );
            }
        }

        switch ( this.scrollerStatus ) {

            case ScrollOverType.OVER:
            case ScrollOverType.ACTIVE:
            {
                this.context.fillStyle = this.settings.scrollBackgroundColorHover;
                break;
            }
            case ScrollOverType.NONE:
            default:
            {
                this.context.fillStyle = this.settings.scrollBackgroundColor;
                break;
            }

        }

        this.context.fill();
        this.context.beginPath();

        if ( this.isVerticalScroll && this.maxScrollY != 0 ) {
            var _y = this.scroller.y >> 0, arrow = this.settings.showArrows ? this.arrowPosition : 0
            if ( _y < arrow )
                _y = arrow;
            var _b = (this.scroller.y + this.scroller.h) >> 0;
            if ( _b > (this.canvasH - arrow - 2) )
                _b = this.canvasH - arrow - 2;

            if ( _b > _y ){
                this.roundRect( this.scroller.x + 1.5, _y + 0.5, this.scroller.w - 1, _b - _y, 2 );
            }
        }
        else if ( this.isHorizontalScroll && this.maxScrollX != 0 ) {
            var _x = this.scroller.x >> 0, arrow = this.settings.showArrows ? this.arrowPosition : 0
            if ( _x < arrow )
                _x = arrow;
            var _r = (this.scroller.x + this.scroller.w) >> 0;
            if ( _r > (this.canvasW - arrow - 2) )
                _r = this.canvasW - arrow - 2;

            if ( _r > _x ){
                this.roundRect( _x + 0.5, this.scroller.y + 1.5, _r - _x, this.scroller.h - 1, 2 );
            }
        }

        this.context.lineWidth = 1;
        switch ( this.scrollerStatus ) {

            case ScrollOverType.OVER:
            /*{
             this.context.fillStyle = this.settings.scrollerColorOver;
             break;
             }*/
            case ScrollOverType.ACTIVE:
            {
                this.context.fillStyle = this.settings.scrollerColorActive;
                this.context.strokeStyle = this.settings.strokeStyle;
                piperImgIndex = 1;
                break;
            }
            case ScrollOverType.NONE:
            default:
            {
                this.context.fillStyle = this.settings.scrollerColor;
                this.context.strokeStyle = this.settings.strokeStyle;
                piperImgIndex = 0;
                break;
            }

        }

        this.context.fill();
        this.context.stroke();

        if ( this.isVerticalScroll ) {
            this.context.drawImage( this.piperImgVert[piperImgIndex], this.scroller.x + 5, _y + Math.floor( this.scroller.h / 2 ) - 6 );
        }
        if ( this.isHorizontalScroll ) {
            this.context.drawImage( this.piperImgHor[piperImgIndex], _x + Math.floor( this.scroller.w / 2 ) - 6, this.scroller.y + 5 );
        }

    },
    _drawArrow:function ( type ) {
        if ( this.settings.showArrows ) {
            var w = this.canvasW;
            var h = this.canvasH;
            if ( this.isVerticalScroll ) {
                switch ( type ) {
                    case ArrowStatus.upLeftArrowHover_downRightArrowNonActive://upArrow mouse hover, downArrow stable
                        if ( ScrollOverType.OVER != this.ScrollOverType1 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_TOP, ScrollOverType.OVER, this.context, w, h );
                            this.ScrollOverType1 = ScrollOverType.OVER;
                        }
                        if ( ScrollOverType.STABLE != this.ScrollOverType2 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_BOTTOM, ScrollOverType.STABLE, this.context, w, h );
                            this.ScrollOverType2 = ScrollOverType.STABLE;
                        }
                        break;
                    case ArrowStatus.upLeftArrowActive_downRightArrowNonActive://upArrow mouse down, downArrow stable
                        if ( ScrollOverType.ACTIVE != this.ScrollOverType1 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_TOP, ScrollOverType.ACTIVE, this.context, w, h );
                            this.ScrollOverType1 = ScrollOverType.ACTIVE;
                        }
                        if ( ScrollOverType.STABLE != this.ScrollOverType2 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_BOTTOM, ScrollOverType.STABLE, this.context, w, h );
                            this.ScrollOverType2 = ScrollOverType.STABLE;
                        }
                        break;
                    case ArrowStatus.upLeftArrowNonActive_downRightArrowHover://upArrow stable, downArrow mouse hover
                        if ( ScrollOverType.STABLE != this.ScrollOverType1 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_TOP, ScrollOverType.STABLE, this.context, w, h );
                            this.ScrollOverType1 = ScrollOverType.STABLE;
                        }
                        if ( ScrollOverType.OVER != this.ScrollOverType2 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_BOTTOM, ScrollOverType.OVER, this.context, w, h );
                            this.ScrollOverType2 = ScrollOverType.OVER;
                        }
                        break;
                    case ArrowStatus.upLeftArrowNonActive_downRightArrowActive://upArrow stable, downArrow mouse down
                        if ( ScrollOverType.STABLE != this.ScrollOverType1 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_TOP, ScrollOverType.STABLE, this.context, w, h );
                            this.ScrollOverType1 = ScrollOverType.STABLE;
                        }
                        if ( ScrollOverType.ACTIVE != this.ScrollOverType2 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_BOTTOM, ScrollOverType.ACTIVE, this.context, w, h );
                            this.ScrollOverType2 = ScrollOverType.ACTIVE;
                        }
                        break;
                    case ArrowStatus.arrowHover://upArrow stable, downArrow mouse down
                        if ( ScrollOverType.STABLE != this.ScrollOverType1 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_TOP, ScrollOverType.STABLE, this.context, w, h );
                            this.ScrollOverType1 = ScrollOverType.STABLE;
                        }
                        if ( ScrollOverType.STABLE != this.ScrollOverType2 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_BOTTOM, ScrollOverType.STABLE, this.context, w, h );
                            this.ScrollOverType2 = ScrollOverType.STABLE;
                        }
                        break;
                    default ://upArrow stable, downArrow stable
                        if ( ScrollOverType.NONE != this.ScrollOverType1 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_TOP, ScrollOverType.NONE, this.context, w, h );
                            this.ScrollOverType1 = ScrollOverType.NONE;
                        }
                        if ( ScrollOverType.NONE != this.ScrollOverType2 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_BOTTOM, ScrollOverType.NONE, this.context, w, h );
                            this.ScrollOverType2 = ScrollOverType.NONE;
                        }
                        break;
                }
            }
            if ( this.isHorizontalScroll ) {
                switch ( type ) {
                    case ArrowStatus.upLeftArrowHover_downRightArrowNonActive://leftArrow mouse hover, rightArrow stable
                        if ( ScrollOverType.OVER != this.ScrollOverType1 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_LEFT, ScrollOverType.OVER, this.context, w, h );
                            this.ScrollOverType1 = ScrollOverType.OVER;
                        }
                        if ( ScrollOverType.STABLE != this.ScrollOverType2 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_RIGHT, ScrollOverType.STABLE, this.context, w, h );
                            this.ScrollOverType2 = ScrollOverType.STABLE;
                        }
                        break;
                    case ArrowStatus.upLeftArrowActive_downRightArrowNonActive://leftArrow mouse down, rightArrow stable
                        if ( ScrollOverType.ACTIVE != this.ScrollOverType1 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_LEFT, ScrollOverType.ACTIVE, this.context, w, h );
                            this.ScrollOverType1 = ScrollOverType.ACTIVE;
                        }
                        if ( ScrollOverType.STABLE != this.ScrollOverType2 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_RIGHT, ScrollOverType.STABLE, this.context, w, h );
                            this.ScrollOverType2 = ScrollOverType.STABLE;
                        }
                        break;
                    case ArrowStatus.upLeftArrowNonActive_downRightArrowHover://leftArrow stable, rightArrow mouse hover
                        if ( ScrollOverType.STABLE != this.ScrollOverType1 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_LEFT, ScrollOverType.STABLE, this.context, w, h );
                            this.ScrollOverType1 = ScrollOverType.STABLE;
                        }
                        if ( ScrollOverType.OVER != this.ScrollOverType2 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_RIGHT, ScrollOverType.OVER, this.context, w, h );
                            this.ScrollOverType2 = ScrollOverType.OVER;
                        }
                        break;
                    case ArrowStatus.upLeftArrowNonActive_downRightArrowActive://leftArrow stable, rightArrow mouse down
                        if ( ScrollOverType.STABLE != this.ScrollOverType1 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_LEFT, ScrollOverType.STABLE, this.context, w, h );
                            this.ScrollOverType1 = ScrollOverType.STABLE;
                        }
                        if ( ScrollOverType.ACTIVE != this.ScrollOverType2 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_RIGHT, ScrollOverType.ACTIVE, this.context, w, h );
                            this.ScrollOverType2 = ScrollOverType.ACTIVE;
                        }
                        break;
                    case ArrowStatus.arrowHover://upArrow stable, downArrow mouse down
                        if ( ScrollOverType.OVER != this.ScrollOverType1 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_LEFT, ScrollOverType.STABLE, this.context, w, h );
                            this.ScrollOverType1 = ScrollOverType.STABLE;
                        }
                        if ( ScrollOverType.OVER != this.ScrollOverType2 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_RIGHT, ScrollOverType.STABLE, this.context, w, h );
                            this.ScrollOverType2 = ScrollOverType.STABLE;
                        }
                        break;
                    default ://leftArrow stable, rightArrow stable
                        if ( ScrollOverType.NONE != this.ScrollOverType1 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_LEFT, ScrollOverType.NONE, this.context, w, h );
                            this.ScrollOverType1 = ScrollOverType.NONE;
                        }
                        if ( ScrollOverType.NONE != this.ScrollOverType2 ) {
                            this.ArrowDrawer.drawArrow( ScrollArrowType.ARROW_RIGHT, ScrollOverType.NONE, this.context, w, h );
                            this.ScrollOverType2 = ScrollOverType.NONE;
                        }
                        break;
                }
            }
        }
    },

    _setDimension:function ( h, w ) {

        if ( w == this.canvasW && h == this.canvasH )
            return;

        this.ScrollOverType1 = -1;
        this.ScrollOverType2 = -1;

        this.canvasW = w;
        this.canvasH = h;

        if ( !this.IsRetina ) {
            this.canvas.height = h;
            this.canvas.width = w;

            this.context.setTransform( 1, 0, 0, 1, 0, 0 );
        }
        else {
            this.canvas.height = h << 1;
            this.canvas.width = w << 1;

            this.context.setTransform( 2, 0, 0, 2, 0, 0 );
        }
    },
    _setScrollerHW:function () {
        if ( this.isVerticalScroll ) {
            this.scroller.x = 1;//0;
            this.scroller.w = 13;//this.canvasW - 1;
            if ( this.settings.showArrows )
                this.ArrowDrawer.InitSize( 13, 17, this.IsRetina );
        }
        else if ( this.isHorizontalScroll ) {
            this.scroller.y = 1;//0;
            this.scroller.h = 13;//this.canvasH - 1;
            if ( this.settings.showArrows )
                this.ArrowDrawer.InitSize( 17, 13, this.IsRetina );
        }
    },
    _MouseHoverOnScroller:function ( mp ) {
        if ( mp.x >= this.scroller.x &&
            mp.x <= this.scroller.x + this.scroller.w &&
            mp.y >= this.scroller.y &&
            mp.y <= this.scroller.y + this.scroller.h )
            return true;
        else return false;
    },
    _MouseHoverOnArrowUp:function ( mp ) {
        if ( this.isVerticalScroll ) {
            if (
                mp.x >= 0 &&
                    mp.x <= this.canvasW &&
                    mp.y >= 0 &&
                    mp.y <= this.settings.arrowDim
                ) {
                return true;
            }
            else return false;
        }
        if ( this.isHorizontalScroll ) {
            if (
                mp.x >= 0 &&
                    mp.x <= this.settings.arrowDim &&
                    mp.y >= 0 &&
                    mp.y <= this.canvasH
                ) {
                return true;
            }
            else return false;
        }
    },
    _MouseHoverOnArrowDown:function ( mp ) {
        if ( this.isVerticalScroll ) {
            if (
                mp.x >= 0 &&
                    mp.x <= this.canvasW &&
                    mp.y >= this.canvasH - this.settings.arrowDim &&
                    mp.y <= this.canvasH
                ) {
                return true;
            }
            else return false;
        }
        if ( this.isHorizontalScroll ) {
            if (
                mp.x >= this.canvasW - this.settings.arrowDim &&
                    mp.x <= this.canvasW &&
                    mp.y >= 0 &&
                    mp.y <= this.canvasH
                ) {
                return true;
            }
            else return false;
        }
    },

    _arrowDownMouseDown:function () {
        var that = this, scrollTimeout, isFirst = true,
            doScroll = function () {
                if ( that.isVerticalScroll )
                    that.scrollByY( that.settings.vscrollStep );
                else if ( that.isHorizontalScroll )
                    that.scrollByX( that.settings.hscrollStep );
                that._drawArrow( 3 );
                scrollTimeout = setTimeout( doScroll, isFirst ? that.settings.initialDelay : that.settings.arrowRepeatFreq );
                isFirst = false;
            };
        doScroll();
        this.bind( "mouseup.main mouseout", function () {
            scrollTimeout && clearTimeout( scrollTimeout );
            scrollTimeout = null;
        } );
    },
    _arrowUpMouseDown:function () {
        var that = this, scrollTimeout, isFirst = true,
            doScroll = function () {
                if ( that.isVerticalScroll )
                    that.scrollByY( -that.settings.vscrollStep );
                else if ( that.isHorizontalScroll )
                    that.scrollByX( -that.settings.hscrollStep );
                that._drawArrow( 1 );
                scrollTimeout = setTimeout( doScroll, isFirst ? that.settings.initialDelay : that.settings.arrowRepeatFreq );
                isFirst = false;
            };
        doScroll();
        this.bind( "mouseup.main mouseout", function () {
            scrollTimeout && clearTimeout( scrollTimeout );
            scrollTimeout = null;
        } )
    },

    getCurScrolledX:function () {
        return this.scrollHCurrentX;
    },
    getCurScrolledY:function () {
        return this.scrollVCurrentY;
    },
    getMaxScrolledY:function () {
        return this.maxScrollY;
    },
    getMaxScrolledX:function () {
        return this.maxScrollX;
    },
    getIsLockedMouse:function () {
        return (this.that.mouseDownArrow || this.that.mouseDown);
    },
    /************************************************************************/
    /*events*/
    evt_mousemove:function ( e ) {

        var arrowStat = ArrowStatus.arrowHover;
        var evt = e || window.event;

        if ( evt.preventDefault )
            evt.preventDefault();
        else
            evt.returnValue = false;

        var mousePos = this.that.getMousePosition( evt );
        this.that.EndMousePosition.x = mousePos.x;
        this.that.EndMousePosition.y = mousePos.y;
        var downHover = this.that._MouseHoverOnArrowDown( mousePos );
        var upHover = this.that._MouseHoverOnArrowUp( mousePos );
        var scrollerHover = this.that._MouseHoverOnScroller( mousePos );
        if ( scrollerHover ) {
            this.that.scrollerStatus = ScrollOverType.OVER;
//            this.that._drawArrow( ArrowStatus.arrowHover );
            arrowStat = ArrowStatus.arrowHover;
        }
        else if ( this.that.settings.showArrows && (downHover || upHover) ) {
            this.that.scrollerStatus = ScrollOverType.NONE;
            if ( !this.that.mouseDownArrow && !this.that.moveble) {
                if ( upHover ) {
//                    this.that._drawArrow( ArrowStatus.upLeftArrowHover_downRightArrowNonActive );
                    arrowStat = ArrowStatus.upLeftArrowHover_downRightArrowNonActive;
                }
                else if ( downHover ) {
//                    this.that._drawArrow( ArrowStatus.upLeftArrowNonActive_downRightArrowHover );
                    arrowStat = ArrowStatus.upLeftArrowNonActive_downRightArrowHover
                }
            }
        }
        else {
            if ( this.that.mouseover ) {
//                this.that._drawArrow( ArrowStatus.arrowHover );
                arrowStat = ArrowStatus.arrowHover;
            }
            this.that.scrollerStatus = ScrollOverType.NONE;
        }
        if ( this.that.mouseDown && this.that.scrollerMouseDown )
            this.that.moveble = true;
        else
            this.that.moveble = false;

        if ( this.that.isVerticalScroll ) {
            if ( this.that.moveble && this.that.scrollerMouseDown ) {
                var isTop = false, isBottom = false;
                this.that.scrollerStatus = ScrollOverType.ACTIVE;
                var _dlt = this.that.EndMousePosition.y - this.that.StartMousePosition.y;
                if ( this.that.EndMousePosition.y == this.that.StartMousePosition.y ) {
                    return;
                }
                else if ( this.that.EndMousePosition.y < this.that.arrowPosition ) {
                    this.that.EndMousePosition.y = this.that.arrowPosition;
                    _dlt = 0;
                    this.that.scroller.y = this.that.arrowPosition;
                }
                else if ( this.that.EndMousePosition.y > this.that.canvasH - this.that.arrowPosition ) {
                    this.that.EndMousePosition.y = this.that.canvasH - this.that.arrowPosition;
                    _dlt = 0;
                    this.that.scroller.y = this.that.canvasH - this.that.arrowPosition - this.that.scroller.h;
                }
                else {
                    if ( (_dlt > 0 && this.that.scroller.y + _dlt + this.that.scroller.h <= this.that.canvasH - this.that.arrowPosition ) ||
                        (_dlt < 0 && this.that.scroller.y + _dlt >= this.that.arrowPosition) ) {
                        this.that.scroller.y += _dlt;
                    }
                }

                var destY = (this.that.scroller.y - this.that.arrowPosition) * this.that.scrollCoeff;
                //var result = editor.WordControl.CorrectSpeedVerticalScroll(destY);
                var result = this.that._correctScrollV( this.that, destY );
                if ( result != null && result.isChange === true ) {
                    destY = result.Pos;
                }

                this.that._scrollV( this.that, evt, destY, isTop, isBottom );
                this.that.moveble = false;
                this.that.StartMousePosition.x = this.that.EndMousePosition.x;
                this.that.StartMousePosition.y = this.that.EndMousePosition.y;
            }
        }
        else if ( this.that.isHorizontalScroll ) {
            if ( this.that.moveble && this.that.scrollerMouseDown ) {

                var isTop = false, isBottom = false;
                this.that.scrollerStatus = ScrollOverType.ACTIVE;
                var _dlt = this.that.EndMousePosition.x - this.that.StartMousePosition.x;
                if ( this.that.EndMousePosition.x == this.that.StartMousePosition.x )
                    return;
                else if ( this.that.EndMousePosition.x < this.that.arrowPosition ) {
                    this.that.EndMousePosition.x = this.that.arrowPosition;
                    _dlt = 0;
                    this.that.scroller.x = this.that.arrowPosition;
                }
                else if ( this.that.EndMousePosition.x > this.that.canvasW - this.that.arrowPosition ) {
                    this.that.EndMousePosition.x = this.that.canvasW - this.that.arrowPosition;
                    _dlt = 0;
                    this.that.scroller.x = this.that.canvasW - this.that.arrowPosition - this.that.scroller.w;
                }
                else {
                    if ( (_dlt > 0 && this.that.scroller.x + _dlt + this.that.scroller.w <= this.that.canvasW - this.that.arrowPosition ) ||
                        (_dlt < 0 && this.that.scroller.x + _dlt >= this.that.arrowPosition) )
                        this.that.scroller.x += _dlt;
                }
                var destX = (this.that.scroller.x - this.that.arrowPosition) * this.that.scrollCoeff

                this.that._scrollH( this.that, evt, destX, isTop, isBottom );
                this.that.moveble = false;

                this.that.StartMousePosition.x = this.that.EndMousePosition.x;
                this.that.StartMousePosition.y = this.that.EndMousePosition.y;
            }
        }
        if ( !this.that.mouseover ) {
            arrowStat = -1;
            if ( !(this.that.mouseDown && this.that.scrollerMouseDown) ) {
                this.that.scrollerStatus = ScrollOverType.NONE;
            }
        }
        this.that._drawArrow( arrowStat );
        this.that._draw();

    },
    evt_mouseout:function ( e ) {

        var evt = e || window.event;

        if ( evt.preventDefault )
            evt.preventDefault();
        else
            evt.returnValue = false;

        clearInterval( this.that.mouseOverOut );
        this.that.mouseover = false;
        /*        if( this.that.mouseover ){
         this.that.mouseover = false;
         this.that.handleEvents( "onmouseout", evt );
         return;
         }*/

        if ( this.that.settings.showArrows ) {
            this.that.mouseDownArrow = false;

            this.that.handleEvents( "onmouseout", evt );
        }
        if ( !this.that.moveble ) {
            this.that.scrollerStatus = ScrollOverType.NONE;
            this.that._drawArrow();
        }
        this.that._draw();

    },
    evt_mouseover:function ( e ) {
//        this.that.scrollerStatus = ScrollOverType.ACTIVE;
//        this.that._draw();
        var _tmp = this;
        this.that.mouseOverOut = setTimeout( function ( e ) {
            _tmp.that.mouseover = true;
        }, 60 )

    },
    evt_mouseup:function ( e ) {
        var evt = e || window.event;

        if ( evt.preventDefault )
            evt.preventDefault();
        else
            evt.returnValue = false;

        var mousePos = this.that.getMousePosition( evt );
        this.that.scrollTimeout && clearTimeout( this.that.scrollTimeout );
        this.that.scrollTimeout = null;
        if ( !this.that.scrollerMouseDown ) {
            if ( this.that.settings.showArrows && this.that._MouseHoverOnArrowDown( mousePos ) ) {
                this.that.handleEvents( "onmouseup", evt );
                this.that._drawArrow( ArrowStatus.upLeftArrowNonActive_downRightArrowHover );
            }
            else if ( this.that.settings.showArrows && this.that._MouseHoverOnArrowUp( mousePos ) ) {
                this.that.handleEvents( "onmouseup", evt );
                this.that._drawArrow( ArrowStatus.upLeftArrowHover_downRightArrowNonActive );
            }
        }
        else {
            this.that.mouseDown = false;
            this.that.mouseUp = true;
            this.that.scrollerMouseDown = false;
            this.that.mouseDownArrow = false;
            this.that.scrollerStatus = ScrollOverType.NONE;
            this.that._draw();
            this.that._drawArrow();
        }

        //for unlock global mouse event
        if ( this.that.onLockMouse && this.that.offLockMouse ) {
            this.that.offLockMouse( evt );
        }
        this.that.handleEvents( "onmouseup", evt );
    },
    evt_mousedown:function ( e ) {
        var evt = e || window.event;

        // если сделать превент дефолт - перестанет приходить mousemove от window
        /*
         if (evt.preventDefault)
         evt.preventDefault();
         else
         evt.returnValue = false;
         */

        var mousePos = this.that.getMousePosition( evt ),
            downHover = this.that._MouseHoverOnArrowDown( mousePos ),
            upHover = this.that._MouseHoverOnArrowUp( mousePos );

        if ( this.that.settings.showArrows && downHover ) {
            this.that.mouseDownArrow = true;
            this.that._arrowDownMouseDown();
        }
        else if ( this.that.settings.showArrows && upHover ) {
            this.that.mouseDownArrow = true;
            this.that._arrowUpMouseDown();
        }
        else {
            this.that.mouseDown = true;
            this.that.mouseUp = false;

            if ( this.that._MouseHoverOnScroller( mousePos ) ) {
                this.that.scrollerMouseUp = false;
                this.that.scrollerMouseDown = true;

                if ( this.that.onLockMouse ) {
                    this.that.onLockMouse( evt );
                }
                this.that.StartMousePosition.x = mousePos.x;
                this.that.StartMousePosition.y = mousePos.y;
                this.that.scrollerStatus = ScrollOverType.ACTIVE;
                this.that._draw();
            }
            else {
                if ( this.that.isVerticalScroll ) {
                    var _tmp = this,
                        direction = mousePos.y - this.that.scroller.y - this.that.scroller.h / 2,
                        step = this.that.paneHeight * this.that.settings.scrollPagePercent,
                        verticalDragPosition = this.that.scroller.y,
                        isFirst = true,
                        doScroll = function () {
                            _tmp.that.lock = true;
                            if ( direction > 0 ) {
                                if ( _tmp.that.scroller.y + _tmp.that.scroller.h / 2 + step < mousePos.y ) {
                                    _tmp.that.scrollByY( step * _tmp.that.scrollCoeff );
                                }
                                else {
                                    var _step = Math.abs( _tmp.that.scroller.y + _tmp.that.scroller.h / 2 - mousePos.y );
                                    _tmp.that.scrollByY( _step * _tmp.that.scrollCoeff );
                                    cancelClick();
                                    return;
                                }
                            }
                            else if ( direction < 0 ) {
                                if ( _tmp.that.scroller.y + _tmp.that.scroller.h / 2 - step > mousePos.y ) {
                                    _tmp.that.scrollByY( -step * _tmp.that.scrollCoeff );
                                }
                                else {
                                    var _step = Math.abs( _tmp.that.scroller.y + _tmp.that.scroller.h / 2 - mousePos.y );
                                    _tmp.that.scrollByY( -_step * _tmp.that.scrollCoeff );
                                    cancelClick();
                                    return;
                                }
                            }
                            _tmp.that.scrollTimeout = setTimeout( doScroll, isFirst ? _tmp.that.settings.initialDelay : _tmp.that.settings.trackClickRepeatFreq );
                            isFirst = false;
                            _tmp.that._drawArrow( ArrowStatus.arrowHover );
                        },
                        cancelClick = function () {
                            _tmp.that.scrollTimeout && clearTimeout( _tmp.that.scrollTimeout );
                            _tmp.that.scrollTimeout = null;
                            _tmp.that.unbind( "mouseup.main", cancelClick );
                            _tmp.that.lock = false;
                        };

                    if ( this.that.onLockMouse ) {
                        this.that.onLockMouse( evt );
                    }

                    doScroll();
                    this.that.bind( "mouseup.main", cancelClick );
                }
                if ( this.that.isHorizontalScroll ) {
                    var _tmp = this,
                        direction = mousePos.x - this.that.scroller.x - this.that.scroller.w / 2,
                        step = this.that.paneWidth * this.that.settings.scrollPagePercent,
                        horizontalDragPosition = this.that.scroller.x,
                        isFirst = true,
                        doScroll = function () {
                            _tmp.that.lock = true;
                            if ( direction > 0 ) {
                                if ( _tmp.that.scroller.x + _tmp.that.scroller.w / 2 + step < mousePos.x ) {
                                    _tmp.that.scrollByX( step * _tmp.that.scrollCoeff );
                                }
                                else {
                                    var _step = Math.abs( _tmp.that.scroller.x + _tmp.that.scroller.w / 2 - mousePos.x );
                                    _tmp.that.scrollByX( _step * _tmp.that.scrollCoeff );
                                    cancelClick();
                                    return;
                                }
                            }
                            else if ( direction < 0 ) {
                                if ( _tmp.that.scroller.x + _tmp.that.scroller.w / 2 - step > mousePos.x ) {
                                    _tmp.that.scrollByX( -step * _tmp.that.scrollCoeff );
                                }
                                else {
                                    var _step = Math.abs( _tmp.that.scroller.x + _tmp.that.scroller.w / 2 - mousePos.x );
                                    _tmp.that.scrollByX( -_step * _tmp.that.scrollCoeff );
                                    cancelClick();
                                    return;
                                }
                            }
                            _tmp.that.scrollTimeout = setTimeout( doScroll, isFirst ? _tmp.that.settings.initialDelay : _tmp.that.settings.trackClickRepeatFreq );
                            isFirst = false;
                            _tmp.that._drawArrow( ArrowStatus.arrowHover );
                        },
                        cancelClick = function () {
                            _tmp.that.scrollTimeout && clearTimeout( _tmp.that.scrollTimeout );
                            _tmp.that.scrollTimeout = null;
                            _tmp.that.unbind( "mouseup.main", cancelClick );
                            _tmp.that.lock = false;
                        };

                    if ( this.that.onLockMouse ) {
                        this.that.onLockMouse( evt );
                    }

                    doScroll();
                    this.that.bind( "mouseup.main", cancelClick );
                }
            }
        }
    },
    evt_mousewheel:function ( e ) {
        var evt = e || window.event;
        if ( evt.preventDefault )
            evt.preventDefault();
        else
            evt.returnValue = false;

        var delta = 1;
        if ( this.that.isHorizontalScroll ) return;
        var mp = {}, isTop = false, isBottom = false;
        if ( undefined != evt.wheelDelta )
            delta = (evt.wheelDelta > 0) ? -this.that.settings.vscrollStep : this.that.settings.vscrollStep;
        else
            delta = (evt.detail > 0) ? this.that.settings.vscrollStep : -this.that.settings.vscrollStep;
        delta *= this.that.settings.wheelScrollLines;
        this.that.scroller.y += delta;
        if ( this.that.scroller.y < 0 ) {
            this.that.scroller.y = 0;
            isTop = true, isBottom = false;
        }
        else if ( this.that.scroller.y + this.that.scroller.h > this.that.canvasH ) {
            this.that.scroller.y = this.that.canvasH - this.that.arrowPosition - this.that.scroller.h;
            isTop = false, isBottom = true;
        }
        this.that.scrollByY( delta )
    },
    evt_click:function ( e ) {
        var evt = e || windows.event;
        var mousePos = this.that.getMousePosition( evt );
        if ( this.that.isHorizontalScroll ) {
            if ( mousePos.x > this.arrowPosition && mousePos.x < this.that.canvasW - this.that.arrowPosition ) {
                if ( this.that.scroller.x > mousePos.x ) {
                    this.that.scrollByX( -this.that.settings.vscrollStep );
                }
                if ( this.that.scroller.x < mousePos.x && this.that.scroller.x + this.that.scroller.w > mousePos.x ) {
                    return false;
                }
                if ( this.that.scroller.x + this.that.scroller.w < mousePos.x ) {
                    this.that.scrollByX( this.that.settings.hscrollStep );
                }
            }
        }
        if ( this.that.isVerticalScroll ) {
            if ( mousePos.y > this.that.arrowPosition && mousePos.y < this.that.canvasH - this.that.arrowPosition ) {
                if ( this.that.scroller.y > mousePos.y ) {
                    this.that.scrollByY( -this.that.settings.vscrollStep );
                }
                if ( this.that.scroller.y < mousePos.y && this.that.scroller.y + this.that.scroller.h > mousePos.y ) {
                    return false;
                }
                if ( this.that.scroller.y + this.that.scroller.h < mousePos.y ) {
                    this.that.scrollByY( this.that.settings.hscrollStep );
                }
            }
        }
    },

    /************************************************************************/
    /*for events*/
    bind:function ( typesStr, handler ) {
        var types = typesStr.split( " " );
        /*
         * loop through types and attach event listeners to
         * each one.  eg. "click mouseover.namespace mouseout"
         * will create three event bindings
         */
        for ( var n = 0; n < types.length; n++ ) {
            var type = types[n];
            var event = (type.indexOf( 'touch' ) == -1) ? 'on' + type : type;
            var parts = event.split( "." );
            var baseEvent = parts[0];
            var name = parts.length > 1 ? parts[1] : "";

            if ( !this.eventListeners[baseEvent] ) {
                this.eventListeners[baseEvent] = [];
            }

            this.eventListeners[baseEvent].push( {
                name:name,
                handler:handler
            } );
        }
    },
    unbind:function ( typesStr ) {
        var types = typesStr.split( " " );

        for ( var n = 0; n < types.length; n++ ) {
            var type = types[n];
            var event = (type.indexOf( 'touch' ) == -1) ? 'on' + type : type;
            var parts = event.split( "." );
            var baseEvent = parts[0];

            if ( this.eventListeners[baseEvent] && parts.length > 1 ) {
                var name = parts[1];

                for ( var i = 0; i < this.eventListeners[baseEvent].length; i++ ) {
                    if ( this.eventListeners[baseEvent][i].name == name ) {
                        this.eventListeners[baseEvent].splice( i, 1 );
                        if ( this.eventListeners[baseEvent].length === 0 ) {
                            this.eventListeners[baseEvent] = undefined;
                        }
                        break;
                    }
                }
            }
            else {
                this.eventListeners[baseEvent] = undefined;
            }
        }
    },
    handleEvents:function ( eventType, evt, p ) {
        var that = this;
        // generic events handler
        function handle( obj ) {
            var el = obj.eventListeners;
            if ( el[eventType] ) {
                var events = el[eventType];
                for ( var i = 0; i < events.length; i++ ) {
                    events[i].handler.apply( obj, [evt] );
                }
            }
        }

        /*
         * simulate bubbling by handling shape events
         * first, followed by group events, followed
         * by layer events
         */
        handle( that );
    }
};