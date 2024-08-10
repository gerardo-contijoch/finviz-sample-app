import {useEffect, useState} from 'react';
import './App.css';
import {SymbolFilter} from './components/SymbolFilter';
import {StockCard} from './components/StockCard';

function App() {
  const [symbol, setSymbol] = useState('');

  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const host = import.meta.env.VITE_API_HOST;
      const port = import.meta.env.VITE_API_PORT;
      let url = `http://${host}:${port}/api/data`;

      if (symbol && symbol.length > 0) url += `?symbol=${symbol}`;

      const d = await fetch(url).then((res) => res.json());
      setData(d);
    }

    fetchData();
  }, [symbol]);

  return (
    <>
      <h1>Stock Data Sample App</h1>
      <SymbolFilter onChange={setSymbol} />
      {data.length > 50 && (
        <p className='read-the-docs'>Mostrando solo los primeros 50 resultados</p>
      )}
      <div
        style={{
          marginTop: '2em',
          display: 'flex',
          flexFlow: 'row wrap',
          gap: '10px',
          justifyContent: 'center',
        }}
      >
        {data.slice(0, 50).map((d) => (
          <StockCard key={d.symbol} data={d} />
        ))}
      </div>
    </>
  );
}

export default App;
