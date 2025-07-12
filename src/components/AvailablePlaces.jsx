import { useState, useEffect } from "react";
import Places from "./Places.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/places") //mando la richiesta get '/places' al backend sulla porta 3000
      .then((response) => response.json()) //riconverto la risposta da json al suo tipo di dato originale
      .then((data) => {
        //ora posso utilizzare i dati in questo contesto
        setAvailablePlaces(data.places); //utilizzo i dati per valorizzare lo state
      });
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
