import {test, describe, beforeAll, afterEach, afterAll, expect} from 'vitest';
import {render, screen, waitFor, waitForElementToBeRemoved} from '@testing-library/react';
import {setupServer} from 'msw/node';
import {http, HttpResponse} from 'msw';
import App from '../src/App';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

/**
 * Devuelve la url de un endpoint del backend.
 * @param {*} path
 * @returns
 */
function getBackendUrl(path) {
  const host = import.meta.env.VITE_API_HOST || 'localhost';
  const port = import.meta.env.VITE_API_PORT || 8090;
  return `http://${host}:${port}${path}`;
}

describe('SymbolFilter', () => {
  test('should render', () => {
    // Arrange
    server.use(
      http.get(getBackendUrl('/api/data'), () => {
        return new Promise((resolve, reject) => {});
      })
    );

    // Act
    render(<App />);

    // Assert
    const h1 = screen.queryByText('Stock Data Sample App');
    expect(h1).toBeInTheDocument();
  });

  test('should render loading status on first render', () => {
    // Arrange
    server.use(
      http.get(getBackendUrl('/api/data'), async () => {
        return new Promise((resolve, reject) => {
          //resolve(new HttpResponse('{}', {status: 200}));
        });
      })
    );

    // Act
    render(<App />);

    // Assert
    const loading = screen.queryByText('Cargando datos...');
    expect(loading).toBeInTheDocument();
  });

  test('should remove loading status when data is loaded', async () => {
    // Arrange
    let resolve; // = () => {};
    let queryFunc = new Promise((res) => {
      resolve = res;
    });

    server.use(
      http.get(getBackendUrl('/api/data'), () => {
        return queryFunc;
      })
    );

    render(<App />);

    // Act - Simulamos la respuesta del server
    resolve(new HttpResponse('[]', {status: 200}));

    // Assert
    await waitForElementToBeRemoved(screen.queryByText('Cargando datos...'));
  });
});
