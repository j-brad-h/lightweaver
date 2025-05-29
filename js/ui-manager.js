export class UIManager {
    constructor() {
        this.recordings = [];
        this.recordButton = document.getElementById('recordButton');
        this.sendButton = document.getElementById('sendButton');
        this.recordingsList = document.getElementById('recordingsList');
        this.transcriptionButton = document.getElementById('transcribeButton');
        this.transcriptionDisplay = document.getElementById('transcriptionDisplay');
    }

    updateRecordingButton(isRecording) {
        this.recordButton.textContent = isRecording ? 'Stop Recording' : 'Start Recording';
        this.recordButton.classList.toggle('recording', isRecording);
    }

    updateRecordingsList() {
        this.recordingsList.innerHTML = '';
        this.recordings.forEach((recording, index) => {
            const li = document.createElement('li');
            li.className = 'recording-item';

            const audio = document.createElement('audio');
            audio.controls = true;
            audio.src = URL.createObjectURL(recording.blob);

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => this.deleteRecording(index);

            const transcribeButton = document.createElement('button');
            transcribeButton.textContent = 'Transcribe';
            transcribeButton.onclick = () => this.handleTranscribeClick(index);

            buttonContainer.appendChild(transcribeButton);
            buttonContainer.appendChild(deleteButton);

            li.appendChild(audio);
            li.appendChild(buttonContainer);
            this.recordingsList.appendChild(li);
        });

        this.sendButton.disabled = this.recordings.length === 0;
    }

    addRecording(recording) {
        this.recordings.push(recording);
        this.updateRecordingsList();
    }

    deleteRecording(index) {
        this.recordings.splice(index, 1);
        this.updateRecordingsList();
    }

    clearRecordings() {
        this.recordings = [];
        this.updateRecordingsList();
    }

    getRecordings() {
        return this.recordings;
    }

    setSendButtonEnabled(enabled) {
        this.sendButton.disabled = !enabled;
    }

    handleTranscribeClick(index) {
        // Dispatch a custom event that the App class will listen for
        const event = new CustomEvent('transcribeRecording', { detail: { index } });
        document.dispatchEvent(event);
    }

    displayTranscription(text) {
        if (!this.transcriptionDisplay) {
            // Create transcription display if it doesn't exist
            this.transcriptionDisplay = document.createElement('div');
            this.transcriptionDisplay.id = 'transcriptionDisplay';
            this.transcriptionDisplay.className = 'transcription-display';
            document.body.appendChild(this.transcriptionDisplay);
        }
        
        this.transcriptionDisplay.innerHTML = `
            <div class="transcription-content">
                <h3>Transcription</h3>
                <p>${text}</p>
            </div>
        `;
    }
} 