// vitest.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		include: ["src/**/*.test.{tsx,ts}"], // 测试文件路径
		globals: true, // 启用全局API，如describe, test, expect
		environment: "jsdom", // 浏览器环境模拟
		setupFiles: "./src/tests/setup.ts", // 测试初始化文件
		coverage: {
			reporter: ["text", "json", "html"], // 覆盖率报告格式
		},
	},
});
