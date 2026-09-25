"use server";

export type RelicCategory = "Material" | "Arma" | "Comida" | "Tesoro" | "Criatura";

export interface RelicAnalysis {
  itemName: string;
  description: string;
  heartsRestored: number;
  category: RelicCategory;
}

export async function analyzeRelic(formData: FormData): Promise<RelicAnalysis> {
  const image = formData.get("image");

  if (!(image instanceof File)) {
    throw new Error("No se recibió ninguna imagen.");
  }

  // Delay artificial para simular la latencia real de un modelo de visión.
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // TODO: reemplazar este mock por una llamada real a OpenAI Vision (enviar
  // `image` como base64/blob) y luego enriquecer/buscar el resultado en
  // Webflow CMS (ej. hacer match de itemName contra un collection item).
  // El File `image` ya está disponible arriba — swap del bloque de abajo,
  // manteniendo la misma forma de retorno RelicAnalysis.

  return {
    itemName: "Manzana Hyliana",
    description:
      "Una fruta común en todo Hyrule. Cómela cruda para recuperar medio corazón.",
    heartsRestored: 0.5,
    category: "Material",
  };
}
