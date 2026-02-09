import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const username = ref<string>("");
  const isLoggedIn = ref<boolean>(false);

  // 设置用户名（保存时使用）
  const setUsername = (name: string) => {
    username.value = name;
    isLoggedIn.value = true;
  };

  // 清除用户信息
  const clearUser = () => {
    username.value = "";
    isLoggedIn.value = false;
  };

  return {
    username,
    isLoggedIn,
    setUsername,
    clearUser,
  };
});
