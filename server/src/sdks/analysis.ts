import { env } from "bun";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export async function analyse(question: string, answer: string) {
    const response = await openai.responses.create({
        model: "gpt-4o-2024-08-06",
        input: [
            { role: "system", content: "Tu es un assistant spécialisé dans l'analyse de l'humeur. Analyse la réponse de l'utilisateur et retourne un JSON avec deux clés :\n- 'analyse': une phrase qui décrit l'humeur.\n- 'mood': un nombre entre 1 et 100 représentant l'humeur.\n- 'substences': un tableau d'object avec les clés { substance: 'nom de la drogue absorbée', recreative: 'vrai si la substance est a usage récréatif', medicine: 'vrai si la substance est a usage médicale ou qu'on lui a préscrit'}" },
            { role: "user", content: answer }
        ],
        temperature: 0.7,
        text: {
            format: {
              type: "json_schema",
              name: "ai_analyse",
              schema: {
                type: "object",
                properties: {
                  analyse: { 
                    type: "string" 
                  },
                  mood: { 
                    type: "number" 
                  },
                  substences: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                          recreative: { type: "boolean" },
                          medicine: { type: "boolean" },
                          substance: { type: "string" }
                      },
                      additionalProperties: false,
                      required: ["recreative", "medicine", "substance"]
                    }
                  }
                },
                required: ["analyse", "mood", "substences"],
                additionalProperties: false,
              },
            }
          }
    });

    try {
        const result = JSON.parse(response.output_text);
        console.log("Analyse de l'humeur :", result);
        return {
            sentence: result.analyse || "Analyse non disponible",
            mood: result.mood !== undefined ? Math.max(1, Math.min(100, result.mood)) : 50,
            substences: result.substences || [], // Ajout de la clé 'substences' dans le retour
        };
    } catch (error) {
        console.error("Erreur de parsing JSON :", error);
        return { sentence: "Erreur d'analyse", mood: 50, substences: [] };
    }
}
