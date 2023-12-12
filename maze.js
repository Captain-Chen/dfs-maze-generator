// Depth-first search using recursive backtracker to generate a maze
(function () {
	// global keyword 'print' where 'this' is bound to 'console'
	const print = console.log.bind(console);

	class Screen {
		constructor(width, height) {
			this.running = true;
			this.grid = new Array(width * height);
			// populate grid with cells
			for (let y = 0; y < SCREENHEIGHT; y++) {
				for (let x = 0; x < SCREENWIDTH; x++) {
					let cell = new Cell(x, y);
					this.set(x, y, cell);
				}
			}
		}

		set(x, y, val) {
			if (isInBounds(x, y)) {
				this.grid[y * SCREENWIDTH + x] = val;
			}
		}

		get(x, y) {
			return this.grid[y * SCREENWIDTH + x];
		}

		update() {
			if (!current.visited) {
				current.visited = true;
			}

			let next = current.checkNeighbours();
			if (next) {
				stack.push(current);
				next.visited = true;
				removeWalls(current, next);
				current = next;
			} else if (stack.length > 0) {
				current = stack.pop();
			} else {
				this.running = false;
			}
		}

		render() {
			this.clear();
			for (let y = 0; y < SCREENHEIGHT; y++) {
				for (let x = 0; x < SCREENWIDTH; x++) {
					this.get(x, y).show();
				}
			}
			current.highlight();
		}

		clear() {
			ctx.clearRect(0, 0, c.width, c.height);
		}
	};

	class Point{
		constructor(x, y) {
			this.x = x;
			this.y = y;
		}
	}

	class Cell {
		constructor(x, y) {
			this.x = x;
			this.y = y;
			this.walls = [true, true, true, true]; // top, right, bottom, left
			this.visited = false;
		}

		checkNeighbours() {
			let neighbours = [];
			for (let i = 0; i < offSets.length; i++) {
				// first check if it is in bounds before doing anything
				if (isInBounds(this.x + offSets[i].x, this.y + offSets[i].y)) {
					const nextCell = screen.get(this.x + offSets[i].x, this.y + offSets[i].y);
					if (!nextCell.visited) {
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
		}

		highlight() {
			let x = this.x * pixelSize;
			let y = this.y * pixelSize;
			ctx.save();
				ctx.fillStyle = "violet";
				ctx.fillRect(x, y, pixelSize, pixelSize);
			ctx.restore();
		}

		show() {
			let x = this.x * pixelSize;
			let y = this.y * pixelSize;

			ctx.beginPath();
			if (this.walls[Wall.TOP]) {
				// top
				ctx.moveTo(x, y);
				ctx.lineTo(x + pixelSize, y);
			}

			if (this.walls[Wall.RIGHT]) {
				// right
				ctx.moveTo(x + pixelSize, y);
				ctx.lineTo(x + pixelSize, y + pixelSize);
			}

			if (this.walls[Wall.BOTTOM]) {
				// bottom
				ctx.moveTo(x + pixelSize, y + pixelSize);
				ctx.lineTo(x, y + pixelSize);
			}

			if (this.walls[Wall.LEFT]) {
				// left
				ctx.moveTo(x, y + pixelSize);
				ctx.lineTo(x, y);
			}

			if (this.visited) {
				ctx.save();
					ctx.fillStyle = "purple";
					ctx.fillRect(x, y, pixelSize, pixelSize);
				ctx.restore();
			}
			ctx.closePath();
			ctx.stroke();
		}
	}

	// modify these values to change the shape of the canvas
	const SCREENWIDTH = 23;
	const SCREENHEIGHT = 30;

	const Wall = {
		TOP: 0,
		RIGHT: 1,
		BOTTOM: 2,
		LEFT: 3
	};

	// canvas properties
	let pixelSize = 8;
	let scaleFactor = 2;
	let c = document.getElementById("canvas");

	// scale canvas to size of screen
	c.width = SCREENWIDTH * pixelSize * scaleFactor;
	c.height = SCREENHEIGHT * pixelSize * scaleFactor;

	let ctx = c.getContext("2d");
	ctx.strokeStyle = "violet";
	ctx.scale(scaleFactor, scaleFactor);
	
	// create the screen
	let screen = new Screen(SCREENWIDTH, SCREENHEIGHT);
	let fps = 30;

	let current = screen.get(0, 0); // Set our initial starting point
	let stack = []; // We will be managing our own stack

	let stepsLabel = document.getElementById('steps');
	let stepCount = 0;

	let offSets = [
		new Point(0, -1),
		new Point(1, 0),
		new Point(0, 1),
		new Point(-1, 0)
	];

	// helper functions
	function removeWalls(a, b) {
		let x = a.x - b.x;
		let y = a.y - b.y;

		if (x === 1) {
			a.walls[Wall.LEFT] = false;
			b.walls[Wall.RIGHT] = false;
		} else if (x === -1) {
			a.walls[Wall.RIGHT] = false;
			b.walls[Wall.LEFT] = false;
		}

		if (y === 1) {
			a.walls[Wall.TOP] = false;
			b.walls[Wall.BOTTOM] = false; 
		} else if (y === -1) {
			a.walls[Wall.BOTTOM] = false;
			b.walls[Wall.TOP] = false;
		}
	}

	function isInBounds(x, y) {
		return x < SCREENWIDTH && x >= 0 && y < SCREENHEIGHT && y >= 0;
	}

	(function mainLoop() {
		screen.update();
		screen.render();
		if (screen.running) {
			setTimeout(function () {
				stepsLabel.innerHTML = stepCount++;
				requestAnimationFrame(mainLoop);
			}, 1000 / fps);
		}
	})();
})();  