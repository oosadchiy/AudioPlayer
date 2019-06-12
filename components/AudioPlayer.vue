<template>
<div class="maincontainer">

  <div class="container">
    <div>
      <div class="now-playing-header">
        Now Playing
      </div>

      <div class="track-info-current">
        <template v-if="currentTrack != null">
          <div class="cover-box">
            <img id="coverImgCurrent" class="cover-img-current" :src="require('../assets/img/cover/'+this.currentTrack.img)"/>
          </div>
          <div class="track-title track-title-current">{{this.currentTrack.title }}</div>
          <div class="track-artist track-artist-current">{{this.currentTrack.artist }}</div>
        </template>
        <template v-else>
          <div class="track-title"></div>
          <div class="track-artis"></div>
        </template>
      </div>

    </div>

    <input type="range" id="trackBarDuration" min="0"
           v-model="currentTime"
           @change="onChangeDuration"
           class="slider-duration" step="1"/>

     <div>
       <div id="divCurrentTime" class="track-time-info">{{currentTimeFormatted}}</div>
       <div id="divDuration" class="track-time-info duration-info">--:--</div>
     </div>

    <div class="div-volume">
      <input type="range" id="trackBarVolume" min="0" max="1" v-model="volume"
             @change="onChangeVolume"
             class="slider-volume"
             step="0.01"/>
      <button id="btnMute" @click="mute" :class="btnMuteClass" title="Mute"></button>
    </div>

    <div class="div-button-control">
      <button id="btnPrev" @click="moveToPrev(trackIndex)" class="btn-prev" title="Previous track"></button>
      <div id="divLoading"></div>
      <button id="btnPlayPause"
              @click="PlayPause"
              :class="btnPlayClass"
              title="Play"></button>
      <button id="btnNext" @click="moveToNext(trackIndex)" class="btn-next" title="Next track"></button>
    </div>

  </div>

  <div class="container">
    <div class="now-playing-header">
      Queue
    </div>

    <ul class="track-list">
      <li v-for="(track, index) in trackList" @click="selectTrack(index)" title="Click to start playing">
        <img class="cover-img" :src="require('../assets/img/cover/'+track.img)"/>
        <div class="inline">
          <div class="track-title">{{track.title}}</div>
          <div class="track-artist top3">{{track.artist}}</div>
        </div>
        <hr/>
      </li>
    </ul>
  </div>

</div>
</template>

<script>

const {Howl, Howler} = require('howler');

function updateCurrentPosition() {
  //currentTime = Math.floor(sound.seek());
  // var data = comp.data();
  // console.log(data.currentTime);
};

var volumeDefault = 0.55;

export default {
  data() {
    return {
      volume: volumeDefault,
      lastVolume: volumeDefault,
      currentTime: 0.0,
      isPlaying: false,
      currentTrack: null,
      trackIndex: 0,
      trackList: [
        {
          artist: 'Awolnation',
          title: 'Sail',
          file: 'Awolnation_Sail.mp3',
          sound: null,
          img: 'Awolnation_Sail.png'
        },
        {
          artist: 'Clutch',
          title: 'A quick death in Texas',
          file: 'Clutch_A_quick_death_in_Texas.mp3',
          sound: null,
          img: 'Clutch_A_quick_death_in_Texas.png'
        },
        {
          artist: 'Clutch',
          title: 'Electric worry',
          file: 'Clutch_Electric_worry.mp3',
          sound: null,
          img: 'Clutch_Electric_worry.png'
        },
        {
          artist: 'Fatboy Slim',
          title: 'Song for Lindy',
          file: 'Fatboy_Slim_Song_for_Lindy.mp3',
          sound: null,
          img: 'Fatboy_Slim_Song_for_Lindy.png'
        },
        {
          artist: 'Rammstein',
          title: 'Feuer Frei!',
          file: 'Rammstein_Feuer_Frei.mp3',
          sound: null,
          img: 'Rammstein_Feuer_Frei.png'
        }
      ]
    }
  },
  methods: {
    PlayPause() {

      var track = this.trackList[this.trackIndex];
      if (track == null) return;

      var sound;

      if (track.sound != null) {
        sound = track.sound;
      }
      else {
        sound = new Howl({
          src: [require('../assets/mp3/'+track.file)],
          html5: true,
          onload: function() {
            divLoading.style.display = 'none';
            btnPlayPause.style.display = 'inline-block';

            var duration  = sound.duration();
            divDuration.innerHTML = Math.floor(duration/60) + ':'
                             + Math.floor(duration%60).toString().padStart(2, '0');

            trackBarDuration.max = Math.floor(duration);
          },
          onend: function () {

          },
          onseek: function () {

          },
          onplay: function () {
            updateCurrentPosition();
          }
        });

        track.sound = sound;
      };

      this.currentTrack = track;

      if (sound.state() == 'loaded') {
        btnPlayPause.style.display = 'inline-block';
        divLoading.style.display = 'none';
      }
      else {
        btnPlayPause.style.display = 'none';
        divLoading.style.display = 'inline-block';
      }

      if (sound.playing())
      {
        sound.pause();
        this.isPlaying = false;
        btnPlayPause.title = "Play";
      }
      else
      {
        sound.play();
        this.isPlaying = true;
        btnPlayPause.title = "Pause";
      }

    },

    moveToPrev() {
      var newIndex = this.trackIndex;
      if (newIndex > 0)
        newIndex--;
      else
        newIndex = this.trackList.length - 1;

      this.selectTrack(newIndex);
    },

    moveToNext() {
      var newIndex = this.trackIndex;
      if (newIndex < this.trackList.length - 1)
        newIndex++;
      else
        newIndex = 0;

      this.selectTrack(newIndex);
    },

    selectTrack(index) {
      this.trackIndex = index;

      if (this.currentTrack != null && this.currentTrack.sound != null)
        this.currentTrack.sound.stop();

      this.currentTime = 0;

      this.PlayPause();
    },

    mute() {
      if (Howler._muted)
      {
        Howler.mute(false);
        this.volume = this.lastVolume;
        btnMute.title = "Mute";
      }
      else
      {
        Howler.mute(true);
        this.volume = parseFloat(trackBarVolume.min);
        btnMute.title = "Unmute";
      }
    },

    onChangeVolume() {
      var vol = parseFloat(trackBarVolume.value);
      if (Howler._muted && vol > 0)
        Howler.mute(false);
      Howler.volume(vol);
      this.volume = vol;
      this.lastVolume = vol;
    },

    onChangeDuration() {
      if (this.currentTrack == null || this.currentTrack.sound == null)
        return;

      this.currentTrack.sound.seek(trackBarDuration.value);
    },

    // onTimeUpdate() {
    //   // this.currentTime = player.currentTime;
    // },

    // updateCurrentPosition() {
    //   console.log('updateCurrentPosition');
    // }
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
    this.currentTrack = this.trackList[0];

    var sound = new Howl({
      src: [require('../assets/mp3/'+this.currentTrack.file)],
      html5: true,
      onload: function() {
        divLoading.style.display = 'none';
        btnPlayPause.style.display = 'inline-block';

        var duration  = sound.duration();
        divDuration.innerHTML = Math.floor(duration/60) + ':'
                         + Math.floor(duration%60).toString().padStart(2, '0');

        trackBarDuration.max = Math.floor(duration);
      },
      onseek: function () {

      },
      onplay: function () {
        updateCurrentPosition();
      }
    });
  }
};

