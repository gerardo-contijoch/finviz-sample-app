import {useState} from 'react';
import styles from './SymbolFilter.module.css';
import PropTypes from 'prop-types';

/**
 * Input y label usado para filtrar acciones por simbolos.
 * @param {{labelText: string, onChange: (symbol: string) => void}, onEnterKey: (symbol: string) => void} param0
 * @returns
 */
export function SymbolFilter({labelText, onChange, onEnterKey}) {
  const [symbol, setSymbol] = useState('');
  return (
    <div className={styles.filterContainer}>
      <span>{labelText}</span>
      <input
        type='text'
        name='symbol'
        onChange={(e) => {
          setSymbol(e.target.value);
          onChange(e.target.value);
        }}
        value={symbol}
        onKeyDown={(e) => e.key === 'Enter' && onEnterKey(symbol.toLocaleUpperCase())}
      />
    </div>
  );
}

SymbolFilter.propTypes = {
  labelText: PropTypes.string,
  onChange: PropTypes.func,
  onEnterKey: PropTypes.func,
};
