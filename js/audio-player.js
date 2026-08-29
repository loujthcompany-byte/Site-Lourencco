/**
 * LOURENCCO - ACOUSTIC SOUND ENGINE & CANVAS VISUALIZER
 * Web Audio API Acoustic Synthesizer with Real Harmonic Synthesis
 * and Reactive Gold Amber Soundwave Canvas Visualizer
 */

class AcousticSoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.currentTrackIndex = 0;
    this.currentPlaybackTime = 0;
    this.trackDuration = 195; // 3:15
    this.timer = null;
    this.canvas = document.getElementById('soundWaveCanvas');
    this.canvasCtx = this.canvas ? this.canvas.getContext('2d') : null;
    this.animId = null;
    this.analyser = null;
    this.synthInterval = null;

    // Official Lourencco Discography Tracks Catalog with Original Covers
    this.tracks = [
      {
        id: 'quando-o-sol-beijar-o-mar',
        title: 'Quando o sol beijar o mar',
        album: 'Plano Arquitetado (2025)',
        cover: 'assets/images/plano_arquitetado_original.jpg',
        duration: '03:24',
        durationSec: 204,
        key: 'G',
        chords: ['G', 'D/F#', 'Em7', 'C9'],
        tempo: 84,
        lyrics: `Quando o sol beijar o mar no fim de tarde\nE a saudade me apertar o peito inteiro\nVou lembrar do teu sorriso de verdade\nDo amor que era puro e verdadeiro...\n\nPlano arquitetado pra te ter de volta\nAbro a porteira e deixo a porta aberta\nSeu lugar é aqui, o coração liberta.`
      },
      {
        id: 'tempo-e-eu',
        title: 'Tempo e eu',
        album: 'Plano Arquitetado (2025)',
        cover: 'assets/images/plano_arquitetado_original.jpg',
        duration: '02:58',
        durationSec: 178,
        key: 'D',
        chords: ['D', 'A', 'Bm7', 'G'],
        tempo: 78,
        lyrics: `O tempo corre e eu fico aqui pensando\nEm cada verso que escrevi pra te dizer\nQue a vida ensina o coração sangrando\nMas sem você não sei o que fazer...\n\nTempo e eu, numa estrada de poeira\nEsperando seu abraço a vida inteira.`
      },
      {
        id: 'facil-assim',
        title: 'Fácil assim',
        album: 'Plano Arquitetado (2025)',
        cover: 'assets/images/plano_arquitetado_original.jpg',
        duration: '03:10',
        durationSec: 190,
        key: 'A',
        chords: ['A', 'E', 'F#m', 'D'],
        tempo: 92,
        lyrics: `Você chegou dizendo que era fácil assim\nTrocar de história e esquecer de mim\nMas quando a noite cai e o violão tocar\nÉ no meu peito que você vai querer morar.`
      },
      {
        id: 'paixao-mal-resolvida',
        title: 'Paixão mal resolvida',
        album: 'Som do Passado (2025)',
        cover: 'assets/images/som_do_passado_original.jpg',
        duration: '03:35',
        durationSec: 215,
        key: 'E',
        chords: ['E', 'B', 'C#m', 'A'],
        tempo: 80,
        lyrics: `Paixão mal resolvida é feito brasa acesa\nQualquer sopro de vento vira labareda\nLembrança desse amor não sai da minha mesa\nCopo de cerveja e a viola na defesa.`
      },
      {
        id: 'se-eu-te-procurar',
        title: 'Se eu te procurar',
        album: 'Som do Passado (2025)',
        cover: 'assets/images/som_do_passado_original.jpg',
        duration: '03:05',
        durationSec: 185,
        key: 'C',
        chords: ['C', 'G', 'Am', 'F'],
        tempo: 82,
        lyrics: `Se eu te procurar de novo de madrugada\nNão me atenda, finge que não viu nada\nPorque se eu ouvir tua voz dizendo alô\nRecaída certa pro meu cobertor.`
      },
      {
        id: 'marketing-perfeito',
        title: 'Marketing perfeito',
        album: 'Plano Arquitetado (2025)',
        cover: 'assets/images/plano_arquitetado_original.jpg',
        duration: '02:45',
        durationSec: 165,
        key: 'G',
        chords: ['G', 'Em7', 'C', 'D'],
        tempo: 96,
        lyrics: `Você posta sorriso, faz cena de bem\nMas eu sei que no fundo não ama ninguém\nMarketing perfeito pra disfarçar a dor\nDe quem perdeu um grande amor.`
      }
    ];

    this.init();
  }

  init() {
    this.updateTrackUI();
    this.setupVisualizerCanvas();
    this.bindEvents();
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playNote(frequency, time, duration, gainValue = 0.25) {
    if (!this.audioCtx) return;
    
    // Acoustic Pluck Simulator using Karplus-Strong / Multi-oscillator harmonics
    const osc = this.audioCtx.createOscillator();
    const oscHarmonic = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    // Warm Acoustic Lowpass
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, time);
    filter.frequency.exponentialRampToValueAtTime(300, time + duration);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, time);

    oscHarmonic.type = 'sine';
    oscHarmonic.frequency.setValueAtTime(frequency * 2, time);

    // Envelope Pluck & Decay
    gainNode.gain.setValueAtTime(0.001, time);
    gainNode.gain.linearRampToValueAtTime(gainValue, time + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    oscHarmonic.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);

    osc.start(time);
    oscHarmonic.start(time);
    osc.stop(time + duration);
    oscHarmonic.stop(time + duration);
  }

  playAcousticArpeggio() {
    if (!this.audioCtx || !this.isPlaying) return;

    const track = this.tracks[this.currentTrackIndex];
    // Notes frequencies map for acoustic chords
    const chordNotesMap = {
      'G': [196, 246.94, 293.66, 392],
      'D/F#': [185, 220, 293.66, 369.99],
      'Em7': [164.81, 246.94, 329.63, 392],
      'C9': [130.81, 261.63, 329.63, 392],
      'D': [146.83, 220, 293.66, 369.99],
      'A': [110, 220, 277.18, 329.63],
      'Bm7': [123.47, 246.94, 293.66, 369.99],
      'E': [82.41, 164.81, 246.94, 329.63],
      'B': [123.47, 246.94, 369.99, 493.88],
      'C#m': [138.59, 277.18, 329.63, 415.30],
      'C': [130.81, 261.63, 329.63, 523.25],
      'Am': [110, 220, 261.63, 329.63],
      'F': [87.31, 174.61, 261.63, 349.23],
      'F#m': [92.50, 185.00, 277.18, 369.99]
    };

    const chords = track.chords;
    let chordIdx = 0;

    this.synthInterval = setInterval(() => {
      if (!this.isPlaying || !this.audioCtx) {
        clearInterval(this.synthInterval);
        return;
      }

      const chordName = chords[chordIdx % chords.length];
      const notes = chordNotesMap[chordName] || [196, 246.94, 293.66, 392];
      const now = this.audioCtx.currentTime;

      // Play rich fingerpicked acoustic pattern
      notes.forEach((freq, idx) => {
        this.playNote(freq, now + idx * 0.16, 1.4, 0.22);
      });

      // Bass note pulse
      this.playNote(notes[0] / 2, now, 1.6, 0.28);

      chordIdx++;
    }, (60 / track.tempo) * 2000);
  }

  togglePlay() {
    this.initAudioContext();

    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.initAudioContext();
    this.isPlaying = true;
    this.updatePlayButtons(true);
    this.startProgressTimer();
    this.playAcousticArpeggio();
    this.startVisualizer();
  }

  pause() {
    this.isPlaying = false;
    this.updatePlayButtons(false);
    clearInterval(this.synthInterval);
    clearInterval(this.timer);
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.currentPlaybackTime = 0;
    this.updateTrackUI();
    if (this.isPlaying) {
      clearInterval(this.synthInterval);
      this.playAcousticArpeggio();
    }
  }

  prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.currentPlaybackTime = 0;
    this.updateTrackUI();
    if (this.isPlaying) {
      clearInterval(this.synthInterval);
      this.playAcousticArpeggio();
    }
  }

  selectTrack(index) {
    if (index >= 0 && index < this.tracks.length) {
      this.currentTrackIndex = index;
      this.currentPlaybackTime = 0;
      this.updateTrackUI();
      this.play();
    }
  }

  selectTrackById(trackId) {
    const idx = this.tracks.findIndex(t => t.id === trackId || t.title.toLowerCase().includes(trackId.toLowerCase()));
    if (idx !== -1) {
      this.selectTrack(idx);
    }
  }

  startProgressTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (!this.isPlaying) return;
      
      const track = this.tracks[this.currentTrackIndex];
      this.currentPlaybackTime += 1;
      
      if (this.currentPlaybackTime >= track.durationSec) {
        this.nextTrack();
      } else {
        this.updateProgressBar(track);
      }
    }, 1000);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  updateProgressBar(track) {
    const percent = (this.currentPlaybackTime / track.durationSec) * 100;
    
    // Main Card Progress
    const cardProgressFill = document.getElementById('cardProgressFill');
    const cardCurrentTime = document.getElementById('cardCurrentTime');
    const cardTotalDuration = document.getElementById('cardTotalDuration');

    if (cardProgressFill) cardProgressFill.style.width = `${percent}%`;
    if (cardCurrentTime) cardCurrentTime.textContent = this.formatTime(this.currentPlaybackTime);
    if (cardTotalDuration) cardTotalDuration.textContent = track.duration;

    // Bottom Bar Progress
    const bottomProgressFill = document.getElementById('bottomProgressFill');
    const bottomCurrentTime = document.getElementById('bottomCurrentTime');
    const bottomTotalDuration = document.getElementById('bottomTotalDuration');

    if (bottomProgressFill) bottomProgressFill.style.width = `${percent}%`;
    if (bottomCurrentTime) bottomCurrentTime.textContent = this.formatTime(this.currentPlaybackTime);
    if (bottomTotalDuration) bottomTotalDuration.textContent = track.duration;
  }

  updateTrackUI() {
    const track = this.tracks[this.currentTrackIndex];

    // Update Main Player Card
    const mainTitle = document.getElementById('mainPlayerTrackTitle');
    const mainAlbum = document.getElementById('mainPlayerAlbumTitle');
    const playerThumb = document.getElementById('playerThumb');
    if (mainTitle) mainTitle.textContent = track.title;
    if (mainAlbum) mainAlbum.textContent = track.album;
    if (playerThumb && track.cover) playerThumb.src = track.cover;

    // Update Bottom Player Bar
    const bottomTitle = document.getElementById('bottomPlayerTrackTitle');
    const bottomAlbum = document.getElementById('bottomPlayerAlbumTitle');
    const bottomThumb = document.querySelector('.bottom-track-thumb');
    if (bottomTitle) bottomTitle.textContent = track.title;
    if (bottomAlbum) bottomAlbum.textContent = `Lourencco • ${track.album}`;
    if (bottomThumb && track.cover) bottomThumb.src = track.cover;

    // Update Quick Playlist Highlight
    document.querySelectorAll('.playlist-track-item').forEach((item, idx) => {
      if (idx === this.currentTrackIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    this.updateProgressBar(track);
  }

  updatePlayButtons(isPlaying) {
    const playIconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    const pauseIconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

    const masterBtn = document.getElementById('masterPlayBtn');
    const bottomBtn = document.getElementById('bottomPlayBtn');

    if (masterBtn) masterBtn.innerHTML = isPlaying ? pauseIconSvg : playIconSvg;
    if (bottomBtn) bottomBtn.innerHTML = isPlaying ? pauseIconSvg : playIconSvg;
  }

  setupVisualizerCanvas() {
    if (!this.canvas) return;
    const resize = () => {
      this.canvas.width = this.canvas.parentElement.clientWidth;
      this.canvas.height = this.canvas.parentElement.clientHeight || 64;
    };
    resize();
    window.addEventListener('resize', resize);
    this.drawIdleVisualizer();
  }

  drawIdleVisualizer() {
    if (!this.canvasCtx || !this.canvas) return;
    const ctx = this.canvasCtx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Warm Amber Stage Base Line
    ctx.strokeStyle = 'rgba(229, 169, 59, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    for (let x = 0; x < width; x += 10) {
      const y = height / 2 + Math.sin(x * 0.05) * 3;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  startVisualizer() {
    if (this.animId) cancelAnimationFrame(this.animId);

    const render = () => {
      if (!this.canvasCtx || !this.canvas) return;
      const ctx = this.canvasCtx;
      const width = this.canvas.width;
      const height = this.canvas.height;

      ctx.clearRect(0, 0, width, height);

      let bufferLength = 32;
      let dataArray = new Uint8Array(bufferLength);

      if (this.analyser && this.isPlaying) {
        this.analyser.getByteFrequencyData(dataArray);
      } else {
        // Subtle ambient oscillation
        const time = Date.now() * 0.003;
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.sin(time + i * 0.3) * 30 + 35;
        }
      }

      const barWidth = (width / bufferLength) * 0.7;
      const gap = (width / bufferLength) * 0.3;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = ((dataArray[i] / 255) * height * 0.85) + 4;
        const y = (height - barHeight) / 2;

        // Rich Amber-Gold Gradient
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#fcd34d');
        grad.addColorStop(0.5, '#e5a93b');
        grad.addColorStop(1, '#b45309');

        ctx.fillStyle = grad;
        ctx.shadowColor = '#e5a93b';
        ctx.shadowBlur = this.isPlaying ? 8 : 2;

        // Rounded capsule bars
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();

        x += barWidth + gap;
      }

      ctx.shadowBlur = 0;
      this.animId = requestAnimationFrame(render);
    };

    render();
  }

  bindEvents() {
    const masterBtn = document.getElementById('masterPlayBtn');
    const bottomBtn = document.getElementById('bottomPlayBtn');
    const prevBtn = document.getElementById('prevTrackBtn');
    const nextBtn = document.getElementById('nextTrackBtn');
    const bottomPrevBtn = document.getElementById('bottomPrevBtn');
    const bottomNextBtn = document.getElementById('bottomNextBtn');

    if (masterBtn) masterBtn.addEventListener('click', () => this.togglePlay());
    if (bottomBtn) bottomBtn.addEventListener('click', () => this.togglePlay());
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevTrack());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextTrack());
    if (bottomPrevBtn) bottomPrevBtn.addEventListener('click', () => this.prevTrack());
    if (bottomNextBtn) bottomNextBtn.addEventListener('click', () => this.nextTrack());

    // Progress bar seeking
    const cardProgressTrack = document.getElementById('cardProgressTrack');
    if (cardProgressTrack) {
      cardProgressTrack.addEventListener('click', (e) => {
        const rect = cardProgressTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const ratio = Math.max(0, Math.min(1, clickX / width));
        const track = this.tracks[this.currentTrackIndex];
        this.currentPlaybackTime = Math.floor(ratio * track.durationSec);
        this.updateProgressBar(track);
      });
    }

    const bottomProgressTrack = document.getElementById('bottomProgressTrack');
    if (bottomProgressTrack) {
      bottomProgressTrack.addEventListener('click', (e) => {
        const rect = bottomProgressTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const ratio = Math.max(0, Math.min(1, clickX / width));
        const track = this.tracks[this.currentTrackIndex];
        this.currentPlaybackTime = Math.floor(ratio * track.durationSec);
        this.updateProgressBar(track);
      });
    }
  }
}

// Instantiate Sound Engine
let audioApp = null;
document.addEventListener('DOMContentLoaded', () => {
  audioApp = new AcousticSoundEngine();
  window.audioApp = audioApp;
});
