import {useEffect, useState} from 'react';
import './App.css';
import {SymbolFilter} from './components/SymbolFilter';

import {InicializarDb} from './components/InicializarDb';
import Loading from './components/Loading';
import SearchResults from './components/SearchResults';

function App() {
  const [showLoading, setShowLoading] = useState(true);
  const [shouldRefreshData, setShouldRefreshData] = useState(true);
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState([]);

  // Si no hay ningun filtro aplicado y no tenemos datos, asumimos que la DB esta vacia
  const dbIsEmpty = !shouldRefreshData && data.length == 0 && symbol.length == 0;

  // console.log(
  //   'App showLoading:',
  //   showLoading,
  //   'symbol:',
  //   `'${symbol}'`,
  //   'data.len:',
  //   data.length,
  //   'dbIsEmpty:',
  //   dbIsEmpty,
  //   'shouldRefreshData:',
  //   shouldRefreshData
  // );

  async function fetchData() {
    const host = import.meta.env.VITE_API_HOST || 'localhost';
    const port = import.meta.env.VITE_API_PORT || 8090;
    let url = `http://${host}:${port}/api/data`;

    if (symbol && symbol.length > 0) url += `?symbol=${symbol}`;

    const d = await fetch(url).then((res) => res.json());
    setData(d);
  }

  // Carga de datos inicial
  useEffect(() => {
    fetchData().then(() => {
      setShowLoading(false);
      setShouldRefreshData(false);
    });
  }, []);

  useEffect(() => {
    // Al cargarse la pagina ya vamos a cargar los datos
    if (showLoading) return;
    if (!shouldRefreshData) return;

    fetchData();
  }, [shouldRefreshData]);

  useEffect(() => {
    // Al cargarse la pagina ya vamos a cargar los datos
    if (showLoading) return;

    fetchData();
  }, [symbol]);

  return (
    <>
      <h1>Stock Data Sample App</h1>
      {showLoading && <Loading />}
      {!showLoading && (
        <>
          {dbIsEmpty && (
            <InicializarDb
              onDbInitialized={() => {
                setShouldRefreshData(true);
              }}
            />
          )}
          {!dbIsEmpty && (
            <>
              <SymbolFilter onChange={setSymbol} />
              <SearchResults data={data} />
            </>
          )}
        </>
      )}
    </>
  );
}

export default App;
