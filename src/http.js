export async function fetchAvailablePlaces() {
  // con await aspetto che la richiesta HTTP al backend venga completata (cioè che fetch risponda)
  const response = await fetch("http://localhost:3000/places"); //mando la richiesta get '/places' al backend sulla porta 3000

  // con await aspetto che il contenuto della risposta venga trasformato in oggetto JavaScript.
  const data = await response.json(); //riconverto la risposta da json al suo tipo di dato originale

  if (!response.ok) {
    throw new Error("Fallimento nel caricamento delle Destinazioni"); // intercetto manualmente un errore per mandarlo al catch se la response c'é ma non é 'ok'
  }

  return data.places;
}

export async function updateUserPlaces(places) {
  const response = await fetch("http://localhost:3000/user-places", {
    //il secondo parametro del metodo fetch é un oggetto contenente informazioni ulteriori sulla richiesta
    method: "PUT", //specifichiamo di voler caricare dei dati
    body: JSON.stringify({ places }), //il dato che vogliamo caricare (il backend richiede un oggetto che alla chiave places abbia l'array di posti)
    headers: { "Content-type": "application/json" }, //informiamo il backend del tipo di dato dei dati che vogliamo caricare
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Fallimento di aggiornamento dati utente");
  }

  return data.message;
}

export async function fetchUserPlaces() {
  // con await aspetto che la richiesta HTTP al backend venga completata (cioè che fetch risponda)
  const response = await fetch("http://localhost:3000/user-places"); //mando la richiesta get '/user-places' al backend sulla porta 3000

  // con await aspetto che il contenuto della risposta venga trasformato in oggetto JavaScript.
  const data = await response.json(); //riconverto la risposta da json al suo tipo di dato originale

  if (!response.ok) {
    throw new Error("Fallimento nel caricamento delle Selezioni utente"); // intercetto manualmente un errore per mandarlo al catch se la response c'é ma non é 'ok'
  }

  return data.places;
}
