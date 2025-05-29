import { AudioRecorder } from './recorder.js';
import { UIManager } from './ui-manager.js';
import { ElevenLabsAPI } from './api-service.js';

class App {
    constructor(apiKey) {
        this.recorder = new AudioRecorder();
        this.ui = new UIManager();
        this.api = new ElevenLabsAPI(apiKey);
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.ui.recordButton.addEventListener('click', () => this.handleRecordButtonClick());
        this.ui.sendButton.addEventListener('click', () => this.handleSendButtonClick());
        document.addEventListener('transcribeRecording', (event) => this.handleTranscribeRecording(event));
    }

    async handleRecordButtonClick() {
        if (this.recorder.isCurrentlyRecording()) {
            const recording = await this.recorder.stopRecording();
            if (recording) {
                this.ui.addRecording(recording);
            }
            this.ui.updateRecordingButton(false);
        } else {
            try {
                await this.recorder.startRecording();
                this.ui.updateRecordingButton(true);
            } catch (error) {
                alert(error.message);
            }
        }
    }

    async handleSendButtonClick() {
        try {
            const recordings = this.ui.getRecordings();
            const response = await this.api.createVoiceClone(recordings);
            const voiceId = this.api.getVoiceId();

            if (voiceId) {
                alert(`Recordings sent successfully! Voice ID: ${voiceId}`);
                // You can store this voice ID in localStorage if you want to persist it
                localStorage.setItem('lastVoiceId', voiceId);
            } else {
                alert('Recordings sent, but no voice ID was returned.');
            }

            this.ui.clearRecordings();
        } catch (error) {
            alert('Error sending recordings: ' + error.message);
        }
    }

    async handleTranscribeRecording(event) {
        const { index } = event.detail;
        const recordings = this.ui.getRecordings();
        const recording = recordings[index];

        if (!recording) {
            alert('Recording not found');
            return;
        }

        try {
            const response = await this.api.transcribeAudio(recording);
            if (response && response.text) {
                this.ui.displayTranscription(response.text);
            } else {
                throw new Error('No transcription text in response');
            }
        } catch (error) {
            alert('Error transcribing audio: ' + error.message);
        }
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App('sk_b922eedce1e20325c6a4d42b8354769a0b4f8700d68450f5');
}); 