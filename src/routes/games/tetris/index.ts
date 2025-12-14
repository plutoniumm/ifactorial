export interface Piece {
  shape: number[][];
  color: string;
}

export const NEU = {
  colors: {
    surface: 'var(--color-surface)',
    empty: '#f4f4f5',
    ghost: '#ddd',
  },
  shadows: {
    elevated: '6px 6px 12px var(--elevated-D), -6px -6px 12px var(--elevated-L)',
    hover: '4px 4px 10px var(--hover-D), -4px -4px 10px var(--hover-L), inset 2px 2px 6px var(--inset-D), inset -2px -2px 6px var(--inset-L)',
    pressed: 'inset 4px 4px 12px var(--elevated-D), inset -4px -4px 12px var(--elevated-L)',
  },
  cellBase: {
    borderRadius: '8px',
    background: 'transparent',
    boxShadow: '6px 6px 12px var(--elevated-D), -6px -6px 12px var(--elevated-L)',
  },
};

export class Tetris {
  cols = 10;
  rows = 20;
  board: number[][] = [];
  nodes: HTMLElement[] = [];

  bag: string[] = [];
  p = { x: 0, y: 0, shape: [] as number[][], type: '' };

  score = 0;
  over = false;

  last = 0;
  dt = 0;
  step = 1000;
  raf: number | null = null;

  root: HTMLElement;
  scoreNode: HTMLElement;

  colors: Record<string, string> = {
    I: '#00f0f0', O: '#f0f000', T: '#a000f0',
    S: '#00f000', Z: '#f00000', J: '#0000f0', L: '#f0a000'
  };

  constructor(root: HTMLElement, scoreNode: HTMLElement) {
    this.root = root;
    this.scoreNode = scoreNode;
    this.binds = this.binds.bind(this);
    this.loop = this.loop.bind(this);
    this.init();
  }

  init () {
    this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    this.initGrid();
    this.reset();
    document.addEventListener('keydown', this.binds);
    this.loop();
  }

  initGrid () {
    this.root.innerHTML = '';
    this.nodes = [];
    Object.assign(this.root.style, {
      display: 'grid',
      gridTemplateColumns: `repeat(${this.cols}, 1fr)`,
      gap: '0.35vmin'
    });

    for (let i = 0; i < this.rows * this.cols; i++) {
      const cell = document.createElement('div');
      this.root.appendChild(cell);
      this.nodes.push(cell);
    }
  }

  binds (e: KeyboardEvent) {
    if (this.over) return;
    const key = e.keyCode;
    if (key === 37) this.move(-1);
    if (key === 39) this.move(1);
    if (key === 40) this.drop();
    if (key === 38) this.rotate(1);
    if (key === 32) this.hardDrop();
  }

