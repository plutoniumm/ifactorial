<script>
  export let book;
  const { author, name, isbn, notes } = book;

  const cover = `https://covers.openlibrary.org/b/isbn/${isbn}`;
</script>

<div
  id={isbn}
  class="book t5 d-b f rx20 p5 m5 p-rel"
  class:t5={notes?.includes("*") || false}
>
  <a href={`https://www.amazon.com/s?k=${name} ${author}`}>
    <img class="rx10" src={`${cover}-M.jpg`} loading="lazy" alt={name} />
  </a>

  <a href={`#${isbn}`} class="w-100 f-col j-ar">
    <div class="fw6" style="font-size: 1.2em;">
      {name}
    </div>
    <i class="d-i"> {author} </i>
  </a>
</div>

<style lang="scss">
  .t5 {
    background: #fd04;
    box-shadow:
      5px 5px 5px #bbb,
      -5px -5px 5px #fff;

    &::after {
      content: "★";
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 2em;
      color: #db0;
    }
  }
  i {
    color: #222;
  }
  img {
    width: auto;
    width: 150px;
    aspect-ratio: 3/4 !important;
    margin-right: 10px;
    object-fit: cover;

    border-right: 3px solid #8888;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

    background-image: url("/icons/if.svg");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 50% auto;
  }

  .book {
    --scale: 33%;
    width: calc(var(--scale) - 40px);
    z-index: 1;
  }

  @media (max-width: 768px) {
    .book {
      --scale: 50%;
    }
  }
  @media (max-width: 768px) {
    .book {
      --scale: 100%;
    }
    img {
      max-width: 120px;
    }
  }
</style>
