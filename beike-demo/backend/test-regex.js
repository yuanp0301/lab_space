const fs = require("fs");
const content = fs.readFileSync(
  "../data/busi/7. 1《秋天的怀念》情境任务式课程设计（表格版）.md",
  "utf-8",
);

console.log("Total content length:", content.length);

// Test current regex
const regex1 = /###\s*\*\*[一二三四五六七八九十]*、?教学过程[\s\S]*?(?=###|$)/;
const match1 = content.match(regex1);
console.log("\nRegex 1 (non-greedy):");
console.log("Match found:", !!match1);
console.log("Match length:", match1 ? match1[0].length : 0);
if (match1) {
  console.log("First 200 chars:", match1[0].substring(0, 200));
}

// Test greedy version
const regex2 = /###\s*\*\*[一二三四五六七八九十]*、?教学过程[\s\S]*(?=###|$)/;
const match2 = content.match(regex2);
console.log("\nRegex 2 (greedy):");
console.log("Match found:", !!match2);
console.log("Match length:", match2 ? match2[0].length : 0);
if (match2) {
  console.log("First 200 chars:", match2[0].substring(0, 200));
}

// Test with just going to end
const regex3 = /###\s*\*\*[一二三四五六七八九十]*、?教学过程[\s\S]*/;
const match3 = content.match(regex3);
console.log("\nRegex 3 (no lookahead):");
console.log("Match found:", !!match3);
console.log("Match length:", match3 ? match3[0].length : 0);
if (match3) {
  console.log("First 200 chars:", match3[0].substring(0, 200));
  console.log("Last 200 chars:", match3[0].substring(match3[0].length - 200));
}
