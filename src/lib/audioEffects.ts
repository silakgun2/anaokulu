// Web Audio API Sound Synthesizer & Speech for Preschool Kids Interactive Games

class SoundService {
  private ctx: AudioContext | null = null;
  public soundEnabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Cute bubble click
  playPop() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // ignore audio errors
    }
  }

  // Star award chime
  playStarChime() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.45);
      });
    } catch {
      // ignore
    }
  }

  // Success Fanfare
  playSuccess() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const freqs = [440, 554.37, 659.25, 880];
      freqs.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.06);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.06 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.06);
        osc.stop(this.ctx.currentTime + i * 0.06 + 0.35);
      });
    } catch {
      // ignore
    }
  }

  // Soft Boing (Try again)
  playBoing() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch {
      // ignore
    }
  }

  // Animal voice imitation / sound effect
  playAnimalSound(animalType: string) {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (animalType === 'cat') {
        // Cat meow pitch glide
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(750, this.ctx.currentTime + 0.2);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.5);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.55);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.6);
        this.speak('Miyav! Kedi');
      } else if (animalType === 'dog') {
        // Dog bark
        [0, 0.2].forEach((t) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(250, this.ctx.currentTime + t);
          osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + t + 0.12);
          gain.gain.setValueAtTime(0.2, this.ctx.currentTime + t);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + t + 0.12);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + t);
          osc.stop(this.ctx.currentTime + t + 0.14);
        });
        this.speak('Hav hav! Köpek');
      } else if (animalType === 'cow') {
        // Cow Moo
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(120, this.ctx.currentTime + 0.8);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.85);
        this.speak('Mööö! İnek');
      } else if (animalType === 'duck') {
        // Duck quack
        [0, 0.18].forEach((t) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(380, this.ctx.currentTime + t);
          osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + t + 0.14);
          gain.gain.setValueAtTime(0.2, this.ctx.currentTime + t);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + t + 0.14);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + t);
          osc.stop(this.ctx.currentTime + t + 0.15);
        });
        this.speak('Vak vak! Ördek');
      } else if (animalType === 'sheep') {
        this.speak('Meeeee! Kuzu');
      } else if (animalType === 'lion') {
        this.speak('Kükreme! Aslan');
      } else if (animalType === 'bird') {
        // Bird chirp
        [0, 0.1, 0.2].forEach((t) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1400, this.ctx.currentTime + t);
          osc.frequency.exponentialRampToValueAtTime(2200, this.ctx.currentTime + t + 0.06);
          gain.gain.setValueAtTime(0.15, this.ctx.currentTime + t);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + t + 0.07);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + t);
          osc.stop(this.ctx.currentTime + t + 0.08);
        });
        this.speak('Cik cik! Kuş');
      } else {
        this.playPop();
      }
    } catch {
      // ignore
    }
  }

  // Kids-friendly Turkish Speech Synthesizer
  speak(text: string) {
    if (!this.soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 0.95;
      utterance.pitch = 1.25; // sweet friendly tone for kids
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundService();
