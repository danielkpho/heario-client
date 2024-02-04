let audioContextInstance = null;

export function getAudioContextInstance() {
 if (!audioContextInstance) {
    audioContextInstance = new AudioContext();
 }
 return audioContextInstance;
}
