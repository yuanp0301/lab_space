import { defineStore } from "pinia";
import { ref, computed } from "vue";

export type SidebarSection = "chat" | "experiments" | "settings";

export type Conversation = {
  id: string;
  title: string;
  timestamp: number;
  preview?: string;
};

export const useSidebarStore = defineStore("sidebar", () => {
  const activeSection = ref<SidebarSection>("chat");
  const isSecondarySidebarCollapsed = ref(false);
  const conversations = ref<Conversation[]>([]);
  const currentConversationId = ref<string | null>(null);
  const expandedMenuId = ref<string | null>(null);

  const sortedConversations = computed(() => {
    return [...conversations.value].sort((a, b) => b.timestamp - a.timestamp);
  });

  const currentConversation = computed(() => {
    return conversations.value.find(
      (c) => c.id === currentConversationId.value,
    );
  });

  const setActiveSection = (section: SidebarSection) => {
    activeSection.value = section;
  };

  const toggleSecondarySidebar = () => {
    isSecondarySidebarCollapsed.value = !isSecondarySidebarCollapsed.value;
  };

  const addConversation = (title: string = "新对话") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const conversation: Conversation = {
      id,
      title,
      timestamp: Date.now(),
    };
    conversations.value.push(conversation);
    currentConversationId.value = id;
    return conversation;
  };

  const updateConversation = (
    id: string,
    updates: Partial<Omit<Conversation, "id">>,
  ) => {
    const conversation = conversations.value.find((c) => c.id === id);
    if (conversation) {
      Object.assign(conversation, updates);
    }
  };

  const deleteConversation = (id: string) => {
    const index = conversations.value.findIndex((c) => c.id === id);
    if (index !== -1) {
      conversations.value.splice(index, 1);
      if (currentConversationId.value === id) {
        currentConversationId.value = conversations.value[0]?.id || null;
      }
    }
  };

  const setCurrentConversation = (id: string | null) => {
    currentConversationId.value = id;
  };

  const setExpandedMenuId = (id: string | null) => {
    expandedMenuId.value = id;
    // 当展开菜单时，显示二级侧边栏
    if (id) {
      isSecondarySidebarCollapsed.value = false;
    }
  };

  return {
    activeSection,
    isSecondarySidebarCollapsed,
    conversations,
    currentConversationId,
    expandedMenuId,
    sortedConversations,
    currentConversation,
    setActiveSection,
    toggleSecondarySidebar,
    addConversation,
    updateConversation,
    deleteConversation,
    setCurrentConversation,
    setExpandedMenuId,
  };
});
