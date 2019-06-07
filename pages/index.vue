<template>
<div id="rootdiv">

  <audio id="player" @timeupdate="onTimeUpdate" @loadeddata="onLoadedData">
    <source src="../assets/mp3/testaudio.mp3" type="audio/mpeg">
  </audio>

  <div class="slidercontainer">

    <div class="div-button-control">
      <button id="btnPlayPause" @click="PlayPause" :class="btnPlayClass" title="Начать воспроизведение"></button>
      <button id="btnStop" @click="stop" class="btn-stop" title="Остановить воспроизведение"></button>
    </div>

    <input type="range" id="trackBarDuration" min="0"
           v-model="currentTime"
           @change="onChangeDuration"
           class="slider-duration" step="1"/>
    <div class="div-volume">
      <input type="range" id="trackBarVolume" min="0" max="1" v-model="volume"
             @change="onChangeVolume"
             class="slider-volume"
             step="0.01"/>
      <button id="mute-btn" @click="mute" :class="btnMuteClass" title="Без звука"></button>
    </div>

    <div class="duration-info">{{currentTimeFormatted}} / {{durationFormatted}}</div>

  </div>

</div>
</template>

<script>

// var fs = window.fs; //require('fs');
// var mm = require('musicmetadata');
//var fileurl = "D:/projects/web/AudioPlayer/assets/mp3/testaudio.mp3 ";

var volumeDefault = 0.2;

export default {
  data() {
    return {
      volume: volumeDefault, //player.volume,
      lastVolume: volumeDefault, //player.volume,
      currentTime: 0.0,
      isPlaying: false,
      durationFormatted: '0'
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

      if (player.paused)
      {
        player.play();
        this.isPlaying = true;
        btnPlayPause.title = "Приостановить воспроизведение";
      }
      else
      {
        player.pause();
        this.isPlaying = false;
        btnPlayPause.title = "Продолжить воспроизведение";
      }
    },

    stop() {
      player.pause();
      player.currentTime = 0;
      this.isPlaying = false;
      btnPlayPause.title = "Начать воспроизведение";
    },
    onTimeUpdate() {
      this.currentTime = player.currentTime;
    },
    onLoadedData() {
      this.durationFormatted = Math.floor(player.duration/60) + ':'
                       + Math.floor(player.duration%60).toString().padStart(2, '0');

      trackBarDuration.max = Math.floor(player.duration);
    }
  },
  computed: {
    btnPlayClass: function () {
      return (this.isPlaying ? "btn-pause" : "btn-play");
    },

    btnMuteClass: function () {
      return (this.volume != 0 ? "btn-volume" : "btn-muted");
    },

    currentTimeFormatted: function() {
      return Math.floor(this.currentTime/60) + ':'
                       + Math.floor(this.currentTime%60).toString().padStart(2, '0');
    }
  },
  mounted() {
    player.volume = this.volume;
  }
}
</script>

<style lang="scss">

$thumb-width: 14px;
$thumb-height: 14px;

@mixin slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: $thumb-width;
  height: $thumb-height;
  border-radius: 50%;
  background: rgb(128,128,128); //rgb(209, 213, 214);
}

@mixin btn-volume {
  background-position: center;
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

// #rootdiv {
//   border: 1px solid;
//   display: flex;
//   justify-content: center;
//   text-align: center
// }

button {
  border: 0;
  width: 37px;
  height: 37px;
  cursor: pointer;
}

button:focus {
  outline:none;
}

input[type="range"] {
  background: rgb(64,64,66);
  height: 5px;
  cursor: pointer;
}

.slidercontainer {
  margin-bottom: 30px;
  padding: 20px;
  display: inline-block;
  border-radius: 8px;
  background-color: rgb(231, 235, 238);
}

.div-volume {
  display:inline-block;
  margin-left: 30px;
}

.btn-play {
  background:url(../assets/img/play.png) no-repeat transparent;
  background-position: center;
}

.btn-pause {
  background:url(../assets/img/pause.png) no-repeat transparent;
  background-position: center;
}

.btn-stop {
  background:url(../assets/img/stop.png) no-repeat transparent;
  background-position: center;
  width: 32px;
  height: 32px;
}

.btn-volume {
  background:url(../assets/img/volume.png) no-repeat transparent;
  @include btn-volume;
}

.btn-muted {
  background:url(../assets/img/muted.png) no-repeat transparent;
  @include btn-volume;
}

.div-button-control {
  margin-top: 10px;
}

.slider-duration {
  -webkit-appearance: none;
  appearance: none;
  width: 300px;
  //height: 10px;
  border-radius:10px;
  outline: none;
  opacity: 0.7;
}

.slider-duration::-webkit-slider-thumb {
  @include slider-thumb;
}

.slider-volume {
  -webkit-appearance: none;
  appearance: none;
  width: 70px;
  border-radius: 10px;
  outline: none;
  opacity: 0.7;
  padding: 0px;
  border: 0;
}

.slider-volume::-webkit-slider-thumb {
  @include slider-thumb;
  /* box-shadow: makelongshadow(#e33d44, $shadow-size); */
  //box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}

// ::-ms-fill-lower {
//   background: #d3d3d3;
//   height: $thumb-height;
// }

.duration-info {
  margin-top: 5px;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 12px;
}


</style>
