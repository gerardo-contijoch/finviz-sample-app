import {useState} from 'react';
import styles from './SymbolFilter.module.css';

/**
 * Input y label usado para filtrar simbolos.
 * @param {{onChange: (symbol: string) => void}} param0
 * @returns
 */
export function SymbolFilter({onChange}) {
  const [symbol, setSymbol] = useState('');

  return (
    <div className={styles.filterContainer}>
      <span>Filtrar por simbolo:</span>
      <input
        type='text'
        onChange={(e) => setSymbol(e.target.value)}
        value={symbol}
        onKeyDown={(e) => e.key === 'Enter' && onChange(symbol)}
      />
    </div>
  );
}
