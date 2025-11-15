# 构建阶段
FROM node:20-alpine as build
WORKDIR /app

# 复制依赖文件并安装
COPY package*.json ./
RUN npm install

# 复制项目文件并构建
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物到nginx目录
COPY --from=build /app/dist /usr/share/nginx/html

# 使用默认nginx配置

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]