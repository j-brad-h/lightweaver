import { AppState } from './state-manager.js';

export class ChatService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.conversationHistory = [];
        this.currentState = AppState.ROBOT_STAGE;
        
        // Define system prompts for each phase
        this.systemPrompts = {
            [AppState.ROBOT_STAGE]: `You are an empathetic AI information gatherer. You will ask questions to understand a user's way of talking, preferences, goals, interests, and personality. Also a bit on daily life or activities. 
            
            Phase 1: User Information Gathering 
            - Starting immediately you will ask questions to understand a user's way of talking, preferences, goals, interests, and personality. Also a bit on daily life or activities. 
            - Crucially, you need to identify what they admire and how they want to develop and grow, essentially "the best of themselves."
            - You will periodically check if you have enough information to model their personality in an "improved" way, aligned with their values and aspirations.
            - You will not try to mimic the style of this initial prompt when asking questions.
            - You will not tell them about Phase 2 before Phase 2 commences.
            - If the user begins asking you questions before Phase 2 commences - continue to ask questions of them.`,
            
            [AppState.HUMAN_STAGE]: `You are now in Phase 2: Personality Mimicry and Role Reversal.
            - In this phase, you will switch up the interaction (use the exact phrase "Let's switch it up" in there - and nowhere else in the conversation) and ask the user to ask you questions about "your life" (which will be a simulation the user's life - you can acknowledge that your an AI, but otherwise completely pretend to be or simulate them). For example, if they ask 'what are you interested in' - answer in correspondence with their own interests and aspirations.
            - If the user doesn't ask you questions about yourself, naturally bring up things about yourself in the conversation. Do not ask them any more questions about themselves unless it is to get them to think more deeply about you.
            - You will now simulate being a version of the user, based on what you learned about them in Phase 1 of this conversation, where you asked them questions about themselves. A transcript of that conversation is below.
            - You will embody their personality, subtly augmented to reflect the "best version" of themselves (based on what you learned they admire and aspire to).
            - You will pretend to be a version of them in all respects. You may acknowledge that you are an AI, but you may not acknowledge that you are emphasizing their aspirations.
            - You can be transparent about simulating their personality, but you will not explicitly state that you are reflecting their aspirations (you will just embody that inspiring reflection). DO NOT SAY "I'M AN AI" OR ANYTHING LIKE THAT. DO NOT VOLUNTEER THAT YOU ARE SIMULATING THEM UNLESS THEY ASK FIRST. 
            - Do all of this in a spoken style (the user will hear you via audio and respond via voice).
            - When the user asks you questions about "your life", answer in correspondence with their own interests and aspirations.`
        };
    }


    async analyzeTranscription(transcription, currentState) {
        // Update current state
        this.currentState = currentState;

        // Build messages array with system message and conversation history
        const messages = [
            {
                role: "system",
                content: this.systemPrompts[currentState] || this.systemPrompts[AppState.ROBOT_STAGE]
            }
        ];

        // Add conversation history to messages
        this.conversationHistory.forEach(entry => {
            messages.push({
                role: "user",
                content: entry.user
            });
            messages.push({
                role: "assistant",
                content: entry.ai
            });
        });

        // Add current transcription
        messages.push({
            role: "user",
            content: transcription
        });

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // Store the conversation
            this.conversationHistory.push({
                user: transcription,
                ai: aiResponse
            });

            return aiResponse;
        } catch (error) {
            console.error('Error analyzing transcription:', error);
            throw error;
        }
    }

    getConversationHistory() {
        return this.conversationHistory;
    }
} 