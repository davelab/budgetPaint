var canvas = document.querySelector('#paint');
var ctx = canvas.getContext('2d');

var sketch = document.querySelector('.canvas-container');
var sketch_style = getComputedStyle(sketch);
canvas.width = parseInt(sketch_style.getPropertyValue('width'));
canvas.height = parseInt(sketch_style.getPropertyValue('height'));

var mouse = {x: 0, y: 0};
var last_mouse = {x: 0, y: 0};

/* Drawing on Paint App */
ctx.lineWidth = 5;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = 'blue';

var changeStroke = function(e, val) {
    ctx.lineWidth = val;
};

/* Mouse Capturing Work */
canvas.addEventListener('mousemove', function(e) {
    last_mouse.x = mouse.x;
    last_mouse.y = mouse.y;

    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
}, false);

canvas.addEventListener('mousedown', function(e) {
    canvas.addEventListener('mousemove', onPaint, false);
}, false);

canvas.addEventListener('mouseup', function() {
    canvas.removeEventListener('mousemove', onPaint, false);
}, false);

var onPaint = function() {
    ctx.beginPath();
    ctx.moveTo(last_mouse.x, last_mouse.y);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.closePath();
    ctx.stroke();
};

$("#slider").noUiSlider({
      start: [ ctx.lineWidth  ],
      step: 1,
      range: {
        'min': [ 1 ],
        'max': [ 20 ]
      }
    })
    .on({
      set : function() {
        var stroke = parseInt($('#slider').val());
        ctx.lineWidth = stroke;
      }
    })

$("#slider").Link('lower').to($('.slider-value'), null, wNumb({
  decimals: 0
}));

$('#stroke').on('click', function(e) {
    $('.stroke-slider-container').on('click', function(e){
        e.stopImmediatePropagation();
    }).toggleClass('active');
})


$('#colorpicker-container > span').minicolors({
  inline: true,
  change: function(hex, opacity) {
    if (hex) {
      $('#color-selector').css({'background-color': hex});
      ctx.strokeStyle = hex
    };
  }
});