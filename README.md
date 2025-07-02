# Whisper ASR 客户端

这是一个基于 React、TypeScript 和 Vite 构建的 Whisper ASR 客户端应用程序。它旨在提供一个用户友好的界面，用于与 [ahmetoner/whisper-asr-webservice](https://github.com/ahmetoner/whisper-asr-webservice) 项目提供的 API 进行交互，并在此基础上拓展功能。

## 技术栈

- **前端框架**: React 19
- **构建工具**: Vite 6
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4
- **包管理**: PNPM
- **测试**:
  - 单元测试: Vitest, React Testing Library, JSDOM
  - 端到端测试: Playwright
- **代码规范**: Biome
- **Git Hooks**: Lefthook
- **Commit 规范**: Commitlint

## 特性

- 基于 React 19 和 Vite 6 的快速开发环境。
- 使用 TypeScript 提供类型安全。
- 通过 Tailwind CSS 实现快速和响应式 UI 开发。
- 集成 Vitest 和 Playwright 进行全面的测试。
- 使用 Biome 强制执行代码规范。
- 通过 Lefthook 和 Commitlint 确保提交信息规范。
- 与 [ahmetoner/whisper-asr-webservice](https://github.com/ahmetoner/whisper-asr-webservice) 后端服务无缝集成。
- 在此基础上拓展更多功能。

## 安装

请确保您已安装 Node.js (版本 >= 20) 和 PNPM。

1. 克隆仓库:

    ```bash
    git clone https://github.com/lloyd42/whisper-asr-client.git
    cd whisper-asr-client
    ```

2. 安装依赖:

    ```bash
    pnpm install
    ```

## 运行项目

在开发模式下启动应用程序:

```bash
pnpm dev
```

这将在本地开发服务器上运行应用程序，并支持热模块重载 (HMR)。

## 构建项目

构建生产就绪的应用程序:

```bash
pnpm build
```

构建输出将位于 `dist/` 目录下。

## 测试

### 单元测试

运行单元测试:

```bash
pnpm test
```

### 端到端测试

运行端到端测试:

```bash
pnpm test:e2e
```

## 代码规范

检查代码规范问题:

```bash
pnpm lint
```

自动修复代码规范问题:

```bash
pnpm lint:fix
```

## Git Hooks

本项目使用 Lefthook 管理 Git Hooks，以确保代码质量和提交规范。`pnpm install` 命令会自动安装 Lefthook。