</script>

<style lang="scss">

$thumb-width: 14px;
$thumb-height: 14px;

body {
  font-family: Geneva;
}

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
  position: relative;
  top: 5px;
  float: right;
}

#divLoading {
  width: 61px;
  height: 61px;
  background-color: #000; //#fff;
  border-radius: 100%;
  -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;
  animation: sk-scaleout 1s infinite ease-in-out;
  display: none; // inline-block;
}

// @-webkit-keyframes sk-scaleout {
//   0% { -webkit-transform: scale(0) }
//   100% {
//     -webkit-transform: scale(1.0);
//     opacity: 0;
//   }
// }

@keyframes sk-scaleout {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
  } 100% {
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
    opacity: 0;
  }
}

button {
  border: 0;
  width: 61px;
  height: 61px;
  cursor: pointer;
}

button:focus {
  outline:none;
}

input[type="range"] {
  background: #82829C; //#D7DEF4;
  height: 2px;
  outline:none;
  cursor: pointer;
}

.maincontainer {
  //border: 1px solid;
  width:100%;
  height:100%;
  position:fixed;
  top:0;
  left:0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #D7DEED;
}

.container {
  padding: 20px;
  margin-right: 50px;
  display: inline-block;
  border-radius: 10px;
  width: 300px;
  height: 500px;
  background-color: #fff;
}

.div-volume {
  margin-top: 10px;
  margin-bottom: 10px;
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

.btn-prev {
  background:url(../assets/img/prev.png) no-repeat transparent;
  background-position: center;
}

.btn-next {
  background:url(../assets/img/next.png) no-repeat transparent;
  background-position: center;
}

.div-button-control {
  margin-top: 30px;
  text-align: center;
}

.slider-duration {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  border-radius:15px;
  opacity: 0.7;
}

.slider-duration::-webkit-slider-thumb {
  @include slider-thumb;
  width: 8px;
  height: 8px;
}

.slider-volume {
  -webkit-appearance: none;
  appearance: none;
  width: 90%;
  border-radius: 15px;
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

.track-time-info {
  margin-top: 1px;
  //margin-bottom: 5px;
  font-weight: bold;
  font-size: 10px;
  display: inline-block;
  color: #82829C;
  vertical-align: top;
}

.duration-info {
  float: right;
}

.track-list {
  list-style-type: none;
  //letter-spacing: 0.5px;
  margin-left: 0;
  padding-left: 0;

  li {
    margin-bottom: 10px;
    cursor: pointer;
    //background: #D7DEF4;
  }

  hr {
    margin-top: 5px;
    border: 0;
    background: #D7DEF4;
    height: 1px;
    color: #D7DEF4;
  }
}

.track-title {
  font-size: 16px;
  color: #82829C; // rgb(150, 153, 157);
  font-weight: bold;
  //border: 1px solid;
}

.track-title-current {
  font-size: 20px;
}

.track-artist {
  font-size: 14px;
  color: #B4C1DC; // rgb(150, 153, 157);
  font-weight: bold;
  //border: 1px solid;
}

.track-artist-current {
  font-size: 18px;
}

.cover-box {
  //border: 1px solid;
  text-align: center;
  margin-bottom: 5px;
}

.track-info-current {
  //border: 1px solid;
  text-align: center;
  margin-top: 10px;
}

.cover-img-current {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.cover-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.now-playing-header {
  //height: 50px;
  //border: 1px solid;
  padding-bottom: 10px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #82829C;
}

.inline {
  display: inline-block;
  vertical-align: top;
  //border: 1px solid;
}

.top3 {
  margin-top: 3px;
}

</style>
