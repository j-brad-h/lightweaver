export class ElevenLabsAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async sendRecordings(recordings, voiceName = 'voice_name') {
        if (recordings.length === 0) {
            throw new Error('No recordings to send');
        }

        const formData = new FormData();
        formData.append('name', voiceName);

        for (const recording of recordings) {
            formData.append('files[]', recording.blob, recording.name);
        }

        try {
            const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
                method: 'POST',
                body: formData,
                headers: {
                    'xi-api-key': this.apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error sending recordings:', error);
            throw error;
        }
    }
} 