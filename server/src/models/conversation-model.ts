import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllConversations = async () => {
  try {
    const conversations = await prisma.conversation.findMany();


    console.log('Conversations fetched:', conversations);
    return conversations;
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

    //TODO: Use newConversation.sentence to send the data to the IA

    const ai_response = "la réponse de l'IA"; // Replace with actual response from AI

    //TODO: Store the AI response in the database

    return ai_response;
  } catch (error) {
    console.error('Error creating conversation:', error);
    return null;
  }
};
