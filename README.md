# Kosen Website Crawler

[![Build Status](https://travis-ci.org/windyakin/kosen-website-crawler.svg?branch=master)](https://travis-ci.org/windyakin/kosen-website-crawler)
[![dependencies Status](https://david-dm.org/windyakin/kosen-website-crawler/status.svg)](https://david-dm.org/windyakin/kosen-website-crawler)

高専のウェブサイトをクロールしてスクリーンショットを保存します。

## Getting started

### Now available on Docker Hub! 🐳

[![Docker Images](https://images.microbadger.com/badges/image/windyakin/kosen-website-crawler.svg)](https://hub.docker.com/r/windyakin/kosen-website-crawler/)

* [windyakin/kosen-website-crawler](https://hub.docker.com/r/windyakin/kosen-website-crawler/) 

#### Run

```shell
make
```

#### Build Docker image by yourself

```shell
make build
```

### Running on local machine

required node version >= 8

```shell
npm install
npm start
```

## Tips

### How to change crawling sites?

websites.json の内容を変更すると高専のサイト以外も取得することができます。

## Author

* windyakin [@MITLicense](https://twitter.com/MITLicense)
* raryosu [@raryosu](https://twitter.com/raryosu)
