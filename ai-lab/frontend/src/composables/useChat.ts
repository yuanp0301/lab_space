import { ref, computed } from "vue";
import { chatApi, type ChatMessage, type ProviderInfo } from "@/api/chat";
import { useSSE } from "./useSSE";

export type Message = ChatMessage & {
  id: string;
  timestamp: number;
};

export function useChat() {
  const messages = ref<Message[]>([]);
  const providers = ref<ProviderInfo[]>([]);
  const currentProvider = ref<string>("");
  const currentModel = ref<string>("");
  const isLoading = ref(false);

  const { stream, abort, isStreaming } = useSSE();

  const isGenerating = computed(() => isStreaming.value);

  const loadProviders = async () => {
    try {
      const response = await chatApi.getProviders();
      providers.value = response.data;

      // Set default provider and model
      if (providers.value.length > 0 && !currentProvider.value) {
        const first = providers.value[0];
        currentProvider.value = first.name;
        currentModel.value = first.default_model;
      }
    } catch (error) {
      console.error("Failed to load providers:", error);
    }
  };

  const generateId = () =>
    `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const addMessage = (
    role: Message["role"],
    content: string | ChatMessage["content"],
  ) => {
    const message: Message = {
      id: generateId(),
      role,
      content,
      timestamp: Date.now(),
    };
    messages.value.push(message);
    return message;
  };

  const sendMessage = async (content: string | ChatMessage["content"]) => {
    // Add user message
    addMessage("user", content);

    // Add placeholder for assistant message
    const assistantMessage = addMessage("assistant", "");

    isLoading.value = true;

    try {
      await stream(
        chatApi.getStreamUrl(),
        {
          messages: messages.value.slice(0, -1).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          provider: currentProvider.value || undefined,
          model: currentModel.value || undefined,
        },
        {
          onChunk: (chunk) => {
            // Update assistant message content
            if (typeof assistantMessage.content === "string") {
              assistantMessage.content += chunk.content;
            }
          },
          onError: (error) => {
            assistantMessage.content = `错误: ${error.message}`;
          },
          onComplete: () => {
            isLoading.value = false;
          },
        },
      );
    } catch {
      isLoading.value = false;
    }
  };

  const clearMessages = () => {
    messages.value = [];
  };

  const stopGeneration = () => {
    abort();
    isLoading.value = false;
  };

  const setProvider = (providerName: string) => {
    currentProvider.value = providerName;
    // Update model to provider's default
    const provider = providers.value.find((p) => p.name === providerName);
    if (provider) {
      currentModel.value = provider.default_model;
    }
  };

  const setModel = (model: string) => {
    currentModel.value = model;
  };

  const getCurrentProviderModels = computed(() => {
    const provider = providers.value.find(
      (p) => p.name === currentProvider.value,
    );
    return provider?.models || [];
  });

  return {
    messages,
    providers,
    currentProvider,
    currentModel,
    isLoading,
    isGenerating,
    loadProviders,
    sendMessage,
    clearMessages,
    stopGeneration,
    setProvider,
    setModel,
    getCurrentProviderModels,
  };
}
