<script>
  import Meta from "@components/meta.svelte";
  import { onMount } from "svelte";
  import "./2048.css";
  import { GameManager, KeyboardInputManager, HTMLActuator } from ".";

  onMount(() => new GameManager(4, KeyboardInputManager, HTMLActuator));
</script>

<Meta description="Flow based on numberlink" name="Flow Game" />

<div class="container">
  <div class="heading">
    <h1 class="title">2<sup>17</sup></h1>

    <button id="undo-button">
      <svg
        viewBox="0 0 32 32"
        width="28"
        height="28"
        fill="transparent"
        stroke="#fff"
      >
        <path
          d="M29 16 C29 22 24 29 16 29 8 29 3 22 3 16 3 10 8 3 16 3 21 3 25 6 27 9 M20 10 L27 9 28 2"
        />
      </svg>
    </button>
    <button id="restart-button">
      <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="#fff">
        <path d="M16 2 L2 16 16 30 16 16 30 30 30 2 16 16 Z" />
      </svg>
    </button>
  </div>

  <div class="game game-container">
    <div class="game-message">
      <p></p>
      <div class="lower">
        <a id="keep-button">Keep going</a>
        <a id="retry-button">Try again</a>
      </div>
    </div>

    <div class="grid">
      <div class="grid-row">
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
      </div>
      <div class="grid-row">
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
      </div>
      <div class="grid-row">
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
      </div>
      <div class="grid-row">
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
      </div>
    </div>

    <div class="tile"></div>
  </div>
</div>

<style>
</style>
