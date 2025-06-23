#!/bin/bash

echo "🧹 清理旧的构建文件..."
rm -rf dist

echo "🔍 代码检查..."
pnpm run lint

echo "🔨 编译 TypeScript..."
pnpm run build

echo "✅ 构建完成！"
echo "�� 构建文件位于 dist/ 目录" 
