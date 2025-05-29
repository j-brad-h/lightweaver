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
            const response = await this.api.sendRecordings(recordings);
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
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App('sk_b922eedce1e20325c6a4d42b8354769a0b4f8700d68450f5');
}); 