import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLastProfile = async () => {
  try {
    const lastProfile = await prisma.profile.findFirst({
      orderBy: {
        id: 'desc',
      },
      include: {
        pathologies: {
          include: {
            pathology: true, // Inclut les détails des pathologies
          },
        },
      },
    });
    console.log('Last profile fetched:', lastProfile);
    return lastProfile;
  } catch (error) {
    console.error('Error fetching last profile:', error);
    return null;
  }
};

export const postProfile = async ({
  name,
  lastname,
  birthdate,
  culture,
  follow,
  pathologies = [], // Par défaut, une liste vide
}: {
  name: string;
  lastname: string;
  birthdate: Date;
  culture: string;
  follow?: boolean;
  pathologies?: {
    selfDiagnosis: boolean;
    proDiagnosis: boolean;
    diagnosis: string;
  }[]; // Liste des pathologies
}) => {
  try {
    // Étape 1: Créer les pathologies et récupérer leurs IDs
    const createdPathologies = await Promise.all(
      pathologies.map(async (pathology) => {
        const newPathology = await prisma.pathology.create({
          data: {
            selfDiagnosis: pathology.selfDiagnosis,
            proDiagnosis: pathology.proDiagnosis,
            diagnosis: pathology.diagnosis,
            createAt: new Date(),
          },
        });
        return newPathology.id;
      })
    );

    // Étape 2: Créer le profil
    const newProfile = await prisma.profile.create({
      data: {
        name,
        lastname,
        birthDate: birthdate,
        culture,
        follow: follow ?? false,
        pathologies: {
          create: createdPathologies.map((pathologyId) => ({
            pathologyId,
          })),
        },
      },
      include: {
        pathologies: {
          include: {
            pathology: true, // Inclut les détails des pathologies
          },
        },
      },
    });

    console.log('New profile created:', newProfile);
    return newProfile;
  } catch (error) {
    console.error('Error creating profile:', error);
    return null;
  }
};
