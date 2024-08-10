import styles from './StockCard.module.css';

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
 * @param {{symbol:string, price:number, marketCap: number, sharesOut:number, priceEarn:number, roa:number, roi:number, roe:number}} data
 * @returns
 */
export function StockCard({data}) {
  return (
    <div className={styles.card}>
      <span className={styles.symbol}>{data.symbol}</span>
      <ul>
        <li>
          <span className={styles.cardLabel}>Price:</span>
          <span className={styles.cardValue}>${data.price.toFixed(2)}</span>
        </li>
        <li>
          <span className={styles.cardLabel}>Market cap:</span>
          <span className={styles.cardValue}>${formatNumber(data.marketCap)}</span>
        </li>
        <li>
          <span className={styles.cardLabel}>Shares outstanding:</span>
          <span className={styles.cardValue}>${formatNumber(data.sharesOut)}</span>
        </li>
        <li>
          <span className={styles.cardLabel}>Price earnings:</span>
          <span className={styles.cardValue}>${formatNumber(data.priceEarn)}</span>
        </li>
        <li>
          <span className={styles.cardLabel}>ROA:</span>
          <span className={styles.cardValue}>{formatNumber(data.roa / 100)}%</span>
        </li>
        <li>
          <span className={styles.cardLabel}>ROI:</span>
          <span className={styles.cardValue}>{formatNumber(data.roi / 100)}%</span>
        </li>
        <li>
          <span className={styles.cardLabel}>ROE:</span>
          <span className={styles.cardValue}>{formatNumber(data.roe / 100)}%</span>
        </li>
      </ul>
    </div>
  );
}
