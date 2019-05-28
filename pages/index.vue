<template>
<div>

  <audio id="player" @timeupdate="onTimeUpdate">
    <source src="../assets/mp3/testaudio.mp3" type="audio/mpeg">
  </audio>

  <div id="mydiv"></div>
  <div class="slidercontainer">
    <input type="range" id="trackBarDuration" min="0" v-model="currentTime" @change="onChangeDuration" class="slider-duration" step="1"/>
    <div class="div-volume">
      <input type="range" id="trackBarVolume" min="0" max="1" v-model="volume" @change="onChangeVolume" class="slider-volume" step="0.01"/>
      <button id="mute-btn" @click="mute" class="btn-control" :class="btnMuteClass" title="Без звука"></button>
    </div>

    <div class="div-button-control">
      <button id="play-btn" @click="PlayPause" :class="btnPlayClass" title="Начать воспроизведение"></button>
      <button id="play-btn" @click="stop" class="btn-stop" title="Остановить воспроизведение"></button>
    </div>
  </div>

</div>
</template>

<script>
//import Logo from '~/components/Logo.vue'

export default {
  data() {
    return {
      volume: 0.5, //player.volume,
      lastVolume: 0.5, //player.volume,
      currentTime: 0.0,
      isPlaying: false
    }
  },
  methods: {
    mute() {

      player.muted = !player.muted;

      if (player.muted)
        this.volume = parseFloat(trackBarVolume.min);
      else
        this.volume = this.lastVolume;
    },

    onChangeVolume() {
      player.volume = parseFloat(trackBarVolume.value);
      this.volume = player.volume;
      this.lastVolume = player.volume;
    },

    onChangeDuration() {
      player.currentTime = trackBarDuration.value;
    },

    PlayPause() {
      trackBarDuration.max = player.duration;

      if (player.paused)
      {
        player.play();
        this.isPlaying = true;
      }
      else
      {
        player.pause();
        this.isPlaying = false;
      }
    },

    stop() {
      player.pause();
      player.currentTime = 0;
      this.isPlaying = false;
    },
    onTimeUpdate() {
      this.currentTime = player.currentTime;
    }
  },
  computed: {
    btnPlayClass: function () {
      return (this.isPlaying ? "btn-pause" : "btn-play");
    },

    btnMuteClass: function () {
      return (this.volume != 0 ? "btn-volume" : "btn-muted");
    }
  }

}
</script>

<style>

button {
  border: 0;
  background-position: center;
  width: 24px;
  height: 24px;
}

#app {
  width:100%,auto;
  background-color: rgb(67, 108, 160);
}

.div-volume {
  display:inline-block;
  margin-left: 30px;
}

.btn-play {
  background:url(../static/img/play.png) no-repeat transparent;
}

.btn-pause {
  background:url(../static/img/pause.png) no-repeat transparent;
}

.btn-stop {
  background:url(../static/img/stop.png) no-repeat transparent;
}

.btn-volume {
  background:url(../static/img/volume.png) no-repeat transparent;
}

.btn-muted {
  background:url(../static/img/muted.png) no-repeat transparent;
}

.div-button-control {
  margin-top: 10px;
}

.slidercontainer {
  margin-bottom: 30px;
}

.slider-duration {
  -webkit-appearance: none;
  appearance: none;
  width: 300px;
  height: 5px;
  border-radius: 5px;
  background: #d3d3d3; /*#e33d44;*/
  outline: none;
  opacity: 0.7;
}

.slider-duration::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 7px;
  height: 15px;
  background: #000;
  cursor: pointer;
}

.slider-volume {
  -webkit-appearance: none;
  appearance: none;
  width: 70px;
  height: 5px;
  border-radius: 5px;
  background: #d3d3d3; /*#e33d44;*/
  outline: none;
  opacity: 0.7;
}

.slider-volume::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
  /* box-shadow: makelongshadow(#e33d44, $shadow-size); */
}
</style>
