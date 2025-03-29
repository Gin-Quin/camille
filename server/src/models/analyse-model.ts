import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAnalysis = async () => {
    try {
      const analysis = await prisma.analysis.findMany();
      console.log('All fetched:', analysis);



      
      return analysis;
    } catch (error) {
      console.error('Error fetching last profile:', error);
      return null;
    }
  };