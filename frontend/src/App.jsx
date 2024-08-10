import {useState} from 'react';
import './App.css';
import {SymbolFilter} from './components/SymbolFilter';
import {StockCard} from './components/StockCard';

function App() {
  const [symbol, setSymbol] = useState('');

  const fakeData = [
    {
      symbol: 'AAPL',
      price: 120.55,
      marketCap: 10000,
      sharesOutsanding: 10000,
      priceEarnings: 10000,
      ROA: 1100,
      ROI: -2050,
      ROE: -1410,
    },
    {
      symbol: 'A',
      marketCap: 39941940000,
      priceEarnings: 32.35,
      sharesOutsanding: 292120000,
      ROA: 1100,
      ROI: -2050,
      ROE: -1410,
      price: 136.9,
    },
    {
      symbol: 'AACI',
      marketCap: 81210000,
      priceEarnings: null,
      sharesOutsanding: 8070000,
      ROA: 1100,
      ROI: -2050,
      ROE: -1410,
      price: 11.39,
    },
    {
      symbol: 'BAPL',
      price: 120.55,
      marketCap: 10000,
      sharesOut: 10000,
      priceEarnings: 10000,
      ROA: 1100,
      ROI: -2050,
      ROE: -1410,
    },
    {
      symbol: 'B',
      marketCap: 39941940000,
      priceEarnings: 32.35,
      sharesOutsanding: 292120000,
      ROA: 1100,
      ROI: -2050,
      ROE: -1410,
      price: 136.9,
    },
    {
      symbol: 'ABCI',
      marketCap: 81210000,
      priceEarnings: null,
      sharesOutsanding: 8070000,
      ROA: 1100,
      ROI: -2050,
      ROE: -1410,
      price: 11.39,
    },
    {
      symbol: 'AABL',
      price: 120.55,
      marketCap: 10000,
      sharesOut: 10000,
      priceEarnings: 10000,
      ROA: 1100,
      ROI: -2050,
      ROE: -1410,
    },
    {
      symbol: 'C',
      marketCap: 39941940000,
      priceEarnings: 32.35,
      sharesOutsanding: 292120000,
      ROA: 1100,
      ROI: -2050,
      ROE: -1410,
      price: 136.9,
    },
    {
      symbol: 'IBM',
      marketCap: 176354160000,
      priceEarnings: 21.1,
      sharesOutsanding: 921150000,
      ROA: 1100,
      ROI: -2050,
      ROE: -1410,
      price: 191.45,
    },
  ];

  return (
    <>
      <h1>Stock Data Sample App</h1>
      <SymbolFilter onChange={setSymbol} />
      <div
        style={{
          marginTop: '2em',
          display: 'flex',
          flexFlow: 'row wrap',
          gap: '10px',
          justifyContent: 'center',
        }}
      >
        {fakeData.map((d) => (
          <StockCard data={d} />
        ))}
      </div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
