<script lang="ts">
  export let book;
  const { author, name, isbn, notes, index } = book;

  let active = false || notes?.includes("*");

  const links = [
    {
      name: "amazon",
      url: `https://www.amazon.com/s?k=${name} ${author}`,
      icon: "/icons/amzn.png",
    },
    {
      name: "flipkart",
      url: `https://www.flipkart.com/search?q=${name} ${author}`,
      icon: "/icons/flip.webp",
    },
    {
      name: "goodreads",
      url: `https://www.goodreads.com/search?q=${name} ${author}`,
      icon: "/icons/gr.png",
    },
  ];
</script>

<div
  data-key={index}
  id={isbn}
  class="book t5 d-b f rx20 p5 m5 p-rel"
  class:t5={active}
  class:raise={active}
>
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <a href={`#${isbn}`}>
    <enhanced:img
      class="rx10 hero"
      src={`/images/${isbn}.jpg?w=300;600;900&format=webp;avif;png&quality=80`}
      loading="lazy"
      alt={name}
    />
  </a>

  <div class="w-100 f-col j-ar">
    <div class="fw6" style="font-size: 1.2em;">
      #{Number(index) + 1}.
      {name}
    </div>
    <i class="d-i"> {author} </i>

    <div class="external d-n">
      {#each links as link}
        <a
          href={link.url}
          class="d-ib"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img class="rx5" src={link.icon} alt={`${link.name} icon`} />
        </a>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .external {
    user-select: none;

    a {
      margin-right: 10px;
    }

    & img {
      width: 28px;
      height: 28px;
      background: #fff;
    }
  }

  .t5 {
    background: #fd04;
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

  img:not(.external img) {
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
