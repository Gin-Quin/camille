<script lang="ts">
    import { swipe } from "svelte-gestures";
    import Analysis from "./pages/Analysis.svelte";
    import Chatbot from "./pages/Chatbot.svelte";
    import Info from "./pages/Info.svelte";

    let page = $state(2);

    function handleSwipe(event: CustomEvent) {
        if (event.detail.direction === "left" && page < 3) {
            page++;
        } else if (event.detail.direction === "right" && page > 1) {
            page--;
        }
        console.log("Current page:", page);
    }
</script>

<svelte:head>
    <style>
        body {
            margin: 0;
            overflow: hidden;
        }
    </style>
</svelte:head>

<section class="home">
    <!-- Main content -->
    <div
        style:width="100dvw"
        style:height="100dvh"
        use:swipe={() => ({})}
        onswipe={handleSwipe}
    >
        {#if page === 1}
            <Info />
        {:else if page === 2}
            <Chatbot />
        {:else if page === 3}
            <Analysis />
        {/if}
    </div>
</section>

<style>
    .home {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        background-image: url("../assets/img/background-colors.png");
        background-size: 300%;
        background-position: center;
    }
</style>
