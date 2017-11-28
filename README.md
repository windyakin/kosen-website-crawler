# Kosen Website Crawler

高専のウェブサイトをクロールしてスクリーンショットを保存します。

## Getting started

### Running on Docker

* Now available on Docker Hub!
  * [windyakin/kosen-website-crawler](https://hub.docker.com/r/windyakin/kosen-website-crawler/)

```
docker-compose up -d
```

### Running on local machine

required node version >= 7.10.0

```
yarn install
yarn start
```

## How to change crawling sites?

websites.json の内容を変更すると高専のサイト以外も取得することができます。

## Author

* windyakin [@MITLicense](https://twitter.com/MITLicense)
* raryosu [@raryosu](https://twitter.com/raryosu)
