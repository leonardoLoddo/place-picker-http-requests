import Places from "./Places.jsx";
import ErrorPage from "./ErrorPage.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";
import { useFetch } from "../hooks/useFetch.js";

async function fetchSortedPlaces() {
  const places = await fetchAvailablePlaces();

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      // richiedo la posizione al mio utente e riordino le destinazioni in base alla distanza
      const sortedPlaces = sortPlacesByDistance(
        places,
        position.coords.latitude,
        position.coords.longitude
      );

      resolve(sortedPlaces);
    });
  });
}

export default function AvailablePlaces({ onSelectPlace }) {
  const {
    error,
    isFetching,
    fetchedData: availablePlaces, //nel destructuring di un oggetto posso utilizzare alias
    setFetchedData: setAvailablePlaces,
  } = useFetch(fetchSortedPlaces, []);

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
