<script lang="ts">
  export let seed = 21;
  export let width = 1000;
  export let height = 1000;

  function mulberry32(SD: number) {
    return function () {
      let t = (SD += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const rand = mulberry32(seed);

  interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
  }

  let rects: Rect[] = [];

  const minSize = 32;
  function subdivide(rect: Rect) {
    const { x, y, w, h } = rect;

    if (w < minSize * 2 && h < minSize * 2) {
      rects.push(rect);
      return;
    }

    const splitHorizontally = rand() > 0.5;

    if (splitHorizontally && h >= minSize * 2) {
      const split = (0.3 + rand() * 0.4) * h; // [30%, 70%]
      const top = { x, y, w, h: split };
      const bottom = { x, y: y + split, w, h: h - split };

      subdivide(top);
      subdivide(bottom);
    } else if (!splitHorizontally && w >= minSize * 2) {
      const split = (0.3 + rand() * 0.4) * w;
      const left = { x, y, w: split, h };
      const right = { x: x + split, y, w: w - split, h };
      subdivide(left);
      subdivide(right);
    } else {
      rects.push(rect);
    }
  }

  subdivide({ x: 0, y: 0, w: width, h: height });

  const palette = [
    "#FBB",
    "#FDA",
    "#FFB",
    "#DFC",
    "#AFF",
    "#ACF",
    "#CBF",
    "#FCF",
    "none",
  ];

  const col = () => palette[Math.floor(rand() * palette.length)];
</script>

<svg class="d-b" {width} {height} viewBox="0 0 {width} {height}">
  {#each rects as r}
    <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={col()} />
  {/each}
</svg>

<style>
  svg {
    stroke-width: 0;
    border-radius: 12px;
  }
</style>
