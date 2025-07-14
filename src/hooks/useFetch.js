import { useEffect, useState } from "react";
//le funzioni con il nome che inizia con 'use' vengono trattate come hooks
//di conseguenza posso utilizzare all'interno hooks anche se non si tratta di una component function
export function useFetch(fetchFn, initialValue) {
  const [isFetching, setIsFetching] = useState();
  const [error, setError] = useState();
  const [fetchedData, setFetchedData] = useState(initialValue);

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const data = await fetchFn(); //le funzioni async restituiscono una promise
        setFetchedData(data); //utilizzo i dati per valorizzare lo state
      } catch (error) {
        setError({
          message:
            error.message ||
            "Impossibile caricare i dati, riprova più tardi...",
        }); //salvo i dati dell'errore nello state
        //in questo modo potrò riutilizzarli nel componente ErrorPage
      }
      setIsFetching(false);
    }

    fetchData();
  }, [fetchFn]); //utilizzo useEffect in modo tale da non creare un loop infinito andando a rieseguire ogni volta la fetch, che a sua volta settando lo state fará rieseguire la funzione componente

  return {
    isFetching,
    fetchedData,
    setFetchedData,
    error,
  };
}
