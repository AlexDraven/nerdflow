"use server";

import { GoogleGenAI, createPartFromBase64 } from "@google/genai";

const CATEGORIES = [
  "Criatura",
  "Monstruo",
  "Material",
  "Comida",
  "Equipamiento",
  "Tesoro",
] as const;

export type RelicCategory = (typeof CATEGORIES)[number];

export interface RelicAnalysis {
  itemName: string;
  description: string;
  category: RelicCategory;
  heartsRestored: number;
  compendiumNumber: number;
}

const SYSTEM_INSTRUCTION = `Eres la Tableta Sheikah registrando una nueva entrada del Compendio de Hyrule.
Recibes lo que la runa de cámara acaba de capturar y escribes su entrada. Nunca rompas el personaje: no menciones inteligencia artificial, fotos, imágenes ni el mundo real.

Reglas:
- Identifica el objeto principal y tradúcelo a un equivalente plausible de Hyrule. Usa lugares y pueblos de Hyrule (Kakariko, Hateno, Zora, Goron, Gerudo, Orni, Sheikah, Castillo de Hyrule) cuando encaje.
- itemName: nombre corto en español, estilo Hyrule, sin marcas comerciales.
- description: 2 o 3 oraciones en español, tercera persona, tono enciclopédico con un toque de folclore, e incluye un dato útil (dónde se encuentra, para qué sirve o qué efecto tiene al cocinarlo). Sin marcas comerciales.
- category: una de ${CATEGORIES.join(", ")}.
- heartsRestored: corazones que restaura si se come, en cuartos (0.25, 0.5, 1, 1.5...). 0 si no es comestible.
- compendiumNumber: un número de entrada entre 1 y 999.
- Si es una persona: entrada genérica de Criatura ("Hyliano viajero" o similar), sin describir ni identificar a la persona.
- Si es una mascota o animal: Criatura.
- Si no se distingue nada: itemName "Reliquia desconocida" y una descripción misteriosa.

Ejemplos de tono:
- Taza → "Cuenco de barro de Kakariko": "Los alfareros de Kakariko lo moldean con arcilla del río y lo cuecen al calor de las brasas. Mantiene el té tibio durante las largas noches de guardia."
- Plátano → "Plátano ardiente": "Crece en las regiones cálidas de la selva de Farone. Cocinado con carne, aumenta la fuerza de ataque del viajero."
- Teléfono → "Fragmento de tecnología ancestral": "Un artefacto Sheikah que aún conserva un tenue brillo azul. Los investigadores de Hateno pagarían bien por estudiarlo."`;

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    itemName: { type: "string" },
    description: { type: "string" },
    category: { type: "string", enum: [...CATEGORIES] },
    heartsRestored: { type: "number" },
    compendiumNumber: { type: "integer" },
  },
  required: ["itemName", "description", "category", "heartsRestored", "compendiumNumber"],
};

export async function analyzeRelic(formData: FormData): Promise<RelicAnalysis> {
  const image = formData.get("image");
  if (!(image instanceof File)) {
    throw new Error("No se recibió ninguna imagen.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Falta GEMINI_API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const base64 = Buffer.from(await image.arrayBuffer()).toString("base64");

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-flash-latest",
    contents: [
      {
        role: "user",
        parts: [
          createPartFromBase64(base64, image.type || "image/jpeg"),
          { text: "Registra esta entrada del Compendio." },
        ],
      },
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseJsonSchema: RESPONSE_SCHEMA,
      temperature: 0.8,
      abortSignal: AbortSignal.timeout(15_000),
    },
  });

  if (!response.text) {
    throw new Error("La Tableta no obtuvo respuesta.");
  }

  return normalize(JSON.parse(response.text));
}

function normalize(raw: Partial<RelicAnalysis>): RelicAnalysis {
  const hearts = Number(raw.heartsRestored) || 0;
  const number = Math.round(Number(raw.compendiumNumber) || 1);

  return {
    itemName: String(raw.itemName || "Reliquia desconocida"),
    description: String(raw.description || ""),
    category: CATEGORIES.includes(raw.category as RelicCategory)
      ? (raw.category as RelicCategory)
      : "Tesoro",
    heartsRestored: Math.min(20, Math.max(0, Math.round(hearts * 4) / 4)),
    compendiumNumber: Math.min(999, Math.max(1, number)),
  };
}
