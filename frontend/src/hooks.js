import {useQuery, useQueryClient, useMutation, keepPreviousData} from '@tanstack/react-query';

const host = import.meta.env.VITE_API_HOST || 'localhost';
const port = import.meta.env.VITE_API_PORT || 8090;
const baseUrl = `http://${host}:${port}`;

function _getQueryStockDataUrl(symbol, nombre) {
  let url = baseUrl + '/api/data';

  if (symbol && symbol.length > 0) {
    url += `?symbol=${symbol}`;
    if (nombre && nombre.length > 0) url += `&name=${nombre}`;
  } else {
    if (nombre && nombre.length > 0) url += `?name=${nombre}`;
  }
  return url;
}

export function useQueryStockData({symbol, nombre}) {
  const queryClient = useQueryClient();

  const {data, isLoading} = useQuery({
    queryKey: ['query-data', symbol, nombre],
    queryFn: async () => {
      //console.log('querying data...', symbol, nombre);
      const url = _getQueryStockDataUrl(symbol, nombre);
      return await fetch(url).then((res) => res.json());
    },
    placeholderData: keepPreviousData,
  });

  async function invalidateQuery() {
    await queryClient.invalidateQueries({queryKey: ['query-data', symbol, nombre]});
  }

  return [data, isLoading, invalidateQuery];
}

export function useClearDb(onDataCleared) {
  const mutation = useMutation({
    mutationFn: async () => {
      let url = baseUrl + '/api/data/clear';

      console.log('Vaciando db...');
      await fetch(url, {
        method: 'POST',
      }).then(async (res) => {
        if (res.status == 200) {
          if (onDataCleared) await onDataCleared();
        } else {
          throw new Error('Error querying data. Http status: ' + res.status);
        }
      });
    },
  });

  return [mutation];
}
