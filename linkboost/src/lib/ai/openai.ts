import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type MessageType =
  | "candidature"
  | "reponse_offre"
  | "relance"
  | "remerciement";

export type Tone =
  | "professionnel"
  | "decontracte"
  | "enthousiaste"
  | "direct";

interface GenerationConfig {
  model: string;
  temperature: number;
  max_tokens: number;
}

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

const CONFIGS: Record<MessageType, GenerationConfig> = {
  candidature: { model: MODEL, temperature: 0.7, max_tokens: 350 },
  reponse_offre: { model: MODEL, temperature: 0.6, max_tokens: 450 },
  relance: { model: MODEL, temperature: 0.6, max_tokens: 300 },
  remerciement: { model: MODEL, temperature: 0.7, max_tokens: 350 },
};

export class AIGenerationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable: boolean
  ) {
    super(message);
    this.name = "AIGenerationError";
  }
}

interface GenerationResult {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function generateMessage(
  type: MessageType,
  systemPrompt: string,
  userPrompt: string
): Promise<GenerationResult> {
  const config = CONFIGS[type];

  try {
    const response = await anthropic.messages.create({
      model: config.model,
      max_tokens: config.max_tokens,
      temperature: config.temperature,
      system: systemPrompt,
      messages: [
        { role: "user", content: userPrompt },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const content = textBlock ? textBlock.text : null;

    if (!content) {
      throw new AIGenerationError(
        "Aucun contenu genere par le modele.",
        "EMPTY_RESPONSE",
        true
      );
    }

    return {
      content: content.trim(),
      usage: {
        prompt_tokens: response.usage.input_tokens,
        completion_tokens: response.usage.output_tokens,
        total_tokens: response.usage.input_tokens + response.usage.output_tokens,
      },
    };
  } catch (error: unknown) {
    if (error instanceof AIGenerationError) {
      throw error;
    }

    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) {
        throw new AIGenerationError(
          "Limite de requetes atteinte. Veuillez reessayer dans quelques instants.",
          "RATE_LIMITED",
          true
        );
      }
      if (error.status === 529 || error.status === 503) {
        throw new AIGenerationError(
          "Le service IA est temporairement indisponible. Veuillez reessayer.",
          "SERVICE_UNAVAILABLE",
          true
        );
      }
      if (error.status === 401) {
        throw new AIGenerationError(
          "Cle API Anthropic invalide ou manquante.",
          "AUTH_ERROR",
          false
        );
      }
      throw new AIGenerationError(
        `Erreur API Anthropic: ${error.message}`,
        "API_ERROR",
        error.status !== undefined && error.status >= 500
      );
    }

    throw new AIGenerationError(
      "Erreur inattendue lors de la generation du message.",
      "UNKNOWN_ERROR",
      false
    );
  }
}

export async function* generateMessageStream(
  type: MessageType,
  systemPrompt: string,
  userPrompt: string
): AsyncIterable<string> {
  const config = CONFIGS[type];

  try {
    const stream = anthropic.messages.stream({
      model: config.model,
      max_tokens: config.max_tokens,
      temperature: config.temperature,
      system: systemPrompt,
      messages: [
        { role: "user", content: userPrompt },
      ],
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield event.delta.text;
      }
    }
  } catch (error: unknown) {
    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) {
        throw new AIGenerationError(
          "Limite de requetes atteinte. Veuillez reessayer dans quelques instants.",
          "RATE_LIMITED",
          true
        );
      }
      if (error.status === 529 || error.status === 503) {
        throw new AIGenerationError(
          "Le service IA est temporairement indisponible. Veuillez reessayer.",
          "SERVICE_UNAVAILABLE",
          true
        );
      }
      throw new AIGenerationError(
        `Erreur API Anthropic: ${error.message}`,
        "API_ERROR",
        error.status !== undefined && error.status >= 500
      );
    }

    throw new AIGenerationError(
      "Erreur inattendue lors du streaming du message.",
      "UNKNOWN_ERROR",
      false
    );
  }
}
