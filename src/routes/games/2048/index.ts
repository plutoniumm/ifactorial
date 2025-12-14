export class GameManager {
  startTiles = 2;
  size;
  undoState;
  inputManager;
  actuator;
  grid;
  over;
  won;
  constructor(size, InputManager, Actuator) {
    this.size = size;
    this.inputManager = new InputManager();
    this.actuator = new Actuator();
    this.inputManager.on("move", this.move.bind(this));
    this.inputManager.on("restart", this.restart.bind(this));
    this.inputManager.on("undo", this.undo.bind(this));
    this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));
    this.setup();
  }
  restart () {
    this.actuator.continueGame();
    this.setup();
  }
  undo () {
    if (this.undoState) {
      this.grid = new Grid(
        this.undoState.grid.size,
        this.undoState.grid.cells
      );
      this.over = this.undoState.over;
      this.won = this.undoState.won;
      this.keepPlaying = this.undoState.keepPlaying;
      this.actuate();
    }
  }
  keepPlaying () {
    this.keepPlaying = true;
    this.actuator.continueGame();
  }
  isGameTerminated () {
    return this.over || (this.won && !this.keepPlaying);
  }
  setup () {
    this.grid = new Grid(this.size);
    this.over = false;
    this.won = false;
    this.keepPlaying = false;
    this.addStartTiles();
    this.actuate();
  }
  addStartTiles () {
    for (var i = 0; i < this.startTiles; i++) {
      this.addRandomTile();
    }
  }
  addRandomTile () {
    if (this.grid.cellsAvailable()) {
      var value = Math.random() < 0.9 ? 2 : 4;
      var tile = new Tile(this.grid.randomAvailableCell(), value);
      this.grid.insertTile(tile);
    }
  }
  actuate () {
    this.actuator.actuate(this.grid, {
      over: this.over,
      won: this.won,
      terminated: this.isGameTerminated()
    });
  }
  serialize () {
    return {
      grid: this.grid.serialize(),
      over: this.over,
      won: this.won,
      keepPlaying: this.keepPlaying
    };
  }
  prepareTiles () {
    this.grid.eachCell(function (x, y, tile) {
      if (tile) {
        tile.mergedFrom = null;
        tile.save();
      }
    });
  }
  moveTile (tile, cell) {
    this.grid.cells[tile.x][tile.y] = null;
    this.grid.cells[cell.x][cell.y] = tile;
    tile.update(cell);
  }
  move (direction) {
    this.undoState = this.serialize();
    var self = this;
    if (this.isGameTerminated()) return;
    var cell, tile;
    var vector = this.getVector(direction);
    var traversals = this.buildTraversals(vector);
    var moved = false;
    this.prepareTiles();
    traversals.x.forEach(function (x) {
      traversals.y.forEach(function (y) {
        cell = { x: x, y: y };
        tile = self.grid.cellContent(cell);
        if (tile) {
          var positions = self.findFarthestPosition(cell, vector);
          var next = self.grid.cellContent(positions.next);
          if (next && next.value === tile.value && !next.mergedFrom) {
            var merged = new Tile(positions.next, tile.value * 2);
            merged.mergedFrom = [tile, next];
            self.grid.insertTile(merged);
            self.grid.removeTile(tile);
            tile.update(positions.next);
            if (merged.value === 2048) self.won = true;
          } else {
            self.moveTile(tile, positions.farthest);
          }
          if (!self.positionsEqual(cell, tile)) {
            moved = true;
          }
        }
      });
    });
    if (moved) {
      this.addRandomTile();
      if (!this.movesAvailable()) {
        this.over = true;
      }
      this.actuate();
    }
  }
  getVector (direction) {
    var map = {
      0: { x: 0, y: -1 },
      1: { x: 1, y: 0 },
      2: { x: 0, y: 1 },
      3: { x: -1, y: 0 }
    };
    return map[direction];
  }
  buildTraversals (vector) {
    var traversals = { x: [], y: [] };
    for (var pos = 0; pos < this.size; pos++) {
      traversals.x.push(pos);
      traversals.y.push(pos);
    }
    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();
    return traversals;
  }
  findFarthestPosition (cell, vector) {
    var previous;
    do {
      previous = cell;
      cell = { x: previous.x + vector.x, y: previous.y + vector.y };
    } while (this.grid.withinBounds(cell) &&
      this.grid.cellAvailable(cell));
    return {
      farthest: previous,
      next: cell
    };
  }
  movesAvailable () {
    return this.grid.cellsAvailable() || this.tileMatchesAvailable();
  }
  tileMatchesAvailable () {
    var self = this;
    var tile;
    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        tile = this.grid.cellContent({ x: x, y: y });
        if (tile) {
          for (var direction = 0; direction < 4; direction++) {
            var vector = self.getVector(direction);
            var cell = { x: x + vector.x, y: y + vector.y };
            var other = self.grid.cellContent(cell);
            if (other && other.value === tile.value) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
  positionsEqual (first, second) {
    return first.x === second.x && first.y === second.y;
  }
}
export class Grid {
  size;
  cells;
  constructor(size, previousState) {
    this.size = size;
    this.cells = previousState ? this.fromState(previousState) : this.empty();
  }
  empty () {
    var cells = [];
    for (var x = 0; x < this.size; x++) {
      var row = cells[x] = [];
      for (var y = 0; y < this.size; y++) {
        row.push(null);
      }
    }
    return cells;
  }
  fromState (state) {
    var cells = [];
    for (var x = 0; x < this.size; x++) {
      var row = cells[x] = [];
      for (var y = 0; y < this.size; y++) {
        var tile = state[x][y];
        row.push(tile ? new Tile(tile.position, tile.value) : null);
      }
    }
    return cells;
  }
  randomAvailableCell () {
    var cells = this.availableCells();
    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)];
    }
  }
  availableCells () {
    var cells = [];
    this.eachCell(function (x, y, tile) {
      if (!tile) {
        cells.push({ x: x, y: y });
      }
    });
    return cells;
  }
  eachCell (callback) {
    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        callback(x, y, this.cells[x][y]);
      }
    }
  }
  cellsAvailable () {
    return !!this.availableCells().length;
  }
  cellAvailable (cell) {
    return !this.cellOccupied(cell);
  }
  cellOccupied (cell) {
    return !!this.cellContent(cell);
  }
  cellContent (cell) {
    if (this.withinBounds(cell)) {
      return this.cells[cell.x][cell.y];
    } else {
      return null;
    }
  }
  insertTile (tile) {
    this.cells[tile.x][tile.y] = tile;
  }
  removeTile (tile) {
    this.cells[tile.x][tile.y] = null;
  }
  withinBounds (position) {
    return position.x >= 0 && position.x < this.size &&
      position.y >= 0 && position.y < this.size;
  }
  serialize () {
    var cellState = [];
    for (var x = 0; x < this.size; x++) {
      var row = cellState[x] = [];
      for (var y = 0; y < this.size; y++) {
        row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
      }
    }
    return {
      size: this.size,
      cells: cellState
    };
  }
}
export class HTMLActuator {
  tileContainer;
  messageContainer;
  constructor() {
    this.tileContainer = document.querySelector(".tile");
    this.messageContainer = document.querySelector(".game-message");
  }
  actuate (grid, metadata) {
    var self = this;
    window.requestAnimationFrame(function () {
      self.clearContainer(self.tileContainer);
      grid.cells.forEach(function (column) {
        column.forEach(function (cell) {
          if (cell) {
            self.addTile(cell);
          }
        });
      });
      if (metadata.terminated) {
        if (metadata.over) {
          self.message(false);
        } else if (metadata.won) {
          self.message(true);
        }
      }
    });
  }
  continueGame () {
    this.clearMessage();
  }
  clearContainer (container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }
  addTile (tile) {
    var self = this;
    var wrapper = document.createElement("div");
    var inner = document.createElement("div");
    var position = tile.previousPosition || { x: tile.x, y: tile.y };
    var positionClass = this.positionClass(position);
    var classes = ["tile", "tile-" + tile.value, positionClass];
    if (tile.value > 2048) classes.push("tile-super");
    this.applyClasses(wrapper, classes);
    inner.classList.add("tile-inner");
    inner.textContent = tile.value;
    if (tile.previousPosition) {
      window.requestAnimationFrame(function () {
        classes[2] = self.positionClass({ x: tile.x, y: tile.y });
        self.applyClasses(wrapper, classes);
      });
    } else if (tile.mergedFrom) {
      classes.push("tile-merged");
      this.applyClasses(wrapper, classes);
      tile.mergedFrom.forEach(function (merged) {
        self.addTile(merged);
      });
    } else {
      classes.push("tile-new");
      this.applyClasses(wrapper, classes);
    }
    wrapper.appendChild(inner);
    this.tileContainer.appendChild(wrapper);
  }
  applyClasses (element, classes) {
    element.setAttribute("class", classes.join(" "));
  }
  normalizePosition (position) {
    return { x: position.x + 1, y: position.y + 1 };
  }
  positionClass (position) {
    position = this.normalizePosition(position);
    return "tile-position-" + position.x + "-" + position.y;
  }
  message (won) {
    var type = won ? "game-won" : "game-over";
    var message = won ? "You win!" : "Game over!";
    this.messageContainer.classList.add(type);
    this.messageContainer.getElementsByTagName("p")[0].textContent = message;
  }
  clearMessage () {
    this.messageContainer.classList.remove("game-won");
    this.messageContainer.classList.remove("game-over");
  }
}
export class KeyboardInputManager {
  events = {};
  eventTouchstart = "touchstart";
  eventTouchmove = "touchmove";
  eventTouchend = "touchend";
  constructor() {
    this.listen();
  }
  on (event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  emit (event, data) {
    var callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach(function (callback) {
        callback(data);
      });
    }
  }
  listen () {
    var self = this;
    var map = {
      38: 0,
      39: 1,
      40: 2,
      37: 3,
      75: 0,
      76: 1,
      74: 2,
      72: 3,
      87: 0,
      68: 1,
      83: 2,
      65: 3
    };
    document.addEventListener("keydown", function (event) {
      var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
        event.shiftKey;
      var mapped = map[event.which];
      if (!modifiers && mapped !== undefined) {
        event.preventDefault();
        self.emit("move", mapped);
      }
      if (!modifiers && event.which === 82) {
        self.restart.call(self, event);
      };
      if (!modifiers && event.which === 85) {
        self.undo.call(self, event);
      };
    });
    this.bindButtonPress("#retry-button", this.restart);
    this.bindButtonPress("#restart-button", this.restart);
    this.bindButtonPress("#undo-button", this.undo);
    this.bindButtonPress("#keep-button", this.keepPlaying);

    var
      touchStartClientX,
      touchStartClientY;

    var gameContainer = document.getElementsByClassName("game-container")[0];


    gameContainer.addEventListener(this.eventTouchstart, function (event) {
      if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
        event.targetTouches.length > 1) {
        return;
      }
      if (window.navigator.msPointerEnabled) {
        touchStartClientX = event.pageX;
        touchStartClientY = event.pageY;
      } else {
        touchStartClientX = event.touches[0].clientX;
        touchStartClientY = event.touches[0].clientY;
      }
      event.preventDefault();
    });
    gameContainer.addEventListener(this.eventTouchmove, function (event) {
      event.preventDefault();
    });
    gameContainer.addEventListener(this.eventTouchend, function (event) {
      if ((!window.navigator.msPointerEnabled && event.touches.length > 0) ||
        event.targetTouches.length > 0) {
        return;
      }
      var touchEndClientX, touchEndClientY;
      if (window.navigator.msPointerEnabled) {
        touchEndClientX = event.pageX;
        touchEndClientY = event.pageY;
      } else {
        touchEndClientX = event.changedTouches[0].clientX;
        touchEndClientY = event.changedTouches[0].clientY;
      }
      var dx = touchEndClientX - touchStartClientX;
      var absDx = Math.abs(dx);
      var dy = touchEndClientY - touchStartClientY;
      var absDy = Math.abs(dy);
      if (Math.max(absDx, absDy) > 10) {
        self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
      }
    });
  }
  restart (event) {
    event.preventDefault();
    this.emit("restart");
  }
  undo (event) {
    event.preventDefault();
    this.emit("undo");
  }
  keepPlaying (event) {
    event.preventDefault();
    this.emit("keepPlaying");
  }
  bindButtonPress (selector, fn) {
    var button = document.querySelector(selector);
    button.addEventListener("click", fn.bind(this));
    button.addEventListener(this.eventTouchend, fn.bind(this));
  }
}
export class Tile {
  mergedFrom = null;
  previousPosition = null;
  constructor(position, value) {
    this.x = position.x;
    this.y = position.y;
    this.value = value || 2;
  }
  save () {
    this.previousPosition = {
      x: this.x,
      y: this.y
    };
  }
  update (position) {
    this.x = position.x;
    this.y = position.y;
  }
  serialize () {
    return {
      position: {
        x: this.x,
        y: this.y
      },
      value: this.value
    };
  }
}