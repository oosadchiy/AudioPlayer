<template>
<div id="rootdiv">

  <audio id="player" @timeupdate="onTimeUpdate" @loadeddata="onLoadedData">
    <source src="../assets/mp3/testaudio.mp3" type="audio/mpeg">
  </audio>

  <div class="slidercontainer">
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

    <div class="div-button-control">
      <!-- <div>{{durationStr}}</div> -->

      <button id="btnPlayPause" @click="PlayPause" :class="btnPlayClass" title="Начать воспроизведение"></button>
      <button id="btnStop" @click="stop" class="btn-stop" title="Остановить воспроизведение"></button>
    </div>
  </div>

</div>
</template>

<script>
//import Logo from '~/components/Logo.vue'

var volumeDefault = 0.2;

export default {
  data() {
    return {
      volume: volumeDefault, //player.volume,
      lastVolume: volumeDefault, //player.volume,
      currentTime: 0.0,
      isPlaying: false,
      durationStr: '0'
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
      this.durationStr = Math.floor(player.duration/60) + ':'
                       + Math.floor(player.duration%60).toString().padStart(2, '0');
    }
  },
  computed: {
    btnPlayClass: function () {
      return (this.isPlaying ? "btn-pause" : "btn-play");
    },

    btnMuteClass: function () {
      return (this.volume != 0 ? "btn-volume" : "btn-muted");
    },
  },
  mounted() {
    player.volume = this.volume;
    //this.duration = player.duration;
  }
}
</script>

<style lang="scss">

$thumb-width: 7px;
$thumb-height: 7px;

@mixin slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: $thumb-width;
  height: $thumb-height;
  border-radius: 50%;
  background: rgb(209, 213, 214); //#d3d3d3;
}

@mixin btn-volume {
  background-position: center;
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

#rootdiv {
  //border: 1px solid;
  // display: flex;
  // justify-content: center;
  //text-align: center
}

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
  background: rgb(64,64,66); //#000;
  height: $thumb-height;
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

// .slider-volume::-webkit-slider-thumb {
//
// }

::-ms-fill-lower {
  background: #d3d3d3;
  width: auto;
  height: $thumb-height;
}

</style>
