import { useRef, useState, useCallback, useEffect } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import { fetchUserPlaces, updateUserPlaces } from "./http.js";

function App() {
  const selectedPlace = useRef();

  //quando eseguo il fetch dei dati in react tipicamente avró bisogno di 3 state:
  const [userPlaces, setUserPlaces] = useState([]); //state dei dati
  const [isFetching, setIsFetching] = useState(false); //state di caricamento
  const [error, setError] = useState(); // state di errore
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places = await fetchUserPlaces(); //le funzioni async restituiscono una promise

        setUserPlaces(places); //utilizzo i dati per valorizzare lo state
      } catch (error) {
        setError({
          message:
            error.message ||
            "Impossibile caricare le selezioni, riprova più tardi...",
        }); //salvo i dati dell'errore nello state
        //in questo modo potrò riutilizzarli nel componente ErrorPage
      }
      setIsFetching(false);
    }

    fetchPlaces();
  }, []); //utilizzo useEffect in modo tale da non creare un loop infinito andando a rieseguire ogni volta la fetch, che a sua volta settando lo state fará rieseguire la funzione componente

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    } catch (error) {
      setUserPlaces(userPlaces); // se ho un errore riporto lo state al valore precedente
      setErrorUpdatingPlaces({
        message: error.message || "Errore di aggiornamento dati utente",
      });
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      );
      try {
        await updateUserPlaces(
          userPlaces.filter((place) => place.id !== selectedPlace.current.id)
        );
      } catch (error) {
        setUserPlaces(userPlaces);
        setErrorUpdatingPlaces({
          message: error.message || "Fallimento rimozione destinazione",
        });
      }

      setModalIsOpen(false);
    },
    [userPlaces]
  );

  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <ErrorPage
            title="Abbiamo riscontrato un errore"
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />
        )}
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Crea la tua personale collezione di luoghi che vorresti visitare o che
          hai già visitato.
        </p>
      </header>
      <main>
        {error && (
          <ErrorPage
            title="Abbiamo riscontrato un errore"
            message={error.message}
          />
        )}
        {!error && (
          <Places
            title="Mi piacerebbe visitare ..."
            fallbackText="Seleziona le destinazioni che ti piacerebbe visitare qua sotto."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
            loadingText="Sto caricando le Destinazioni..."
            isLoading={isFetching}
          />
        )}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
