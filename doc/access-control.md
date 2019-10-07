### Gi tilgang til Speil i dev (aka preprod) via AD:

Vedkommende som ønsker tilgang må:

-   Opprette trygdeetaten-bruker: gå til oida.adeo.no, logg på med NAV-ident og lag passord. Funker det ikke etter det så kan man kontakte IT-hjelpa og få dem til å sjekke om brukeren er opprettet med riktig e-postadresse ([NAV-ident]@trygdeetaten.no).

En owner i AD-gruppa må:

-   Gå til portal.azure.com, logg inn med trygdeetaten.no-adresse, velg Azure Active Directory i venstremenyen og Groups.
-   Søk opp gruppen `0000-AZ-speil-brukere`, velg Members og Add members, søk opp vedkommendes trygdeetaten-bruker og trykk Select.
