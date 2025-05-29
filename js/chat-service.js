export class ChatService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.conversationHistory = [];
    }

    async analyzeTranscription(transcription) {
        const messages = [
            {
                role: "system",
                content: `You are an empathetic AI therapist with expertise in psychoanalysis. Your goal is to help users explore their thoughts and feelings through thoughtful follow-up questions. 
                
                Guidelines:
                - Listen carefully to the emotional undertones in their speech
                - Ask open-ended questions that encourage deeper reflection
                - Be gentle and supportive, never judgmental
                - Focus on understanding their perspective
                - Use therapeutic techniques like reflection and clarification
                - Keep responses concise but meaningful
                - Avoid giving direct advice unless specifically asked
                
                Your response should be a single, thoughtful follow-up question that helps the user explore their thoughts further.`
            },
            {
                role: "user",
                content: transcription
            }
        ];

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