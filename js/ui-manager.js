export class UIManager {
    constructor() {
        this.recordButton = document.getElementById('recordButton');
        this.recordButton.textContent = 'start weaving';
    }

    updateRecordingButton(isRecording) {
        if (isRecording === 'start_interaction') {
            this.recordButton.textContent = 'start weaving';
        } else {
            this.recordButton.textContent = isRecording ? 'stop recording' : 'start recording';
            this.recordButton.classList.toggle('recording', isRecording);
        }
    }
} 