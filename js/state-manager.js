export const AppState = {
    PRE_INTERACTION: 'PRE_INTERACTION',
    ROBOT_STAGE: 'ROBOT_STAGE',
    VOICE_CLONING: 'VOICE_CLONING',
    HUMAN_STAGE: 'HUMAN_STAGE',
    ERROR: 'ERROR'
};

export class StateManager {
    constructor() {
        this.currentState = AppState.PRE_INTERACTION;
        this.recordings = [];
        this.voiceId = null;
        this.onStateChange = null;
        this.robotStageInteractions = 0;
        this.humanStageInteractions = 0;
        this.requiredRobotInteractions = 3; // Can be adjusted
        this.requiredHumanInteractions = 6; // Can be adjusted
    }

    setOnStateChange(callback) {
        this.onStateChange = callback;
    }

    getCurrentState() {
        return this.currentState;
    }

    addRecording(recording) {
        this.recordings.push(recording);
        this.checkStateTransition();
    }

    getRecordings() {
        return this.recordings;
    }

    setVoiceId(voiceId) {
        this.voiceId = voiceId;
    }

    getVoiceId() {
        return this.voiceId;
    }

    incrementInteraction() {
        if (this.currentState === AppState.ROBOT_STAGE) {
            this.robotStageInteractions++;
        } else if (this.currentState === AppState.HUMAN_STAGE) {
            this.humanStageInteractions++;
        }
        this.checkStateTransition();
    }

    async transitionTo(newState) {
        if (this.currentState === newState) return;

        const oldState = this.currentState;
        this.currentState = newState;

        if (this.onStateChange) {
            await this.onStateChange(oldState, newState);
        }
    }

    checkStateTransition() {
        switch (this.currentState) {
            case AppState.PRE_INTERACTION:
                // PRE_INTERACTION state is managed externally
                // It will transition to ROBOT_STAGE when ready
                break;

            case AppState.ROBOT_STAGE:
                if (this.robotStageInteractions >= this.requiredRobotInteractions) {
                    this.transitionTo(AppState.VOICE_CLONING);
                }
                break;

            case AppState.VOICE_CLONING:
                // Voice cloning state is managed externally
                // It will transition to HUMAN_STAGE when cloning is complete
                break;

            case AppState.HUMAN_STAGE:
                if (this.humanStageInteractions >= this.requiredHumanInteractions) {
                    // Application is complete
                    console.log('Application flow complete!');
                }
                break;

            case AppState.ERROR:
                // Handle error state
                break;
        }
    }

    isPreInteraction() {
        return this.currentState === AppState.PRE_INTERACTION;
    }

    isRobotStage() {
        return this.currentState === AppState.ROBOT_STAGE;
    }

    isHumanStage() {
        return this.currentState === AppState.HUMAN_STAGE;
    }

    isVoiceCloning() {
        return this.currentState === AppState.VOICE_CLONING;
    }

    clearRecordings() {
        this.recordings = [];
    }
} 