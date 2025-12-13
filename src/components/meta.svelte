<script>
  export let description = "";
  export let name = "";

  let title = "Bookmaker";
  if (name) {
    title += ` | ${name}`;
  }

  let desc = description.slice(0, 155);
  if (description.length > 155) {
    desc += "…";
  }
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={desc} />
  <meta name="author" content="plutoniumm" />

  <!-- og -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={desc} />
  <meta property="og:type" content="website" />

  <!-- twit -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={desc} />

  <!-- config -->
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="HandheldFriendly" content="True" />
  <meta name="MobileOptimized" content="320" />
  <meta
    name="viewport"
    content="width=device-width, target-densitydpi=160dpi, initial-scale=1.0, maximum-scale=1, user-scalable=no, minimal-ui"
  />
</svelte:head>
