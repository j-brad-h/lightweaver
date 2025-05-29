export class UIManager {
    constructor() {
        this.recordings = [];
        this.recordButton = document.getElementById('recordButton');
        this.sendButton = document.getElementById('sendButton');
        this.recordingsList = document.getElementById('recordingsList');
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

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => this.deleteRecording(index);

            li.appendChild(audio);
            li.appendChild(deleteButton);
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
} 