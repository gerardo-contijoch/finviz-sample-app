import styles from './InicializarDb.module.css';
import PropTypes from 'prop-types';

/**
 *
 * @param {{onDbInitialized: () => void}} param0
 * @returns
 */
export function InicializarDb({onDbInitialized}) {
  async function initializeDb() {
    const host = import.meta.env.VITE_API_HOST || 'localhost';
    const port = import.meta.env.VITE_API_PORT || 8090;
    let url = `http://${host}:${port}/api/data/initialize`;

    await fetch(url, {
      method: 'POST',
    }).then(async (res) => {
      //console.log('initialize result:', await res.json());
      if (res.status == 200) {
        onDbInitialized();
      }
    });
  }

  return (
    <div>
      <span style={{display: 'block'}}>
        Parece ser que la base de datos no ha sido inicializada.
      </span>
      <span style={{display: 'block'}}>Haga click en el boton de abajo para inicializarla.</span>
      <button name='button_init_db' className={styles.button} onClick={() => initializeDb()}>
        Inicializar DB
      </button>
    </div>
  );
}

InicializarDb.propTypes = {
  onDbInitialized: PropTypes.func,
};
