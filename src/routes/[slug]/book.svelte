<script>
  export let book;

  const img = (cover) => `https://covers.openlibrary.org/b/id/${cover}-M.jpg`;
  const { OLID, author, name, cover, index } = book;
</script>

<div id={OLID} class="book d-b f rx10 p5 m5 p-rel">
  <a href={`https://www.amazon.com/s?k=${name} ${author}`}>
    <img
      class="rx10"
      src={cover !== 0 ? img(cover) : "/icons/if.svg"}
      alt={name}
      loading="lazy"
      decoding="async"
    />
  </a>

  <a href="#{OLID}" class="w-100 f-col j-ar">
    <div class="fw6" style="font-size: 1.25em;">
      {parseInt(index)}.<br />
      {name}
    </div>
    <i class="d-i"> {author} </i>
  </a>
</div>

<style lang="scss">
  i {
    color: #222;
  }
  img {
    width: auto;
    max-width: 150px;
    aspect-ratio: 3/4 !important;
    margin-right: 10px;
    object-fit: cover;

    border-right: 3px solid #8888;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
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
    ¸ .book {
      --scale: 100%;
    }
    img {
      max-width: 120px;
    }
  }
</style>
