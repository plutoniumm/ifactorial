<script lang="ts">
  export let url: string;
  export let name: string;
  export let dim = false;
</script>

<a
  class="rpm-10 d-b p-rel ptr f-col rx20 raise interact"
  class:dim
  href={url}
>
  <slot></slot>

  <div class="p-abs f-col j-ct fw7 year">
    {name}
  </div>
</a>

<style>
  a {
    width: 300px;
    height: 150px;
  }

  .dim {
    filter: saturate(0.15);
  }

  .year {
    color: #222;
    font-size: 3rem;
    bottom: 7px;
    left: 17px;

    text-shadow:
      0 0 20px #888a,
      0 0 30px #888;
  }
</style>
