// Depth-first search using recursive backtracker to generate a maze
(function() {
    // global keyword 'print' where 'this' is bound to 'console'
    const print = console.log.bind(console);

    // const variables
    const SCREENWIDTH = 25;
    const SCREENHEIGHT = 25;
    
    const Wall = {
	TOP: 0,
	RIGHT: 1,
	BOTTOM: 2,
	LEFT: 3
    };

    // canvas properties
    let pixelSize = 10;
    let scaleFactor = 2;
    let offSet = 2;
    let c = document.getElementById("canvas");

    // scale canvas to the size of the screen
    c.width = SCREENWIDTH * pixelSize * scaleFactor + (offSet * 2);
    c.height = SCREENHEIGHT * pixelSize * scaleFactor + (offSet * 2);

    let ctx = c.getContext("2d");
    ctx.strokeStyle = "violet";
    ctx.scale(scaleFactor, scaleFactor);

    // Cell "class"
    function Cell(i, j) {
	this.i = i;
	this.j = j;
	this.walls = [true, true, true, true]; // top-right-bottom-left
	this.visited = false;
    }

    Cell.prototype.checkNeighbours = function() {
	let neighbours = [];
	for (let i = 0; i < offSets.length; i++) {      
	    // check if it is in bounds
	    if(isInBounds(this.i + offSets[i].x, this.j + offSets[i].y)){
		const nextCell = screen.get(this.i + offSets[i].x, this.j + offSets[i].y);
		if(!nextCell.visited){
		    neighbours.push(nextCell);
		}
	    }
	}

	if (neighbours.length > 0) {
	    let random = Math.floor(Math.random() * neighbours.length);
	    return neighbours[random];
	} else {
	    return;
	}
    };
    
    Cell.prototype.highlight = function(){
	let offSet = 1;
	let x = this.i * pixelSize + offSet;
	let y = this.j * pixelSize + offSet;
	ctx.fillStyle = "violet";
	ctx.fillRect(x, y, pixelSize, pixelSize);
    }

    Cell.prototype.show = function() {
	let offSet = 1;
	let x = this.i * pixelSize + offSet;
	let y = this.j * pixelSize + offSet;

	if (this.walls[Wall.TOP]) {
	    // top
	    ctx.beginPath();
	    ctx.moveTo(x, y);
	    ctx.lineTo(x + pixelSize, y);
	    ctx.closePath();
	    ctx.stroke();
	}

	if (this.walls[Wall.RIGHT]) {
	    // right
	    ctx.beginPath();
	    ctx.moveTo(x + pixelSize, y);
	    ctx.lineTo(x + pixelSize, y + pixelSize);
	    ctx.closePath();
	    ctx.stroke();
	}

	if (this.walls[Wall.BOTTOM]) {
	    // bottom
	    ctx.beginPath();
	    ctx.moveTo(x + pixelSize, y + pixelSize);
	    ctx.lineTo(x, y + pixelSize);
	    ctx.closePath();
	    ctx.stroke();
	}

	if (this.walls[Wall.LEFT]) {
	    // left
	    ctx.beginPath();
	    ctx.moveTo(x, y + pixelSize);
	    ctx.lineTo(x, y);
	    ctx.closePath();
	    ctx.stroke();
	}

	if (this.visited) {
	    ctx.fillStyle = "purple";
	    ctx.fillRect(x, y, pixelSize, pixelSize);
	}
    };

    function Point(x, y) {
	this.x = x;
	this.y = y;
    }

    let offSets = [
	new Point(0, -1),
	new Point(1, 0),
	new Point(0, 1),
	new Point(-1, 0)
    ];

    function Screen(width, height) {
	this.grid = new Array(width * height);
	// populate grid with cells
	for (let j = 0; j < SCREENHEIGHT; j++) {
	    for (let i = 0; i < SCREENWIDTH; i++) {
		let cell = new Cell(i, j);
		this.set(i, j, cell);
	    }
	}
    }

    Screen.prototype = {
	set: function(x, y, val) {
	    if (isInBounds(x, y)) {
		this.grid[y * SCREENWIDTH + x] = val;
	    }
	},
	get: function(x, y) {
	    return this.grid[y * SCREENWIDTH + x];
	},
	drawText: function(x, y, text) {
	    for (let i = 0; i < text.length; i++) {
		this.set(x + i, y, text[i]);
	    }
	},
	update: function() {
	    if(!current.visited){
		current.visited = true;
	    }
	    
	    current.highlight();
	    let next = current.checkNeighbours();
	    if (next) {
		stack.push(current);
		next.visited = true;
		removeWalls(current, next);
		current = next;
	    }else if (stack.length > 0){
		current = stack.pop();
	    }
	},
	render: function(context) {
	    let offSet = 0.5;
	    for (let y = 0; y < SCREENHEIGHT; y++) {
		for (let x = 0; x < SCREENWIDTH; x++) {
		    this.get(x, y).show();
		}
	    }
	}
    };
    
    function removeWalls(a, b){
	let x = a.i - b.i;
	let y = a.j - b.j;

	if(x === 1){
	    a.walls[Wall.LEFT] = false;
	    b.walls[Wall.RIGHT] = false;
	}else if(x === -1){
	    a.walls[Wall.RIGHT] = false;
	    b.walls[Wall.LEFT] = false;
	}
	
	if(y === 1){
	    a.walls[Wall.TOP] = false;
	    b.walls[Wall.BOTTOM] = false;
	}else if(y === -1){
	    a.walls[Wall.BOTTOM] = false;
	    b.walls[Wall.TOP] = false;
	}
    }

    function isInBounds(x, y) {
	return x < SCREENWIDTH && x >= 0 && y < SCREENHEIGHT && y >= 0;
    }

    // create screen
    let screen = new Screen(SCREENWIDTH, SCREENHEIGHT);
    let iter = 0;
    let maxIterations = 10000;
    let fps = 30;
    
    // initial starting point
    let current = screen.get(0, 0);
    let stack = [];
    
    (function mainLoop() {
	screen.render(ctx);
	screen.update();
	if(iter++ < maxIterations){
	    setTimeout(function(){
		requestAnimationFrame(mainLoop); 
	    }, 1000 / fps);
	}
    })();  
})();
