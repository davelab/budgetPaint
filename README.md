# BudgetPaint

With this app you can draw on a full size HTML canvas. You can choose every colours you love, the stroke width from a draggable tools palette, which allow you to draw on every single pixel of your canvas.

features:
 - Floating draggable pallette tools (jquery UI)
 - Touch ready
 - Color picker (minicolors jquery plugin)
 - Stroke width slider tool (noUIslider jquery plugin)
 - undo action
 - redo action
 - clear canvas action

### DEMO
check out the demo: http://davelab.net/budgetPaint/

![screen](/app/images/screenshot.png)

Dependencies:
node,
grunt,
bower.

for run this project type on your terminal:

<pre>
> npm install && bower install
> grunt dev
</pre>

then open your browser at http://localhost:8081/

## @todo

- create grunt task for that manage bower components and concact, minify javascripts for deploy purpose

- create qUnit Test