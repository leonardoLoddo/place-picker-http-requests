import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./ErrorPage.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  //quando eseguo il fetch dei dati in react tipicamente avró bisogno di 3 state:
  const [isFetching, setIsFetching] = useState(false); //state di caricamento
  const [availablePlaces, setAvailablePlaces] = useState([]); // state dei dati
  const [error, setError] = useState(); // state di errore

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        // con await aspetto che la richiesta HTTP al backend venga completata (cioè che fetch risponda)
        const response = await fetch("http://localhost:3000/places"); //mando la richiesta get '/places' al backend sulla porta 3000

        // con await aspetto che il contenuto della risposta venga trasformato in oggetto JavaScript.
        const data = await response.json(); //riconverto la risposta da json al suo tipo di dato originale

        if (!response.ok) {
          throw new Error("Fallimento nel caricamento delle Destinazioni");
        }

        //ora posso utilizzare i dati in questo contesto
        setAvailablePlaces(data.places); //utilizzo i dati per valorizzare lo state
      } catch (error) {
        setError({
          message:
            error.message ||
            "Impossibile caricare le destinazioni, riprova più tardi...",
        }); //salvo i dati dell'errore nello state
        //in questo modo potrò riutilizzarli nel componente ErrorPage
      }

      setIsFetching(false);
    }

    fetchPlaces();
  }, []); //utilizzo useEffect in modo tale da non creare un loop infinito andando a rieseguire ogni volta la fetch, che a sua volta settando lo state fará rieseguire la funzione componente

  if (error) {
    //se lo state error é valorizzato vuol dire che ho incontrato un errore
    return (
      <ErrorPage
        title="Abbiamo riscontrato un errore"
        message={error.message}
      />
    );
  }
  return (
    <Places
      title="Destinazioni Disponibili"
      places={availablePlaces}
      loadingText="Sto caricando le Destinazioni..."
      isLoading={isFetching}
      fallbackText="Nessuna Destinazioni disponibile."
      onSelectPlace={onSelectPlace}
    />
  );
}
