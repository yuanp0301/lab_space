import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ChatMessage, ProviderInfo } from "@/api/chat";
import { chatApi } from "@/api/chat";

export type StoredMessage = ChatMessage & {
  id: string;
  timestamp: number;
};

export const useChatStore = defineStore("chat", () => {
  const messages = ref<StoredMessage[]>([]);
  const providers = ref<ProviderInfo[]>([]);
  const currentProvider = ref<string>("");
  const currentModel = ref<string>("");
  const systemPrompt = ref<string>("");

  const hasMessages = computed(() => messages.value.length > 0);

  const currentProviderInfo = computed(() =>
    providers.value.find((p) => p.name === currentProvider.value),
  );

  const availableModels = computed(
    () => currentProviderInfo.value?.models || [],
  );

  const fetchProviders = async () => {
    try {
      const response = await chatApi.getProviders();
      providers.value = response.data;

      if (providers.value.length > 0 && !currentProvider.value) {
        const first = providers.value[0];
        currentProvider.value = first.name;
        currentModel.value = first.default_model;
      }
    } catch (error) {
      console.error("Failed to fetch providers:", error);
    }
  };

  const addMessage = (message: Omit<StoredMessage, "id" | "timestamp">) => {
    const newMessage: StoredMessage = {
      ...message,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: Date.now(),
    };
    messages.value.push(newMessage);
    return newMessage;
  };

  const updateMessage = (id: string, content: string) => {
    const message = messages.value.find((m) => m.id === id);
    if (message) {
      message.content = content;
    }
  };

  const clearMessages = () => {
    messages.value = [];
  };

  const setProvider = (name: string) => {
    currentProvider.value = name;
    const provider = providers.value.find((p) => p.name === name);
    if (provider) {
      currentModel.value = provider.default_model;
    }
  };

  const setModel = (model: string) => {
    currentModel.value = model;
  };

  const setSystemPrompt = (prompt: string) => {
    systemPrompt.value = prompt;
  };

  const getMessagesForAPI = (): ChatMessage[] => {
    const apiMessages: ChatMessage[] = [];

    if (systemPrompt.value) {
      apiMessages.push({ role: "system", content: systemPrompt.value });
    }

    for (const msg of messages.value) {
      apiMessages.push({ role: msg.role, content: msg.content });
    }

    return apiMessages;
  };

  return {
    messages,
    providers,
    currentProvider,
    currentModel,
    systemPrompt,
    hasMessages,
    currentProviderInfo,
    availableModels,
    fetchProviders,
    addMessage,
    updateMessage,
    clearMessages,
    setProvider,
    setModel,
    setSystemPrompt,
    getMessagesForAPI,
  };
});
