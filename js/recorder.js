export class AudioRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            this.audioChunks = [];
            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            return true;
        } catch (err) {
            console.error('Error accessing microphone:', err);
            throw new Error('Error accessing microphone. Please ensure you have granted permission.');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            return new Promise((resolve) => {
                this.mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm;codecs=opus' });
                    const timestamp = new Date().getTime();
                    const recording = {
                        blob: audioBlob,
                        timestamp: timestamp,
                        name: `recording-${timestamp}.webm`
                    };

                    this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
                    this.isRecording = false;
                    resolve(recording);
                };

                this.mediaRecorder.stop();
            });
        }
        return Promise.resolve(null);
    }

    isCurrentlyRecording() {
        return this.isRecording;
    }
} 