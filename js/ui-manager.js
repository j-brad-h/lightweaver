export class UIManager {
    constructor() {
        this.recordButton = document.getElementById('recordButton');
        this.stageIndicator = document.getElementById('currentStage');
        this.conversationDisplay = document.getElementById('conversationDisplay');
        
        // Create conversation display if it doesn't exist
        if (!this.conversationDisplay) {
            this.conversationDisplay = document.createElement('div');
            this.conversationDisplay.id = 'conversationDisplay';
            this.conversationDisplay.className = 'conversation-display';
            document.body.appendChild(this.conversationDisplay);
        }
        
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

    displayTranscription(text) {
        const transcriptionElement = document.createElement('div');
        transcriptionElement.className = 'transcription-content';
        transcriptionElement.innerHTML = `
            <h3>Your Message</h3>
            <p>${text}</p>
        `;
        this.conversationDisplay.appendChild(transcriptionElement);
        this.conversationDisplay.scrollTop = this.conversationDisplay.scrollHeight;
    }

    displayAIResponse(response) {
        const responseElement = document.createElement('div');
        responseElement.className = 'ai-response';
        responseElement.innerHTML = `
            <div class="response-content">
                <h3>AI Follow-up Question</h3>
                <p>${response}</p>
            </div>
        `;
        this.conversationDisplay.appendChild(responseElement);
        this.conversationDisplay.scrollTop = this.conversationDisplay.scrollHeight;
    }

    clearConversation() {
        if (this.conversationDisplay) {
            this.conversationDisplay.innerHTML = '';
        }
    }
} 