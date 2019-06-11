10.05.2019
=============
Iniziato il progetto.

Creati i file con le librerie utilizzate, inizializzata la scena.

16.05.2019
=============
Implementati gli shader utilizzando la Lambertian BRDF e la Microfacet Specular BRDF (utilizzando le funzioni di Schlick, Smith e la GGX per la riflettanza di Fresnel, il fattore geometrico e la distribuzione delle microfacets), integrando DiffuseMap, NormalMap, SpecularMap, RoughnessMap


20.05.2019
=============
Abbiamo deciso che l'oggetto configurabile sarà un tavolo.

In base alle funzionalità che volevamo fornire, abbiamo creato un prototipo dell'interfaccia per gli strumenti per la selezione della texture attiva: essa è suddivisa in parti relative a ogni componente del tavolo, fornedo i possibili materiali e colori per le diverse parti.

Dopo un iniziale tentativo di utilizzo della libreria [Dat Gui](https://github.com/dataarts/dat.gui), abbiamo deciso di creare da zero l'interfaccia poichè dat gui non forniva gli strumenti di necessitavamo.

Finita la logica per l'interfaccia.

Collegato lavoro fatto sugli shader con l'interfaccia e aggiornate le icone delle texture nel menu.

Creato il modello di tavolo da renderizzare e le texture per legno e plastica

22.05.2019
=============
Separato il tavolo in due parti, aggiunto un pulsante per nascondere il menu. Ora &egrave; possibile modificare la texture e il colore di ciascuna parte del tavolo.

23.05.2019
=============
Sistemati alcuni problemi di aggiornamento del menu al primo start.

Aggiunte le texture per il metallo

27.05.2019
=============
Aggiunta la luce dal basso.

Introdotti ulteriori colori per i materiali.

Corretti i riflessi indesiderati sulla parte inferiore.

29.05.2019
=============
Realizzato il css dell'interfaccia

01.06.2019
=============
Aggiunto il materiale marmo

03.06.2019
=============
Aggiunta una luce ambientale    

04.06.2019
=============
Aggiunto il materiale alluminio

05.06.2019
=============
Implementato il menù dei preset

