# Gjøre spørringer mot redis i dev/prod

-   Logg inn i containeren:

    > `k -ntbd exec -ti speil-redis-<hash> /bin/sh`

-   Sett opp auth:

    > `export REDISCLI_AUTH=$( sed -e 's/.*=//' -e "s/'//g" /var/run/secrets/nais.io/vault/redis.env )`

    Denne sourcer creds-fila, fisker ut verdien og setter miljøvariabel.

-   Kjør kommandoer, feks:
    > `redis-cli KEYS sess*`

---

Eksempler på spørringer:

-   Finn sesjoner for gitt ident (Nav-ident på format A321456):

    > `for key in $(redis-cli kEYS sess*); do redis-cli GET $key; done | grep <`_**`Nav-ident`**_`>`

-   Slette alle sesjoner for ident (HER BØR DU VITE HVA DU GJØR):
    > `for key in $(redis-cli kEYS sess*); do redis-cli GET $key | grep <`_**`Nav-ident`**_`> > /dev/null; test $? == 0 && echo $key; done | xargs redis-cli DEL`