  getPiece (type: string): number[][] {
    if (type === 'I') return [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]];
    if (type === 'L') return [[0, 2, 0], [0, 2, 0], [0, 2, 2]];
    if (type === 'J') return [[0, 3, 0], [0, 3, 0], [3, 3, 0]];
    if (type === 'O') return [[4, 4], [4, 4]];
    if (type === 'Z') return [[5, 5, 0], [0, 5, 5], [0, 0, 0]];
    if (type === 'S') return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];
    if (type === 'T') return [[0, 7, 0], [7, 7, 7], [0, 0, 0]];
    return [];
  }

  shuffle () {
    const pieces = 'ILJOTSZ'.split('');
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    this.bag.push(...pieces);
  }

  reset () {
    if (this.bag.length === 0) this.shuffle();
    this.p.type = this.bag.pop()!;
    this.p.shape = this.getPiece(this.p.type);
    this.p.y = 0;
    this.p.x = (this.cols / 2 | 0) - (this.p.shape[0].length / 2 | 0);

    if (this.collide(this.p.x, this.p.y, this.p.shape)) {
      this.board.forEach(r => r.fill(0));
      this.score = 0;
      this.updateScore();
    }
  }

  collide (x: number, y: number, shape: number[][]) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0 && (this.board[y + r] && this.board[y + r][x + c]) !== 0) {
          return true;
        }
      }
    }
    return false;
  }

  rotate (dir: number) {
    const pos = this.p.x;
    const cloned = this.p.shape.map(row => [...row]);

    for (let y = 0; y < cloned.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [cloned[x][y], cloned[y][x]] = [cloned[y][x], cloned[x][y]];
      }
    }
    if (dir > 0) cloned.forEach(row => row.reverse());
    else cloned.reverse();

    if (!this.collide(this.p.x, this.p.y, cloned)) {
      this.p.shape = cloned;
    }
  }

  move (dir: number) {
    this.p.x += dir;
    if (this.collide(this.p.x, this.p.y, this.p.shape)) {
      this.p.x -= dir;
    }
  }

  drop () {
    this.p.y++;
    if (this.collide(this.p.x, this.p.y, this.p.shape)) {
      this.p.y--;
      this.merge();
      this.reset();
      this.sweep();
    }
    this.dt = 0;
  }

  hardDrop () {
    while (!this.collide(this.p.x, this.p.y + 1, this.p.shape)) {
      this.p.y++;
    }
    this.drop();
  }

  merge () {
    this.p.shape.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val !== 0) {
          this.board[y + this.p.y][x + this.p.x] = val;
        }
      });
    });
  }

  sweep () {
    let count = 0;
    outer: for (let y = this.rows - 1; y > 0; --y) {
      for (let x = 0; x < this.cols; ++x) {
        if (this.board[y][x] === 0) continue outer;
      }
      const row = this.board.splice(y, 1)[0].fill(0);
      this.board.unshift(row);
      ++y;
      count++;
    }
    if (count > 0) {
      this.score += [0, 40, 100, 300, 1200][count];
      this.updateScore();
    }
  }

  updateScore () {
    this.scoreNode.innerText = this.score.toString();
    this.step = Math.max(100, 1000 - (Math.floor(this.score / 500) * 50));
  }

  draw () {
    const buffer = new Array(this.rows * this.cols).fill(null);
    this.board.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val !== 0) buffer[y * this.cols + x] = this.getColor(val);
      });
    });

    let gy = this.p.y;
    while (!this.collide(this.p.x, gy + 1, this.p.shape)) gy++;

    this.p.shape.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val !== 0) {
          const idx = (gy + y) * this.cols + (this.p.x + x);
          if (!buffer[idx]) buffer[idx] = NEU.colors.ghost;
        }
      });
    });

    this.p.shape.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val !== 0) {
          buffer[(this.p.y + y) * this.cols + (this.p.x + x)] = this.colors[this.p.type];
        }
      });
    });

    for (let i = 0; i < this.nodes.length; i++) {
      const color = buffer[i] as string | null;
      const cell = this.nodes[i];

      if (color) {
        Object.assign(cell.style, NEU.cellBase);
        cell.style.boxShadow = NEU.cellBase.boxShadow || '';
        cell.style.backgroundColor = color;
        cell.style.opacity = '1';
      } else {
        cell.style.background = 'transparent';
        cell.style.backgroundColor = 'transparent';
        cell.style.boxShadow = 'none';
        cell.style.opacity = '0';
        cell.style.borderRadius = NEU.cellBase.borderRadius;
        cell.style.transition = '';
      }
    }
  }

  getColor (val: number) {
    const map = ['I', 'L', 'J', 'O', 'Z', 'S', 'T'];
    return this.colors[map[val - 1]] || '#999';
  }

  loop (t: number = 0) {
    const delta = t - this.last;
    this.last = t;
    this.dt += delta;

    if (this.dt > this.step) this.drop();
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  }

  kill () {
    document.removeEventListener('keydown', this.binds);
    if (this.raf) cancelAnimationFrame(this.raf);
  }
}