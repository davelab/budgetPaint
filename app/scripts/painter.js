var Painter = (function($){
  var canvas          = $('#paint')[0],
      ctx             = canvas.getContext('2d'),
      sketch          = $('.canvas-container')[0],
      sketchStyle     = getComputedStyle(sketch),
      mouse           = {x: 0, y: 0},
      snapshots       = [],
      segment         = -1,
      last_mouse      = {x: 0, y: 0},
      ui = {
              colorpicker     : $('#colorpicker-container > span'),
              slider          : $('#slider'),
              sliderStrokeVal : $('.slider-value'),
              toolsPalette    : $('#palette'),
              paletteHandle   : $('#palette-handle'),
              strokePalette   : $('#stroke-palette'),
              colorPalette    : $('#color-palette'),
              clearPalette    : $('#clear'),
              undoPalette     : $('#undo'),
              redoPalette     : $('#redo'),
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

  ui.toolsPalette.draggable({
    handle: ui.paletteHandle,
    containment: ui.canvas,
    scroll: false
  });

  ui.colorPalette.css({'background-color' : defaultStyle.strokeStyle});
  ui.colorpicker.minicolors({
    inline: true,
    change: function(hex, opacity) {
      if (hex) {
        ui.colorPalette.css({'background-color' : hex});
        ctx.strokeStyle = hex;
      };
    }
  });

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

  ui.clearPalette.on('click', function(e) {
    totalReset();
  });
  ui.undoPalette.on('click', function(e) {
    undo();
  });
  ui.redoPalette.on('click', function(e) {
    redo();
  });
  canvas.addEventListener('mousemove', function(e) {

    last_mouse.x = mouse.x;
    last_mouse.y = mouse.y;

    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;

  }, false);

  canvas.addEventListener('mousedown', function(e) {
      canvas.addEventListener('mousemove', onPaint, false);
      onPaint();
  }, false);

  canvas.addEventListener('mouseup', function() {
      canvas.removeEventListener('mousemove', onPaint, false);
      createSnapshot();
  }, false);

  var onPaint = function() {
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();
  };

  var setCanvas = function() {
    canvas.width      = parseInt(sketchStyle.getPropertyValue('width'));
    canvas.height     = parseInt(sketchStyle.getPropertyValue('height'));
    ctx.lineWidth     = defaultStyle.strokeWidth;
    ctx.lineJoin      = defaultStyle.lineJoin;
    ctx.lineCap       = defaultStyle.lineCap;
    ctx.strokeStyle   = defaultStyle.strokeStyle;
  };

  var clearCanvas = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  var totalReset = function() {
    clearCanvas();
    snapshots = [];
    segment = -1;
  }

  var createSnapshot = function() {
    segment++;
    if (segment < snapshots.length) { snapshots.length = segment }
    snapshots.push(canvas.toDataURL());
  };

  var undo = function() {
     if (segment > 0) {
        segment--;
        var snapshot = new Image();
        snapshot.src = snapshots[segment];
        clearCanvas();
        ctx.drawImage(snapshot, 0, 0);
      }
  }

  var redo = function() {
    if (segment < snapshots.length-1) {
        segment++;
        var snapshot = new Image();
        snapshot.src = snapshots[segment];
        snapshot.onload = function () { ctx.drawImage(snapshot, 0, 0); }
    }
  }

  Init();

})(jQuery);