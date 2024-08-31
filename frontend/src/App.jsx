import {useState} from 'react';
import './App.css';
import {SymbolFilter} from './components/SymbolFilter';
import {NameFilter} from './components/NameFilter';
import {InicializarDb} from './components/InicializarDb';
import Loading from './components/Loading';
import SearchResults from './components/SearchResults';
import {useQueryStockData, useClearDb} from './hooks';

function App() {
  // Estos datos son los valores de los campos de busqueda actualizados
  const [symbol_, setSymbol_] = useState('');
  const [nombre_, setNombre_] = useState('');
  // Estos datos son los valores que se usan para realizar la busqueda cuando se aprieta ENTER
  const [symbol, setSymbol] = useState('');
  const [nombre, setNombre] = useState('');

  const [data, showLoading, invalidateData] = useQueryStockData({symbol, nombre});

  // Si no hay ningun filtro aplicado y no tenemos datos, asumimos que la DB esta vacia
  const dbIsEmpty = data?.length == 0 && !showLoading && symbol.length == 0 && nombre.length == 0;

  const [clearDbMutation] = useClearDb(invalidateData);

  function clearDb() {
    // TODO: Error handling
    clearDbMutation?.mutate();
  }

  return (
    <>
      <h1>Stock Data Sample App</h1>
      {showLoading && <Loading />}
      {!showLoading && (
        <>
          {dbIsEmpty && (
            <InicializarDb
              onDbInitialized={async () => {
                await invalidateData();
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
              <SearchResults data={data} onClearDb={() => clearDb()} />
            </>
          )}
        </>
      )}
    </>
  );
}

export default App;
