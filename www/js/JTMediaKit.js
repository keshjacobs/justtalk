
        AudioContext = window.AudioContext || window.webkitAudioContext;
        let AudioCxt = new AudioContext({
            latencyHint: 'interactive',
            sampleRate: 44100
          });
         let source = AudioCxt.createBufferSource();
        let gainNode = AudioCxt.createGain();
        let biquadFilter = AudioCxt.createBiquadFilter();
        gainNode.gain.value = 1;
        biquadFilter.type = "lowshelf";
        biquadFilter.frequency.value = 1000;
        biquadFilter.gain.value = 1;
      
   const play_audio = function (audio) {
        var AudioMan=AudioCxt;
        // var gainNode=gainNode;
        // let aud = document.createElement('audio');
        // aud.crossOrigin = "anonymous";   
        // aud.muted = false;
        // aud.loop = false;
        // aud.autoplay = true;
        // aud.src = audio;
        // aud.load();
        var source = AudioCxt.createBufferSource();
        window.fetch(audio).then(function(response) {
            return response.arrayBuffer();
          }).then(function(arrayBuffer) {
        AudioMan.decodeAudioData(arrayBuffer, function(buffer) {
        source.connect(AudioMan.destination);
        source.buffer = buffer;
        console.log("Buffer:");
        source.loop=false;
        source.autoplay=true;
        console.log(buffer);
        // source = AudioMan.createMediaElementSource(aud);

        // console.log("source:");
        // console.log(source);
        // source = AudioCxt.createMediaStreamSource(audio);
        // source.connect(this.analyser);
        // this.analyser.connect(biquadFilter);
        // source.connect(gainNode);
        source.connect(AudioMan.destination);
       if(AudioMan.state === 'stopped') {
        console.log("resume!!!");
        AudioMan.resume();
        }else{      
            console.log("reup!");
            source.start();
        }
        });  
    });
      };
      
    const pause_audio=function(){
        if(AudioCxt.state === 'running' || AudioCxt.state === 'suspended') {
            AudioCxt.suspend();
          }else{
            source.stop();
            source.noteOff(0);
          }
      }

     function unlock_media() {
        source = AudioCxt.createBufferSource();
        console.log("unlocking");
        // create empty buffer and play it
        var buffer = AudioCxt.createBuffer(1, 1, 22050);
        source.buffer = buffer;
        source.connect(AudioCxt.destination);
        if (source.start) {
            source.start(0);
            } else if (source.play) {
                source.play(0);
            } else if (source.noteOn) {
                source.noteOn(0);
            }
      }






