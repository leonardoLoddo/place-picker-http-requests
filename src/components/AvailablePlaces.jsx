import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./ErrorPage.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  //quando eseguo il fetch dei dati in react tipicamente avró bisogno di 3 state:
  const [isFetching, setIsFetching] = useState(false); //state di caricamento
  const [availablePlaces, setAvailablePlaces] = useState([]); // state dei dati
  const [error, setError] = useState(); // state di errore

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places = await fetchAvailablePlaces(); //le funzioni async restituiscono una promise

        navigator.geolocation.getCurrentPosition((position) => {
          // richiedo la posizione al mio utente e riordino le destinazioni in base alla distanza
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces); //utilizzo i dati per valorizzare lo state
          setIsFetching(false);
        });
      } catch (error) {
        setError({
          message:
            error.message ||
            "Impossibile caricare le destinazioni, riprova più tardi...",
        }); //salvo i dati dell'errore nello state
        //in questo modo potrò riutilizzarli nel componente ErrorPage
        setIsFetching(false);
      }
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
