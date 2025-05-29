export class TTSManager {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.voiceId = null;
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.onTTSComplete = null;
    }

    setVoiceId(voiceId) {
        this.voiceId = voiceId;
    }

    setOnTTSComplete(callback) {
        this.onTTSComplete = callback;
    }

    async speak(text, isRobotMode = true) {
        if (isRobotMode) {
            return this.speakWithBrowser(text);
        } else {
            return this.speakWithElevenLabs(text);
        }
    }

    speakWithBrowser(text) {
        return new Promise((resolve, reject) => {
            // Cancel any ongoing speech
            this.synthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            this.currentUtterance = utterance;

            utterance.onend = () => {
                this.currentUtterance = null;
                if (this.onTTSComplete) {
                    this.onTTSComplete();
                }
                resolve();
            };

            utterance.onerror = (error) => {
                this.currentUtterance = null;
                reject(error);
            };

            this.synthesis.speak(utterance);
        });
    }

    async speakWithElevenLabs(text) {
        if (!this.voiceId) {
            throw new Error('No voice ID available for ElevenLabs TTS');
        }

        try {
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': this.apiKey
                },
                body: JSON.stringify({
                    text: text,
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.5
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`ElevenLabs API error: ${response.status}`);
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);

            return new Promise((resolve, reject) => {
                audio.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    if (this.onTTSComplete) {
                        this.onTTSComplete();
                    }
                    resolve();
                };

                audio.onerror = (error) => {
                    URL.revokeObjectURL(audioUrl);
                    reject(error);
                };

                audio.play();
            });
        } catch (error) {
            throw new Error(`ElevenLabs TTS failed: ${error.message}`);
        }
    }

    stop() {
        if (this.currentUtterance) {
            this.synthesis.cancel();
            this.currentUtterance = null;
        }
    }
} 