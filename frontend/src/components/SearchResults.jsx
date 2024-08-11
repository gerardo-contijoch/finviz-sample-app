import {StockCard} from './StockCard';

/**
 *
 * @param {{data: []}} param0
 */
export default function SearchResults({data}) {
  return (
    <>
      {data.length > 50 && (
        <p className='read-the-docs'>Mostrando sólo los primeros 50 resultados</p>
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
