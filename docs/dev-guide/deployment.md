# Nginx 部署配置

> [返回目录](index.md)

### 7.1 `nginx.conf` 内容

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain application/javascript application/json text/css image/svg+xml;
    gzip_min_length 1024;

    # SPA 路由 fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源长期缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 禁止访问 source map
    location ~* \.map$ {
        deny all;
    }
}
```

### 7.2 构建部署流程

```bash
# 1. 构建
npm run build

# 2. 产物在 dist/ 目录
# 3. 将 dist/ 内容复制到 Nginx root 目录 (/usr/share/nginx/html/)
# 4. 确保 nginx.conf 正确放置
# 5. nginx -t && nginx -s reload
```

### 7.3 Vite 构建配置注意

- `build.outDir`: `'dist'`
- `build.assetsDir`: `'assets'` (JS/CSS/图片归类)
- `build.rollupOptions.output.manualChunks`: 将 vendor 拆分为独立 chunk
  - `element-plus` → `vendor-element.js`
  - `echarts` → `vendor-echarts.js`
  - `d3` → `vendor-d3.js`
  - `maptalks` → `vendor-maptalks.js`
- `build.chunkSizeWarningLimit`: `1000` (允许较大 chunk)
