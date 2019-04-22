var app = new Vue({
  el: '#app',
  data: {
    volume: player.volume,
    lastVolume: player.volume,
    currentTime: 0.0,
    isPlaying: false
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
      //здесь используется отдельное this.isPlaying потому, что
      //тут (походу) не реактивно свойство player.paused;
      //так и не сумел понять, почему (c) Олег
      return (this.isPlaying ? "btn-pause" : "btn-play");
    },

    btnMuteClass: function () {
      return (this.volume != 0 ? "btn-volume" : "btn-muted");
    }
  }

});
