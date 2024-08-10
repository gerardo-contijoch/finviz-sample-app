import styles from './StockCard.module.css';

/**
 * Formatea un numero como precio.
 * @param {number} number
 * @returns
 */
function formatPrice(number) {
  if (Number.isNaN(number)) return 'n/a';

  return `$${formatNumber(number)}`;
}

/**
 * Formatea un numero como porcentaje.
 * @param {number} number
 * @returns
 */
function formatPerc(number) {
  if (Number.isNaN(number)) return 'n/a';

  return `${formatNumber(number)}%`;
}

/**
 * Formatea un numero.
 * @param {number} number
 * @returns
 */
function formatNumber(number) {
  if (Number.isNaN(number)) return 'n/a';

  if (number > 1000000000000) {
    return (number / 1000000000000).toFixed(1) + 'T';
  } else if (number > 1000000000) {
    return (number / 1000000000).toFixed(1) + 'B';
  } else if (number > 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  }

  return new Intl.NumberFormat('en-US').format(number);
}

/**
 *
 * @param {{symbol:string, price:number, marketCap: number, sharesOutsanding:number, priceEarnings:number, ROA:number, ROI:number, ROE:number}} data
 * @returns
 */
export function StockCard({data}) {
  console.log(data);
  return (
    <div className={styles.card}>
      <span className={styles.symbol}>{data.symbol}</span>
      <ul>
        <li>
          <span className={styles.cardLabel}>Price:</span>
          <span className={styles.cardValue}>{formatPrice(data.price)}</span>
        </li>
        <li>
          <span className={styles.cardLabel}>Market cap:</span>
          <span className={styles.cardValue}>{formatPrice(data.marketCap)}</span>
        </li>
        <li>
          <span className={styles.cardLabel}>Shares outstanding:</span>
          <span className={styles.cardValue}>{formatPrice(data.sharesOutsanding)}</span>
        </li>
        <li>
          <span className={styles.cardLabel}>Price earnings:</span>
          <span className={styles.cardValue}>{formatPrice(data.priceEarnings)}</span>
        </li>
        <li>
          <span className={styles.cardLabel}>ROA:</span>
          <span className={styles.cardValue}>{formatPerc(data.ROA / 100)}</span>
        </li>
        <li>
          <span className={styles.cardLabel}>ROI:</span>
          <span className={styles.cardValue}>{formatPerc(data.ROI / 100)}</span>
        </li>
        <li>
          <span className={styles.cardLabel}>ROE:</span>
          <span className={styles.cardValue}>{formatPerc(data.ROE / 100)}</span>
        </li>
      </ul>
    </div>
  );
}
