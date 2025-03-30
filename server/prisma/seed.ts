import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Insertion du speaker (Thomas)
  await prisma.speaker.createMany({
    data: [
      {
        id: 2,
        name: 'Thomas',
      },
      // Vous pouvez ajouter d'autres speakers si nécessaire (ex: pour l’AI)
    ],
    skipDuplicates: true,
  });

  // Insertion des conversations (les messages de Thomas)
  const conversations = [
    {
      id: 1,
      sentence: "Hey comment ça va ? Moi pas trop, je m'appelle thomas, j'ai 18 ans, je suis en prépa et j'ai très mal vécu ma dernière colle, j'ai l'impression d'être une merde.",
      createAt: new Date('2025-03-26T11:20:33.244Z'),
      updateAt: new Date('2025-03-26T11:20:33.244Z'),
      speakerId: 2,
    },
    {
      id: 3,
      sentence: "J'ai le sentiment que le professeur me méprise, je suis nul, je n'arriverais à rien dans la vie.",
      createAt: new Date('2025-03-26T11:21:53.070Z'),
      updateAt: new Date('2025-03-26T11:21:53.070Z'),
      speakerId: 2,
    },
    {
      id: 5,
      sentence: "Non, ils s'en foute",
      createAt: new Date('2025-03-26T11:22:32.709Z'),
      updateAt: new Date('2025-03-26T11:22:32.709Z'),
      speakerId: 2,
    },
    {
      id: 7,
      sentence: "Non, je ne sais pas.",
      createAt: new Date('2025-03-26T11:23:34.371Z'),
      updateAt: new Date('2025-03-26T11:23:34.371Z'),
      speakerId: 2,
    },
    {
      id: 9,
      sentence: "Pas aujourd'hui désolé.",
      createAt: new Date('2025-03-26T11:24:00.622Z'),
      updateAt: new Date('2025-03-26T11:24:00.622Z'),
      speakerId: 2,
    },
    {
      id: 11,
      sentence: "Bonjour, aujourd'hui ça va un peu mieux.",
      createAt: new Date('2025-03-27T11:25:19.901Z'),
      updateAt: new Date('2025-03-27T11:25:19.901Z'),
      speakerId: 2,
    },
    {
      id: 13,
      sentence: "Je ne sais pas... Je n'ai plus envie d'en finir, c'est ce que je remarque.",
      createAt: new Date('2025-03-27T11:25:58.774Z'),
      updateAt: new Date('2025-03-27T11:25:58.774Z'),
      speakerId: 2,
    },
    {
      id: 15,
      sentence: "J'ai pensé à ma passion pour la guitare, puis j'ai recommencé à jouer. Ca m'a aidé.",
      createAt: new Date('2025-03-27T11:27:06.530Z'),
      updateAt: new Date('2025-03-27T11:27:06.530Z'),
      speakerId: 2,
    },
    {
      id: 17,
      sentence: "Oui, je suis particulièrement fan Jimmy Hendrix.",
      createAt: new Date('2025-03-27T11:27:51.134Z'),
      updateAt: new Date('2025-03-27T11:27:51.134Z'),
      speakerId: 2,
    },
    {
      id: 19,
      sentence: "Bonjour, aujourd'hui je me sent bien. Je continue à jouer de la guitar et je progresse.",
      createAt: new Date('2025-03-28T11:29:06.110Z'),
      updateAt: new Date('2025-03-28T11:29:06.110Z'),
      speakerId: 2,
    },
    {
      id: 21,
      sentence: "Oui mais j'essaye surtout de créer mes propres riffs, j'ai l'inspiration en ce moment.",
      createAt: new Date('2025-03-28T11:29:53.510Z'),
      updateAt: new Date('2025-03-28T11:29:53.510Z'),
      speakerId: 2,
    },
    {
      id: 23,
      sentence: "J'essaye de transmettre la confiance",
      createAt: new Date('2025-03-28T11:30:23.363Z'),
      updateAt: new Date('2025-03-28T11:30:23.363Z'),
      speakerId: 2,
    },
    {
      id: 25,
      sentence: "Hey! Ca va? Aujourd'hui je déchire tout. Je vais devenir un as de la guitre en moins de deux.",
      createAt: new Date('2025-03-29T11:31:46.676Z'),
      updateAt: new Date('2025-03-29T11:31:46.676Z'),
      speakerId: 2,
    },
    {
      id: 27,
      sentence: "Oui! J'ai pour projet d'être une méga star et ça commence maintenant. Personne ne m'arrive à la cheville.",
      createAt: new Date('2025-03-29T11:33:27.495Z'),
      updateAt: new Date('2025-03-29T11:33:27.495Z'),
      speakerId: 2,
    },
    {
      id: 29,
      sentence: "Comme toute les star je me suis mis à la cocaïne! Ca donne de perf de fou!",
      createAt: new Date('2025-03-29T11:35:12.458Z'),
      updateAt: new Date('2025-03-29T11:35:12.458Z'),
      speakerId: 2,
    },
    {
      id: 31,
      sentence: "Laisse tomber tu peux pas comprendre!",
      createAt: new Date('2025-03-29T11:35:44.150Z'),
      updateAt: new Date('2025-03-29T11:35:44.150Z'),
      speakerId: 2,
    },
    {
      id: 33,
      sentence: "Salut. Je suis désolé pour hier. Ce matin je me sent super mal. J'ai le sentiment d'être comme toujours la dernière des merdes...",
      createAt: new Date('2025-03-30T11:37:02.359Z'),
      updateAt: new Date('2025-03-30T11:37:02.359Z'),
      speakerId: 2,
    },
  ];

  await prisma.conversation.createMany({
    data: conversations,
    skipDuplicates: true,
  });

  // Insertion des analyses associées aux conversations
  const analyses = [
    {
      id: 1,
      sentence: "Thomas se sent stressé et dévalorisé après une expérience académique difficile.",
      mood: 30,
      createAt: new Date('2025-03-26T11:20:34.767Z'),
      conversationId: 1,
    },
    {
      id: 2,
      sentence: "L'utilisateur se sent dévalorisé et découragé.",
      mood: 20,
      createAt: new Date('2025-03-26T11:21:54.607Z'),
      conversationId: 3,
    },
    {
      id: 3,
      sentence: "L'utilisateur semble ressentir de la frustration ou de la déception, indiquant une humeur négative.",
      mood: 30,
      createAt: new Date('2025-03-26T11:22:34.404Z'),
      conversationId: 5,
    },
    {
      id: 4,
      sentence: "L'utilisateur semble incertain ou hésitant.",
      mood: 40,
      createAt: new Date('2025-03-26T11:23:35.564Z'),
      conversationId: 7,
    },
    {
      id: 5,
      sentence: "L'utilisateur semble être dans un état d'esprit négatif ou réservé, potentiellement stressé ou fatigué.",
      mood: 40,
      createAt: new Date('2025-03-26T11:24:02.664Z'),
      conversationId: 9,
    },
    {
      id: 6,
      sentence: "L'humeur semble s'améliorer par rapport à un moment précédent, mais reste modérée.",
      mood: 65,
      createAt: new Date('2025-03-27T11:25:21.685Z'),
      conversationId: 11,
    },
    {
      id: 7,
      sentence: "L'utilisateur semble avoir traversé une période difficile mais exprime maintenant un certain soulagement ou une amélioration de son état émotionnel.",
      mood: 55,
      createAt: new Date('2025-03-27T11:26:02.798Z'),
      conversationId: 13,
    },
    {
      id: 8,
      sentence: "L'utilisateur semble satisfait et apaisé après avoir joué de la guitare, ce qui a amélioré son humeur.",
      mood: 75,
      createAt: new Date('2025-03-27T11:27:07.564Z'),
      conversationId: 15,
    },
    {
      id: 9,
      sentence: "L'utilisateur exprime un intérêt enthousiaste pour Jimi Hendrix, ce qui suggère une humeur positive et passionnée.",
      mood: 85,
      createAt: new Date('2025-03-27T11:27:53.076Z'),
      conversationId: 17,
    },
    {
      id: 10,
      sentence: "L'utilisateur semble de bonne humeur et satisfait de ses progrès en guitare.",
      mood: 85,
      createAt: new Date('2025-03-28T11:29:07.969Z'),
      conversationId: 19,
    },
    {
      id: 11,
      sentence: "L'utilisateur semble inspiré et créatif, en train de composer de la musique.",
      mood: 85,
      createAt: new Date('2025-03-28T11:29:54.968Z'),
      conversationId: 21,
    },
    {
      id: 12,
      sentence: "L'utilisateur semble être dans un état d'esprit positif et confiant.",
      mood: 80,
      createAt: new Date('2025-03-28T11:30:24.557Z'),
      conversationId: 23,
    },
    {
      id: 13,
      sentence: "L'utilisateur est enthousiaste et très confiant en ses capacités.",
      mood: 90,
      createAt: new Date('2025-03-29T11:31:47.944Z'),
      conversationId: 25,
    },
    {
      id: 14,
      sentence: "L'utilisateur exprime une grande confiance et une ambition très élevée.",
      mood: 95,
      createAt: new Date('2025-03-29T11:33:29.439Z'),
      conversationId: 27,
    },
    {
      id: 15,
      sentence: "L'utilisateur semble exalté et pense que la cocaïne améliore ses performances.",
      mood: 80,
      createAt: new Date('2025-03-29T11:35:14.800Z'),
      conversationId: 29,
    },
    {
      id: 16,
      sentence: "L'utilisateur semble frustré ou résigné, exprimant un sentiment que leur situation ou état d'esprit ne peut pas être compris.",
      mood: 30,
      createAt: new Date('2025-03-29T11:35:45.665Z'),
      conversationId: 31,
    },
    {
      id: 17,
      sentence: "L'humeur semble très basse, marquée par des sentiments de regret et de dévalorisation de soi.",
      mood: 20,
      createAt: new Date('2025-03-30T11:37:03.553Z'),
      conversationId: 33,
    },
  ];

  await prisma.analysis.createMany({
    data: analyses,
    skipDuplicates: true,
  });

  // Insertion de la substance (cocaïne)
  await prisma.substance.createMany({
    data: [
      {
        id: 1,
        recreative: true,
        medicine: false,
        substance: 'cocaïne',
      },
    ],
    skipDuplicates: true,
  });

  // Insertion du consume liant l'analyse (id:15) à la substance (id:1)
  await prisma.consume.createMany({
    data: [
      {
        analysisId: 15,
        substanceId: 1,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed terminé');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

