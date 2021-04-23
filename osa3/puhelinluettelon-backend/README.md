# Huom! Lue tämä!

Olen toiminut tehtävässä 3.10 eri tavalla kuin materiaalissa neuvottiin.

Tarkemmin sanottuna [sovellus](https://fs-puhelinluettelo-17400.herokuapp.com/) on viety internettiin käyttäen Herokun Docker-rajapintaa. Sovellus on siis kääritty Docker-konttiin ja tämä image on pushattu Herokun palvelimille. Tämä on vaihtoehto Git-pohjaiselle menetelmälle. Dockerin käytöstä on se etu, että tällöin projektin ei tarvitse olla repositorion juuressa.

## Sovelluksen vienti internettiin

Herokulla on kohtuullisen hyvä ohje [Docker-deployment](https://devcenter.heroku.com/articles/container-registry-and-runtime)-optiosta.

Sovelluksen Dockerfile on kohtuullisen yksinkertainen. Se pohjautuu Noden Alpine-imageen, asentaa projektin riippuvuudet ja kopioi varsinaiset projektitiedostot kontin sisälle. Lisäksi asennetaan shelliksi bash, jota on miellyttävämpi käyttää, ja määritellään, että konttia ei ajeta root-käyttäjänä. Lopuksi määritellään serverin käynnistyskomento ```npm start```. Alpinen ansiosta image on suhteellisen pienikokoinen: siinä, missä standardi-image on yli 900 Mt, Alpine-versio on vain reilut 100 Mt.

```Dockerfile
FROM node:14-alpine
ENV NODE_ENV=production

RUN apk add --no-cache --update bash tree

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production

COPY index.js ./
COPY build ./build/

RUN adduser -D docker
USER docker

CMD [ "npm", "start" ]
```

Sovelluksen julkaisua varten on määritelty komennot kurssimateriaalin esimerkin mukaisesti. Komennot ovat samannimisiä kuin kurssimateriaalissa, mutta niiden määrittelyt ovat hieman erilaisia. Koko sovellus saadaan vietyä tuotantoon komennolla ```npm run deploy:full```. Komennot on määritelty seuraavasti:

```JSON
{
  "scripts": {
    // ...
    "build:ui": "rm -rf ./build && cd ../../osa2/puhelinluettelo && npm run build --prod && cp -r build ../../osa3/puhelinluettelon-backend/",
    "deploy": "heroku container:login && heroku container:push web -a fs-puhelinluettelo-17400 && heroku container:release web -a fs-puhelinluettelo-17400",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "heroku logs --tail -a fs-puhelinluettelo-17400"
  }
}
```
