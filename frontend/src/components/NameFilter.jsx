import {useState} from 'react';
import styles from './NameFilter.module.css';
import PropTypes from 'prop-types';

/**
 * Input y label usado para filtrar acciones por nombre.
 * @param {{labelText: string, onChange: (name: string) => void, onEnterKey: (name: string) => void}} param0
 * @returns
 */
export function NameFilter({labelText, onChange, onEnterKey}) {
  const [name, setName] = useState('');
  return (
    <div className={styles.filterContainer}>
      <span>{labelText}</span>
      <input
        type='text'
        name='name'
        onChange={(e) => {
          setName(e.target.value);
          onChange(e.target.value);
        }}
        value={name}
        onKeyDown={(e) => e.key === 'Enter' && onEnterKey(name)}
      />
    </div>
  );
}

NameFilter.propTypes = {
  labelText: PropTypes.string,
  onChange: PropTypes.func,
  onEnterKey: PropTypes.func,
};
