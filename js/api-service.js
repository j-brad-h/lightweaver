export class ElevenLabsAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.voiceId = null;  // Store the voice ID
    }

    getVoiceId() {
        return this.voiceId;
    }

    async createVoiceClone(recordings, voiceName = 'voice_name') {
        if (recordings.length === 0) {
            throw new Error('No recordings to send');
        }

        const formData = new FormData();
        formData.append('name', voiceName);

        // Log each recording's details
        console.log('Preparing to send recordings:', recordings.map(r => ({
            name: r.name,
            size: r.blob.size,
            type: r.blob.type
        })));

        for (const recording of recordings) {
            // Create a File object with explicit type
            const file = new File([recording.blob], recording.name);

            // Append with explicit type in the filename, matching curl format
            formData.append('files', file);

            console.log('Added file to FormData:', {
                name: recording.name,
                size: file.size,
                type: file.type,
                formDataName: `${recording.name};type=audio/webm;codecs=opus`
            });
        }

        // Log the FormData contents
        console.log('FormData contents:');
        for (let pair of formData.entries()) {
            console.log('FormData entry:', pair[0], pair[1]);
        }

        try {
            console.log('Sending request to ElevenLabs API...');
            const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
                method: 'POST',
                body: formData,
                headers: {
                    'xi-api-key': this.apiKey
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                });
                throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
            }

            const responseData = await response.json();
            console.log('API Response:', responseData);

            // Extract and store the voice ID
            if (responseData.voice_id) {
                this.voiceId = responseData.voice_id;
                console.log('Stored voice ID:', this.voiceId);
            } else {
                console.warn('No voice ID found in response:', responseData);
            }

            return responseData;
        } catch (error) {
            console.error('Error sending recordings:', error);
            throw error;
        }
    }

    async transcribeAudio(audioRecording, modelId = 'scribe_v1') {
        if (!audioRecording || !audioRecording.blob) {
            throw new Error('No audio recording provided for transcription');
        }

        const formData = new FormData();
        formData.append('model_id', modelId);
        
        // Create a File object from the audio blob
        const file = new File([audioRecording.blob], audioRecording.name);
        formData.append('file', file);

        try {
            console.log('Sending transcription request to ElevenLabs API...');
            const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
                method: 'POST',
                body: formData,
                headers: {
                    'xi-api-key': this.apiKey
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Transcription API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                });
                throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
            }

            const responseData = await response.json();
            console.log('Transcription API Response:', responseData);
            return responseData;
        } catch (error) {
            console.error('Error transcribing audio:', error);
            throw error;
        }
    }
} 