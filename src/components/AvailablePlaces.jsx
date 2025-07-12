import { useState, useEffect } from "react";
import Places from "./Places.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  useEffect(() => {
    async function fetchPlaces() {
      // con await aspetto che la richiesta HTTP al backend venga completata (cioè che fetch risponda)
      const response = await fetch("http://localhost:3000/places"); //mando la richiesta get '/places' al backend sulla porta 3000

      // con await aspetto che il contenuto della risposta venga trasformato in oggetto JavaScript.
      const data = await response.json(); //riconverto la risposta da json al suo tipo di dato originale

      //ora posso utilizzare i dati in questo contesto
      setAvailablePlaces(data.places); //utilizzo i dati per valorizzare lo state
    }

    fetchPlaces();
  }, []); //utilizzo useEffect in modo tale da non creare un loop infinito andando a rieseguire ogni volta la fetch, che a sua volta settando lo state fará rieseguire la funzione componente

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
