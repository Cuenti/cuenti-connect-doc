# syntax=docker/dockerfile:1
FROM node:22-alpine AS build

WORKDIR /workspace/developer-portal

RUN corepack enable

COPY package.json pnpm-lock.yaml .npmrc ./

RUN --mount=type=secret,id=NPM_TOKEN \
  auth="$(cat /run/secrets/NPM_TOKEN)" \
  && test -n "${auth}" \
  && case "${auth}" in \
    *:_authToken=*) cat /run/secrets/NPM_TOKEN >> .npmrc ;; \
    *) printf '//package-manager.cuenti.co/:_authToken=%s\n' "${auth}" >> .npmrc ;; \
  esac \
  && pnpm install --frozen-lockfile \
  && rm -f .npmrc

COPY . ./

ARG PUBLIC_PROXY_BASE_URL
ARG PUBLIC_TRY_IT_ENABLED=true
ENV PUBLIC_PROXY_BASE_URL=${PUBLIC_PROXY_BASE_URL}
ENV PUBLIC_TRY_IT_ENABLED=${PUBLIC_TRY_IT_ENABLED}

RUN test -n "${PUBLIC_PROXY_BASE_URL}" \
  && pnpm run build

FROM nginx:1.29-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/developer-portal/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --spider --quiet http://127.0.0.1:8080/ || exit 1
