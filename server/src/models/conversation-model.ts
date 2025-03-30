import { PrismaClient } from '@prisma/client';
import { analyse } from '../sdks/analysis';
import { postAnalysis } from './analyse-model';
import { converse } from '../sdks/conversation';

const prisma = new PrismaClient();

export const getAllConversations = async () => {
  try {
    const conversations = await prisma.conversation.findMany({
      take: 20, // Limite le nombre de résultats à 20
      orderBy: {
        id: 'desc', // Trie par ordre décroissant de la date de création
      },
    });

    console.log('Conversations fetched:', conversations);
    return conversations.sort((a, b) => a.id - b.id).map((conversation) => (
      conversation.speakerId === 1 ? "AI: "  + conversation.sentence : "User: " + conversation.sentence
    )).join('\n'); // Formate les conversations pour l'affichage
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return null;
  }
};

export const postConversation = async ({
  sentence,
  speakerId,
}: {
  sentence: string;
  speakerId: number;
}) => {
  try {

    //Interception of the conversation data to be stored in the database
    const newConversation = await prisma.conversation.create({
      data: {
        sentence,
        speakerId,
        createAt: new Date(),
        updateAt: new Date(),
      },
    });

    const lastAIResponse = await getLastAiResponse(); // Fetch the last AI response

    const anal = await analyse(lastAIResponse, newConversation.sentence); // Call the analysis function with the sentence

    // Store the analysis in the database
    postAnalysis({ sentence: anal.sentence, mood: anal.mood, conversationId: newConversation.id, consumes: anal.substences }); 

    //Use newConversation.sentence to send the data to the IA
    const ai_response = await converse(sentence, anal); // Replace with actual response from AI

    //Store the AI response in the database
    await prisma.conversation.create({
      data: {
        sentence: ai_response,
        speakerId: 1, // Assuming speakerId 1 is for AI
        createAt: new Date(),
        updateAt: new Date(),
      },
    });

    return ai_response;
  } catch (error) {
    console.error('Error creating conversation:', error);
    return null;
  }
};

const getLastAiResponse = async () => {
  try {
    const lastAiResponse = await prisma.conversation.findFirst({
      where: {
        speakerId: 1,
      },
      orderBy: {
        createAt: 'desc',
      },
    });

    return lastAiResponse?.sentence ?? ""; // Return the last AI response or null if not found
  } catch (error) {
    console.error('Error fetching last AI response:', error);
    return "";
  }
}