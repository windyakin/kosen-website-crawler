FROM node:24-slim
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    udev \
    fontconfig \
    ca-certificates \
    fonts-noto-cjk \
    chromium \
  && fc-cache -fv \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_SKIP_DOWNLOAD=true \
  CHROME_EXECUTE_PATH=/usr/bin/chromium

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
  && mkdir -p /home/pptruser/Downloads \
  && chown -R pptruser:pptruser /home/pptruser \
  && mkdir -p /usr/src/app \
  && chown -R pptruser:pptruser /usr/src/app

USER pptruser

WORKDIR /usr/src/app

COPY --chown=pptruser:pptruser package.json .
COPY --chown=pptruser:pptruser package-lock.json .

RUN npm ci --omit=dev

COPY --chown=pptruser:pptruser . .

CMD ["npm", "start"]
VOLUME /usr/src/app/screenshots
