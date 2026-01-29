import { ref, onUnmounted } from "vue";

export type SSEChunk = {
  content: string;
  is_final: boolean;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
};

export type SSEOptions = {
  onChunk?: (chunk: SSEChunk) => void;
  onError?: (error: Error) => void;
  onComplete?: (usage?: SSEChunk["usage"]) => void;
};

export function useSSE() {
  const isStreaming = ref(false);
  const error = ref<Error | null>(null);
  const abortController = ref<AbortController | null>(null);

  const stream = async (
    url: string,
    body: object,
    options: SSEOptions = {},
  ) => {
    isStreaming.value = true;
    error.value = null;
    abortController.value = new AbortController();

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: abortController.value.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Response body is not readable");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE events
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const event of events) {
          if (!event.trim()) continue;

          const lines = event.split("\n");
          let data = "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              data = line.slice(6);
            }
          }

          if (data) {
            try {
              const chunk = JSON.parse(data) as SSEChunk;

              if (chunk.content) {
                options.onChunk?.(chunk);
              }

              if (chunk.is_final) {
                options.onComplete?.(chunk.usage);
              }
            } catch {
              console.warn("Failed to parse SSE data:", data);
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        error.value = err;
        options.onError?.(err);
      }
    } finally {
      isStreaming.value = false;
      abortController.value = null;
    }
  };

  const abort = () => {
    abortController.value?.abort();
    isStreaming.value = false;
  };

  onUnmounted(() => {
    abort();
  });

  return {
    stream,
    abort,
    isStreaming,
    error,
  };
}
