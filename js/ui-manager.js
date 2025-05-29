export class UIManager {
    constructor() {
        this.recordButton = document.getElementById('recordButton');
        this.stageIndicator = document.getElementById('currentStage');
        // Set initial button text
        this.recordButton.textContent = 'Start Interaction';
    }

    updateRecordingButton(isRecording) {
        if (isRecording === 'start_interaction') {
            this.recordButton.textContent = 'Start Recording';
        } else {
            this.recordButton.textContent = isRecording ? 'Stop Recording' : 'Start Recording';
            this.recordButton.classList.toggle('recording', isRecording);
        }
    }

    updateStageIndicator(state) {
        let stageText = '';
        switch (state) {
            case 'PRE_INTERACTION':
                stageText = 'Ready to Start';
                break;
            case 'ROBOT_STAGE':
                stageText = 'Robot Stage';
                break;
            case 'VOICE_CLONING':
                stageText = 'Voice Cloning in Progress...';
                break;
            case 'HUMAN_STAGE':
                stageText = 'Human Stage';
                break;
            case 'ERROR':
                stageText = 'Error State';
                break;
            default:
                stageText = 'Unknown Stage';
        }
        this.stageIndicator.textContent = stageText;
    }
} 