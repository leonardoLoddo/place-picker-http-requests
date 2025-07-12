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
