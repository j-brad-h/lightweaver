import { AudioRecorder } from './recorder.js';
import { UIManager } from './ui-manager.js';
import { ElevenLabsAPI } from './api-service.js';
import { TTSManager } from './tts-manager.js';
import { StateManager, AppState } from './state-manager.js';

class App {
    constructor(apiKey) {
        this.recorder = new AudioRecorder();
        this.ui = new UIManager();
        this.api = new ElevenLabsAPI(apiKey);
        this.tts = new TTSManager(apiKey);
        this.stateManager = new StateManager();

        this.initializeStateManager();
        this.initializeEventListeners();
    }

    initializeStateManager() {
        this.stateManager.setOnStateChange(async (oldState, newState) => {
            // Update UI to reflect new state
            this.ui.updateStageIndicator(newState);

            switch (newState) {
                case AppState.ROBOT_STAGE:
                    await this.startRobotStage();
                    break;
                case AppState.VOICE_CLONING:
                    await this.handleVoiceCloning();
                    break;
                case AppState.HUMAN_STAGE:
                    await this.startHumanStage();
                    break;
            }
        });
    }

    initializeEventListeners() {
        this.ui.recordButton.addEventListener('click', () => this.handleButtonClick());
    }

    async startRobotStage() {
        await this.tts.speakWithBrowser("Welcome to the voice cloning assistant. I'll be guiding you through the process. Please respond to my prompts.");
    }

    async startHumanStage() {
        if (!this.stateManager.getVoiceId()) {
            throw new Error('No voice ID available for human stage');
        }
        this.tts.voiceId = this.stateManager.getVoiceId();
        await this.tts.speakWithElevenLabs("Thank you for your recordings. I've cloned your voice and will now use it for our conversation.");
    }

    async handleVoiceCloning() {
        try {
            const recordings = this.stateManager.getRecordings();
            const response = await this.api.createVoiceClone(recordings);

            if (response.voice_id) {
                this.stateManager.setVoiceId(response.voice_id);
                await this.stateManager.transitionTo(AppState.HUMAN_STAGE);
            } else {
                throw new Error('No voice ID returned from cloning');
            }
        } catch (error) {
            console.error('Voice cloning failed:', error);
            await this.stateManager.transitionTo(AppState.ERROR);
            alert('Voice cloning failed. Please try again.');
        }
    }

    async handleButtonClick() {
        if (this.stateManager.isPreInteraction()) {
            // First interaction - start the robot stage
            this.ui.updateRecordingButton('start_interaction');
            await this.stateManager.transitionTo(AppState.ROBOT_STAGE);
            return;
        }

        // Handle recording for other stages
        if (this.recorder.isCurrentlyRecording()) {
            const recording = await this.recorder.stopRecording();
            if (recording) {
                this.stateManager.addRecording(recording);
                this.stateManager.incrementInteraction();

                // Get transcription and respond
                try {
                    const transcription = await this.api.transcribeAudio(recording);
                    if (transcription && transcription.text) {
                        if (this.stateManager.isRobotStage()) {
                            await this.tts.speakWithBrowser("I heard: " + transcription.text);
                        } else if (this.stateManager.isHumanStage()) {
                            await this.tts.speakWithElevenLabs("I heard: " + transcription.text);
                        }
                    }
                } catch (error) {
                    console.error('Transcription failed:', error);
                }
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
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App('sk_b922eedce1e20325c6a4d42b8354769a0b4f8700d68450f5'); // Replace with actual API key
}); 