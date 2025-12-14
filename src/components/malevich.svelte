<script lang="ts">
  export let seed = 99;
  export let width = 600;
  export let height = 400;

  function name2num(name: string): number {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash |= 0;
    }

    return Math.abs(hash);
  }

  function rng(seed) {
    let s = seed >>> 0;

    return () => (s = (1664525 * s + 1013904223) >>> 0) / 2 ** 32;
  }

  function generate(seed) {
    const r = rng(seed);
    const shapes = [];
    const n = 40 + Math.floor(r() * 8);
    const colors = [
      "#FBB",
      "#FDA",
      "#FFB",
      "#DFC",
      "#AFF",
      "#ACF",
      "#CBF",
      "#FCF",
    ];

    for (let i = 0; i < n; i++) {
      const t = r();
      const cx = r() * width;
      const cy = r() * height;
      const rot = r() * 360;
      const color = colors[Math.floor(r() * colors.length)];

      if (t < 0.25) {
        shapes.push({
          type: "rect",
          x: cx - r() * 20,
          y: cy - r() * 20,
          w: 8 + r() * 30,
          h: 8 + r() * 30,
          rot,
          color,
        });
      } else if (t < 0.5) {
        shapes.push({
          type: "circle",
          cx,
          cy,
          r: 5 + r() * 18,
          color,
        });
      } else if (t < 0.75) {
        const size = 10 + r() * 35;
        const angle = r() * Math.PI * 2;
        const a1 = angle;
        const a2 = angle + (2 * Math.PI) / 3;
        const a3 = angle + (4 * Math.PI) / 3;
        const p1 = { x: cx + Math.cos(a1) * size, y: cy + Math.sin(a1) * size };
        const p2 = { x: cx + Math.cos(a2) * size, y: cy + Math.sin(a2) * size };
        const p3 = { x: cx + Math.cos(a3) * size, y: cy + Math.sin(a3) * size };
        shapes.push({
          type: "tri",
          p1,
          p2,
          p3,
          color,
        });
      } else {
        const long = 40 + r() * 120;
        const thin = 2 + r() * 6;
        const horiz = r() < 0.5;
        const w = horiz ? long : thin;
        const h = horiz ? thin : long;
        shapes.push({
          type: "bar",
          x: cx - w / 2,
          y: cy - h / 2,
          w,
          h,
          rot,
          color,
        });
      }
    }
    return shapes;
  }

  $: shapes = generate(typeof seed === "string" ? name2num(seed) : seed);
</script>

<svg class="d-b" {width} {height} viewBox={`0 0 ${width} ${height}`}>
  {#each shapes as s}
    {#if s.type === "rect"}
      <rect
        x={s.x}
        y={s.y}
        width={s.w}
        height={s.h}
        fill={s.color}
        transform={`rotate(${s.rot} ${s.x + s.w / 2} ${s.y + s.h / 2})`}
      />
    {:else if s.type === "circle"}
      <circle cx={s.cx} cy={s.cy} r={s.r} fill={s.color} />
    {:else if s.type === "bar"}
      <rect
        x={s.x}
        y={s.y}
        width={s.w}
        height={s.h}
        fill={s.color}
        transform={`rotate(${s.rot} ${s.x + s.w / 2} ${s.y + s.h / 2})`}
      />
    {:else}
      <polygon
        points={`${s.p1.x},${s.p1.y} ${s.p2.x},${s.p2.y} ${s.p3.x},${s.p3.y}`}
        fill={s.color}
      />
    {/if}
  {/each}
</svg>

<style>
  svg {
    stroke-width: 0;
    border-radius: 12px;
  }
</style>
