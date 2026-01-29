<script setup lang="ts">
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  zhCN,
  dateZhCN,
  type GlobalThemeOverrides,
} from "naive-ui";

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#4F8CFF",
    primaryColorHover: "#3B6FD9",
    primaryColorPressed: "#2A52B3",
    primaryColorSuppl: "#4F8CFF",
    borderRadius: "8px",
    borderRadiusSmall: "6px",
  },
  Button: {
    borderRadiusMedium: "8px",
    borderRadiusSmall: "6px",
    borderRadiusLarge: "10px",
  },
  Input: {
    borderRadius: "8px",
  },
  Card: {
    borderRadius: "12px",
  },
  Tabs: {
    tabTextColorLine: "#6B7280",
    tabTextColorActiveLine: "#4F8CFF",
    tabTextColorHoverLine: "#4F8CFF",
    barColor: "#4F8CFF",
  },
};
</script>

<template>
  <NConfigProvider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme-overrides="themeOverrides"
  >
    <NMessageProvider>
      <NDialogProvider>
        <router-view />
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
