import {useCallback, useEffect, useState} from 'react';
import './App.css';
import {SymbolFilter} from './components/SymbolFilter';
import {NameFilter} from './components/NameFilter';
import {InicializarDb} from './components/InicializarDb';
import Loading from './components/Loading';
import SearchResults from './components/SearchResults';

function App() {
  const [showLoading, setShowLoading] = useState(true);
  const [shouldRefreshData, setShouldRefreshData] = useState(true);
  const [data, setData] = useState([]);

  // Estos datos son los valores de los campos de busqueda actualizados
  const [symbol_, setSymbol_] = useState('');
  const [nombre_, setNombre_] = useState('');
  // Estos datos son los valores que se usan para realizar la busqueda cuando se aprieta ENTER
  const [symbol, setSymbol] = useState('');
  const [nombre, setNombre] = useState('');

  // Si no hay ningun filtro aplicado y no tenemos datos, asumimos que la DB esta vacia
  const dbIsEmpty =
    !shouldRefreshData && data.length == 0 && symbol.length == 0 && nombre.length == 0;

  const fetchData = useCallback(async () => {
    const host = import.meta.env.VITE_API_HOST || 'localhost';
    const port = import.meta.env.VITE_API_PORT || 8090;
    let url = `http://${host}:${port}/api/data`;

    // TODO: refactorizar esto, es horrible
    if (symbol && symbol.length > 0) {
      url += `?symbol=${symbol}`;
      if (nombre && nombre.length > 0) url += `&name=${nombre}`;
    } else {
      if (nombre && nombre.length > 0) url += `?name=${nombre}`;
    }

    const d = await fetch(url).then((res) => res.json());
    setData(d);
  }, [symbol, nombre]);

  async function clearDb() {
    const host = import.meta.env.VITE_API_HOST || 'localhost';
    const port = import.meta.env.VITE_API_PORT || 8090;
    let url = `http://${host}:${port}/api/data/clear`;

    console.log('Vaciando db...');
    await fetch(url, {
      method: 'POST',
    }).then((res) => {
      if (res.status == 200) {
        setData([]);
      }
    });
  }

  // Carga de datos inicial
  useEffect(() => {
    fetchData().then(() => {
      setShowLoading(false);
      setShouldRefreshData(false);
    });
  }, [fetchData]);

  useEffect(() => {
    // Al cargarse la pagina ya vamos a cargar los datos
    if (showLoading) return;
    if (!shouldRefreshData) return;

    fetchData();
  }, [showLoading, shouldRefreshData, fetchData]);

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
              <SymbolFilter
                labelText='Filtrar por simbolo:'
                onChange={(s) => {
                  setSymbol_(s);
                }}
                onEnterKey={(s) => {
                  setSymbol(s);
                  setNombre(nombre_);
                }}
              />
              <NameFilter
                labelText='Filtrar por nombre:'
                onChange={(n) => {
                  setNombre_(n);
                }}
                onEnterKey={(n) => {
                  setSymbol(symbol_);
                  setNombre(n);
                }}
              />
              <SearchResults data={data} onClearDb={async () => await clearDb()} />
            </>
          )}
        </>
      )}
    </>
  );
}

export default App;
