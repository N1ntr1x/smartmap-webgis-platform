import { QueryInput } from "@/features/chatbot";


/*
Servizio API chatbot - gestisce chiamate al backend Python
Include fetch query e reset sessione conversazione
*/

// Funzione principale query chatbot
/* export async function fetchChatbotData(queryInput: QueryInput): Promise<any> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_CHATBOT_API_URL;
    if (!apiUrl) {
      throw new Error("La variabile d'ambiente NEXT_PUBLIC_CHATBOT_API_URL non è configurata.");
    }
    const res = await fetch(`${apiUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(queryInput)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || 'Errore nella risposta dell\'API');
    }

    const data = await res.json();
    return data;

  } catch (error: any) {
    console.error("Errore nella chiamata a fetchChatbotData:", error);
    throw error;
  }
} */

// Reset sessione conversazione chatbot
export async function fetchChatbotResetSession(sessionId: string): Promise<any> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_CHATBOT_API_URL;
    if (!apiUrl) {
      throw new Error("La variabile d'ambiente NEXT_PUBLIC_CHATBOT_API_URL non è configurata.");
    }
    const res = await fetch(`${apiUrl}/chat/session/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || 'Errore nella risposta dell\'API');
    }

  } catch (error: any) {
    console.error("Errore nella chiamata a fetchChatbotResetSession:", error);
    // Rilancia l'errore in modo che possa essere gestito dall'hook `useChatbot`
    throw error;
  }
}

// L'implementazione reale con chiamata all'API Python è commentata sopra.
export async function fetchChatbotData(input: QueryInput) {
  return {
    "answer": "Certamente, ho cercato i servizi disponibili per anziani nell'area di Messina. Ecco cosa ho trovato:\n\nPer quanto riguarda l'assistenza psicogeriatrica, è presente il **Centro Territoriale di Psicogeriatria** in Via Sant'Elia snc, Messina. Questo centro si occupa della diagnosi e del trattamento di disturbi cognitivi e demenze negli anziani, offrendo prestazioni come la valutazione neuropsicologica, la diagnosi precoce di demenze (come Alzheimer e demenza vascolare), terapie farmacologiche e non farmacologiche, stimolazione cognitiva, gruppi di supporto per i caregiver familiari e consulenze per la gestione dei disturbi comportamentali. Potete contattarli al numero 090 3653 375 o via email all'indirizzo psicogeriatria@asp.messina.it. Gli orari di apertura sono dal lunedì al venerdì dalle 8:30 alle 13:30 e il martedì e giovedì dalle 14:30 alle 17:00. L'accesso è possibile sia con prescrizione del medico di famiglia che su accesso diretto.\n\nNell'ambito dei Centri Diurni per Anziani, l'ASP gestisce il **Centro Diurno \"Villa Serena\"** a Messina, situato in Via Comunale Santo, 22. Questo centro offre posti per 25 persone e gli orari sono dal lunedì al venerdì dalle 8:00 alle 17:00. I servizi includono assistenza sanitaria (infermieristica e fisioterapica), pasti (colazione, pranzo, merenda), attività ricreative e di socializzazione, e trasporto da e per il domicilio su richiesta. Il numero di telefono è 090 3652 200.\n\nInoltre, ho individuato alcuni servizi che offrono attività ludico-ricreative e di socializzazione per persone anziane, con l'obiettivo di promuovere il loro benessere psicofisico. Tra questi, segnalo:\n\n*   **Gerusia**, situata nel Parco Urbano Villa Dante S.n.c. a Messina. L'accesso è libero e la segnalazione può avvenire tramite il Servizio Sociale Professionale, enti della rete, parrocchie, istituti religiosi e associazioni di volontariato. Il numero di riferimento è 98124.\n*   La **Comunità di Sant'Egidio - Sicilia ODV-Ets** offre consulenze sociali per gli anziani ospiti presso Casa Serena, in Via del Santo 26, Messina. Il servizio prevede attività di sostegno, accompagnamento e laboratoriali. Potete contattarli all'indirizzo info@santegidio.sicilia.it o al numero 0902008768.\n*   **Casa Serena**, una casa di riposo per anziani gestita da Messina Social City, si trova in Via del Santo 27, Messina. L'obiettivo è la centralità della persona nell'invecchiamento attivo. L'accesso prevede una compartecipazione commisurata al reddito e una domanda scaricabile dal sito: https://www.messinasocialcity.it/wp-content/uploads/2019/04/Istanza-accesso-Casa-Serena.pdf. Il numero di telefono è 090696262.\n\nHo trovato anche la **Federazione Nazionale Pensionati Cisl** in Viale Europa 58, Messina, che offre un servizio di counseling per il sostegno e l'assistenza fiscale e burocratica rivolto ai pensionati, con consulenze su questioni legate al pensionamento e all'anzianità. Potete contattarli via email a pensionati.messina@cisl.it o federazione.pensionati@cislmessina.net, o al numero 090363577.\n\nSpero queste informazioni possano esservi utili! Se avete bisogno di chiarimenti o di cercare altri tipi di servizi, non esitate a chiedere.",
    "geojson": {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              15.541983961061,
              38.171767876858
            ]
          },
          "properties": {
            "name": "Gerusia",
            "description": "La struttura offre servizi a persone anziane con l&#39;obiettivo di promuovere la socializzazione e il loro benessere psicofisico.",
            "category": "Attività  - Ludico Ricreative",
            "city": "Messina",
            "icon": null,
            "color": null,
            "sources": {
              "web": []
            },
            "customData": {
              "indirizzo": "Parco Urbano Villa Dante S.n.c.",
              "cap": "98124",
              "telefono": null,
              "mail": null,
              "gestore": "Messina Social City",
              "utenti": 45,
              "area": "Anziani",
              "modalita": "Accesso libero, Segnalazione Servizio Sociale Professionale, segnalazione enti della rete, nessuna modalità, Segnalazione da parte di parrocchie, istituti religiosi e associazioni di volontariato"
            },
            "score": 1
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              15.5501471,
              38.1796162
            ]
          },
          "properties": {
            "name": "Federazione Nazionale Pensionati",
            "description": "Servizio di sostegno e assistenza fiscale e burocratica, rivolto ai pensionati. Si offrono consulenze di vario tipo, per situazioni legate a pensionamento e anzianità",
            "category": "Servizio - Di Counseling",
            "city": "Messina",
            "icon": null,
            "color": null,
            "sources": {
              "web": []
            },
            "customData": {
              "indirizzo": "viale europa 58",
              "cap": "98123",
              "telefono": "090363577",
              "mail": "pensionati.messina@cisl.it / federazione.pensionati@cislmessina.net",
              "gestore": "Cisl",
              "utenti": 100,
              "area": "Anziani, Disabilità",
              "modalita": "Accesso libero"
            },
            "score": 0.8
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              15.546742737293,
              38.179103541708
            ]
          },
          "properties": {
            "name": "Servizio anziani Casa Serena",
            "description": "Servizio agli anziani ospiti presso Casa serena. Prevede attività di sostegno, accompagnamento e laboratoriali",
            "category": "Consulenze - Sociali",
            "city": "Messina",
            "icon": null,
            "color": null,
            "sources": {
              "web": []
            },
            "customData": {
              "indirizzo": "Via del Santo 26",
              "cap": "98124",
              "telefono": "0902008768",
              "mail": "info@santegidio.sicilia.it",
              "gestore": "Comunità di Sant'Egidio  - Sicilia ODV-Ets",
              "utenti": 30,
              "area": "Anziani",
              "modalita": "Accesso libero"
            },
            "score": 0.7
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              15.546535134577,
              38.179223089429
            ]
          },
          "properties": {
            "name": "Casa Serena",
            "description": "Casa di riposo per anziani. Il focus delle attività che vi si svolgono è la centralità della persona ritenuta attore protagonista del processo di invecchiamento attivo.\nSi accede con una compartecipazione commisurata al reddito e con una domanda scaricabile dal sito (https://www.messinasocialcity.it/wp-content/uploads/2019/04/Istanza-accesso-Casa-Serena.pdf)",
            "category": "Centro Accoglienza - Servizi Residenziali",
            "city": "Messina",
            "icon": null,
            "color": null,
            "sources": {
              "web": []
            },
            "customData": {
              "indirizzo": "Via del Santo 27",
              "cap": "98124",
              "telefono": "090696262",
              "mail": "casaserena@messinasocialcity.it",
              "gestore": "Messina Social City",
              "utenti": 42,
              "area": "Anziani",
              "modalita": "Accesso libero, Segnalazione Servizio Sociale Professionale, Comune"
            },
            "score": 0.64
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              15.5547344,
              38.1792055
            ]
          },
          "properties": {
            "name": "SAI DM-DS (Vulnerabili)",
            "description": "Il Progetto ha l&#39;obiettivo di accogliere e accompagnare i beneficiari richiedenti asilo o titolari di una forma di protezione lungo un graduale percorso di integrazione e autonomia volto all’inserimento socio economico.",
            "category": "Centro Accoglienza - Servizi Residenziali",
            "city": "Messina",
            "icon": null,
            "color": null,
            "sources": {
              "web": []
            },
            "customData": {
              "indirizzo": "Via Industriale 32",
              "cap": "98121",
              "telefono": "090 7384960",
              "mail": "info@Medihospes.it",
              "gestore": "Medihospes",
              "utenti": 51,
              "area": "Famiglie, Immigrati, Donne, Adulti, Uomini",
              "modalita": "Segnalazione Servizio Centrale"
            },
            "score": 0.23
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              15.542026341158,
              38.167275092112
            ]
          },
          "properties": {
            "name": "Riabilitazione minori ex art.26",
            "description": "Prestazioni ambulatoriali di terapia riabilitativa (logopedia, neuropsicomotricità). \nLe prestazioni sono convenzionate, dietro autorizzazione dell&#39;ASP di Messina.",
            "category": "Assistenza Sanitaria - Assistenza Sanitaria",
            "city": "Messina",
            "icon": null,
            "color": null,
            "sources": {
              "web": []
            },
            "customData": {
              "indirizzo": "Via Uberto Bonino, complesso I Granai 8",
              "cap": "98124",
              "telefono": "3534147138",
              "mail": "treali.onlus@gmail.com",
              "gestore": "Tre Ali Onlus",
              "utenti": 40,
              "area": "Disabilità, Minori",
              "modalita": "ASP"
            },
            "score": 0.08
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              15.554797312124,
              38.179274893168
            ]
          },
          "properties": {
            "name": "SAI MSNA &quot;Casa Aylan&quot;",
            "description": "Il Progetto ha l&#39;obiettivo di garantire ai minori stranieri non accompagnati (MSNA) protezione e luoghi sicuri di accoglienza coinvolgendo servizi ed enti presenti sul territorio quali attuatori di percorsi facilitanti l&#39;istruzione, lo sviluppo evolutivo, la regolarizzazione, la tutela.",
            "category": "Centro Accoglienza - Servizi Residenziali",
            "city": "Messina",
            "icon": null,
            "color": null,
            "sources": {
              "web": []
            },
            "customData": {
              "indirizzo": "Via Industriale 32",
              "cap": "98121",
              "telefono": "090 7384960",
              "mail": "info@Medihospes.it",
              "gestore": "Medihospes",
              "utenti": 11,
              "area": "Immigrati, Minori, Adolescenti",
              "modalita": "Segnalazione Servizio Centrale"
            },
            "score": 0
          }
        }
      ]
    },
    "session_id": "cffb9e76-61a3-48a3-91bf-16ef15b4d5d8"
  }
}