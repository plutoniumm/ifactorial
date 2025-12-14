export class Node {
  x
  y
  id
  key
  val
  arcs = []
  pair
  tint = 0
  cap

  constructor(x, y, key, val = 0) {
    this.x = x
    this.y = y
    this.key = key
    this.id = key
    this.val = val
    this.cap = this.val > 0 ? 1 : 2
  }

  reset () {
    this.arcs = []
    this.id = this.key
    if (this.val === 0) this.tint = 0
    this.cap = (this.val > 0) ? 1 : 2
  }

  add (node, wipe = true) {
    if (!this.arcs.includes(node)) {
      this.arcs.push(node)
    } else if (wipe) {
      this.del(node)
    }

    if (this.arcs.length > this.cap) {
      let old = this.arcs.splice(0, 1)[0]
      snap(this, old)
    }
  }

  del (node) {
    if (this.arcs.includes(node)) {
      let i = this.arcs.indexOf(node)
      this.arcs.splice(i, 1)
      if (this.arcs.length === 0 && this.val === 0) this.tint = 0
    }
  }

  dist (node) {
    return (Math.abs(node.x - this.x) + Math.abs(node.y - this.y))
  }

  tag (root, curr, id) {
    this.id = id
    if (this.tint === 0) this.tint = root.tint
    for (let node of this.arcs) {
      if (node !== root && node !== curr) node.tag(root, this, id)
    }
  }

  nuke () {
    while (this.arcs.length > 0) {
      let node = this.arcs[0]
      snap(node, this)
      node.nuke()
    }
  }

  rand (grid, size) {
    let list = [[0, -1], [-1, 0], [1, 0], [0, 1]]
    for (let i = 0; i < 1; i++) {
      let d = list[Math.floor(Math.random() * list.length)]
      let mx = this.x + d[0]
      let my = this.y + d[1]
      if (mx >= 0 && mx < size && my >= 0 && my < size) {
        let node = grid[mx + my * size]
        link(node, this, false)
      }
    }
  }

  grow (grid, size) {
    let list = [[0, -1], [-1, 0], [1, 0], [0, 1]]
    for (let d of list) {
      let mx = this.x + d[0]
      let my = this.y + d[1]
      if (mx >= 0 && mx < size && my >= 0 && my < size) {
        let next = grid[mx + my * size]
        if (next && next.arcs.length === 0) {
          link(next, this, false)
          return
        }
      }
    }

    if (this.arcs.length === 1) {
      let node = this.arcs[0]
      let mx = this.x + (this.x - node.x)
      let my = this.y + (this.y - node.y)
      if (mx >= 0 && mx < size && my >= 0 && my < size) {
        let next = grid[mx + my * size]
        if (next.arcs.length <= 1 || node.arcs.length === 1) {
          link(next, this, false)
        }
      }
    }
  }

  test () {
    let mod = false
    if (this.arcs.length === 2) {
      let a = this.arcs[0]
      let b = this.arcs[1]

      if (a.arcs.length === 2) {
        let c = a.arcs[0]
        if (c === this) c = a.arcs[1]
        if (b.dist(c) === 1) {
          snap(a, this)
          mod = true
        }
      }

      if (b.arcs.length === 2) {
        let c = b.arcs[0]
        if (c === this) c = b.arcs[1]
        if (a.dist(c) === 1) {
          snap(b, this)
          mod = true
        }
      }
    }
    return mod
  }

  trim (grid, size) {
    let mod = false
    let same = 0
    let list = [[0, -1], [-1, 0], [1, 0], [0, 1]]
    for (let d of list) {
      let mx = this.x + d[0]
      let my = this.y + d[1]
      let nx = this.x + d[0] * 2
      let ny = this.y + d[1] * 2

      let n1 = (mx >= 0 && mx < size && my >= 0 && my < size) ? grid[mx + my * size] : undefined
      let n2 = (nx >= 0 && nx < size && ny >= 0 && ny < size) ? grid[nx + ny * size] : undefined

      if (n1) {
        if (n1.id === this.id) {
          same++
          if (n1.arcs.length === 1 && this.arcs.length === 1) same = 3
        } else if (n2 && n2.id === this.id && this.arcs.length === 1) {
          same = 3
        }
      }
    }
    if (same >= 3) {
      let node = this.arcs[0]
      snap(node, this)
      mod = true
    }
    return mod
  }
}

export function link (a, b, wipe = true) {
  if (a.id === b.id) {
    snap(a, b)
    return
  }
  if (a.tint !== b.tint && a.tint !== 0 && b.tint !== 0) return

  a.add(b, wipe)
  b.add(a, wipe)
  a.tag(b, a, b.id)
  b.tag(a, b, a.id)
}

export function snap (a, b) {
  a.del(b)
  b.del(a)
  a.tag(a, a, a.key)
  b.tag(b, b, b.key)
}

function mix (arr) {
  let cur = arr.length, rand
  while (cur != 0) {
    rand = Math.floor(Math.random() * cur)
    cur--; // Semicolon is mandatory here!
    [arr[cur], arr[rand]] = [arr[rand], arr[cur]]
  }
  return arr
}

export function make (scale) {
  let grid = []
  let sets = []

  for (let y = 0; y < scale; y++) {
    for (let x = 0; x < scale; x++) {
      grid.push(new Node(x, y, x + y * scale))
    }
  }

  grid.forEach(n => n.rand(grid, scale))

  let flux = true
  while (flux) {
    flux = false
    let order = [...grid]
    mix(order)

    order.forEach(n => n.grow(grid, scale))
    order.forEach(n => { flux |= n.test() })
    order.forEach(n => { flux |= n.trim(grid, scale) })
  }


  let ends = grid.filter(n => (n.arcs.length === 1))
  let i = 1

  while (ends.length > 0) {
    let a = ends.pop()
    let b = ends.filter(n => n.id === a.id)[0]

    if (a && b) {
      let tint = (i / 11.3) % 1
      a.val = i
      b.val = i
      a.tint = tint
      b.tint = tint
      a.pair = b
      b.pair = a
      i++
      sets.push([a, b])

      ends = ends.filter(n => n.id !== a.id)
    }
  }

  grid.map(n => n.reset())
  return { grid, sets }
}