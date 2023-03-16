FROM node:19-slim
ENV DEBIAN_FRONTEND=noninteractive


# Install Font
RUN mkdir /noto \
  && apt-get update \
  && apt-get install -y --no-install-recommends \
    udev \
    unzip \
    fontconfig \
    ca-certificates \
    curl \
  && curl -sL -o /noto/noto.zip https://noto-website.storage.googleapis.com/pkgs/NotoSansCJKjp-hinted.zip \
  && unzip -d /noto/fonts /noto/noto.zip \
  && mkdir -p /usr/share/fonts/noto \
  && cp /noto/fonts/*.otf /usr/share/fonts/noto \
  && chmod 644 -R /usr/share/fonts/noto/ \
  && fc-cache -fv \
  && rm -rf /noto \
  && apt-get --force-yes remove -y --purge \
    unzip \
    fontconfig \
  && apt-get autoremove -y \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    chromium \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
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

RUN npm install --production

COPY --chown=pptruser:pptruser . .

CMD ["npm", "start"]
VOLUME /usr/src/app/screenshots
