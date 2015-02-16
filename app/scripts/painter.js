var Painter = (function($){
  //create all ui and canvas default settings
  var canvas          = $('#paint')[0],
      ctx             = canvas.getContext('2d'),
      sketch          = $('.canvas-container')[0],
      sketchStyle     = getComputedStyle(sketch),
      mouse           = {x: 0, y: 0},
      snapshots       = [],
      segment         = -1,
      last_mouse      = {x: 0, y: 0},
      ui = {
              colorpicker          : $('#colorpicker-container > span'),
              colorpickerContainer : $('#colorpicker-container'),
              slider               : $('#slider'),
              sliderContainer      : $('#stroke-slider-container'),
              sliderStrokeVal      : $('.slider-value'),
              toolsPalette         : $('#palette'),
              paletteHandle        : $('#palette-handle'),
              strokePalette        : $('#stroke-palette'),
              colorPalette         : $('#color-palette'),
              clearPalette         : $('#clear'),
              undoPalette          : $('#undo'),
              redoPalette          : $('#redo'),
      },
      defaultStyle = {
        strokeWidth : 5,
        lineJoin    : 'round',
        lineCap     : 'round',
        strokeStyle : '#f26522'
      };
  var Init = function() {
    setCanvas();
  };

  //attach draggable functionality to palette tools
  ui.toolsPalette.draggable({
    handle: ui.paletteHandle,
    containment: ui.canvas,
    scroll: false
  });

  //set default color on the palette
  ui.colorPalette.css({'background-color' : defaultStyle.strokeStyle});

  //attach colopicker functionality on color tool palette
  ui.colorpicker.minicolors({
    inline: true,
    defaultValue: defaultStyle.strokeStyle,
    change: function(hex, opacity) {
      if (hex) {
        ui.colorPalette.css({'background-color' : hex});
        ctx.strokeStyle = hex;
      };
    }
  });

  //attach colopicker functionality on stroke tool palette
  ui.slider.noUiSlider({
      start: [ defaultStyle.strokeWidth ],
      step: 1,
      range: {
        'min': [ 1 ],
        'max': [ 20 ]
      }
    })
    .on({
      set : function() {
        var stroke = parseInt(ui.slider.val());
        ctx.lineWidth = stroke;
      }
  }).Link('lower').to(ui.sliderStrokeVal, null, wNumb({decimals: 0}));

  //bind clear canvas event and reset mem
  ui.clearPalette.on('click', function(e) {
    totalReset();
  });
  //bind undo action
  ui.undoPalette.on('click', function(e) {
    undo();
  });
  //bind redo action
  ui.redoPalette.on('click', function(e) {
    redo();
  });
  //bind show and hide event for stroke slider
  ui.strokePalette.on('click', function(e) {
    showControl(ui.sliderContainer, e);
  });
  //bind show and hide event for color picker
  ui.colorPalette.on('click', function(e) {
    showControl(ui.colorpickerContainer, e);
  });

  //create object manager for touch events for drawing on canvas
  var onPaintTouch = {
     isDrawing: false,
     touchstart: function(coors){
        ctx.beginPath();
        ctx.moveTo(coors.x, coors.y);
        this.isDrawing = true;
     },
     touchmove: function(coors){
        if (this.isDrawing) {
           ctx.lineTo(coors.x, coors.y);
           ctx.stroke();
        }
     },
     touchend: function(coors){
        if (this.isDrawing) {
           this.touchmove(coors);
           this.isDrawing = false;
           createSnapshot();
        }
     }
  };

  var draw = function (e){
     // get the touch coordinates
     var coors = {
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY
     };
     // pass the coordinates to the appropriate handler
     onPaintTouch[e.type](coors);
  };

  // attach the touchstart, touchmove, touchend event listeners.
  canvas.addEventListener('touchstart', draw, false);
  canvas.addEventListener('touchmove', draw, false);
  canvas.addEventListener('touchend', draw, false);

  // attach the mousemove listner
  canvas.addEventListener('mousemove', function(e) {
    last_mouse.x = mouse.x;
    last_mouse.y = mouse.y;

    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;

  }, false);

  // attach the mousedown listner and call onPaint function
  canvas.addEventListener('mousedown', function(e) {
      canvas.addEventListener('mousemove', onPaint, false);
      onPaint();
  }, false);

  // attach the mouseup listner and create a draw's snapshot
  canvas.addEventListener('mouseup', function(e) {
      canvas.removeEventListener('mousemove', onPaint, false);
      createSnapshot();
  }, false);

  //utility function for get viewport properties
  var _getViewport = function () {
    var m = document.compatMode == 'CSS1Compat';
    return {
      l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
      t : window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
      w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
      h : window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
    };
  };

  //define basic function for canvas draw actions on mouse events
  var onPaint = function() {
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();
  };

  //set up default valuse for canvas
  var setCanvas = function() {
    canvas.width      = parseInt(sketchStyle.getPropertyValue('width'));
    canvas.height     = parseInt(sketchStyle.getPropertyValue('height'));
    ctx.lineWidth     = defaultStyle.strokeWidth;
    ctx.lineJoin      = defaultStyle.lineJoin;
    ctx.lineCap       = defaultStyle.lineCap;
    ctx.strokeStyle   = defaultStyle.strokeStyle;
  };

  //define clear canvas action
  var clearCanvas = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  //define complete clear canvas and reset the draw's snapshots
  var totalReset = function() {
    clearCanvas();
    snapshots = [];
    segment = -1;
  };

  //define a function for create snapshot of current draw
  var createSnapshot = function() {
    segment++;
    if (segment < snapshots.length) { snapshots.length = segment }
    snapshots.push(canvas.toDataURL());
  };

  //define restore previous snapshot function
  var undo = function() {
     if (segment > 0) {
        segment--;
        var snapshot = new Image();
        snapshot.src = snapshots[segment];
        clearCanvas();
        ctx.drawImage(snapshot, 0, 0);
      }
  };
  //define redo function
  var redo = function() {
    if (segment < snapshots.length-1) {
        segment++;
        var snapshot = new Image();
        snapshot.src = snapshots[segment];
        snapshot.onload = function () { ctx.drawImage(snapshot, 0, 0); }
    }
  };
  //define the show control function that allow to set up where to show controls
  //based on the tools palette current position
  var showControl = function(el, ev) {
    if (!el.hasClass('active')) {
      var viewPort      = _getViewport(),
          elWidth       = el.width(),
          left          = ui.toolsPalette.offset().left,
          width         = ui.toolsPalette.width();
          space         = 60;
          leftDistance  = viewPort.w - left - width - space;

      if ( leftDistance >= elWidth ) {
        el.removeClass('left').addClass('right');
      } else {
        el.removeClass('right').addClass('left');
      }
    }

    el.on('click', function (e) {
      e.stopImmediatePropagation();
    }).toggleClass('active');
  };

  Init();

})(jQuery);