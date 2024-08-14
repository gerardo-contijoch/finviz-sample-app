import {assert, describe, expect, test, beforeAll, afterEach, afterAll} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {setupServer} from 'msw/node';
import {http, HttpResponse} from 'msw';
import {InicializarDb} from '../../src/components/InicializarDb';

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

describe('InicializarDb', () => {
  test('should render', () => {
    // Arrange
    let onDbInitializedCount = 0;

    // Act
    render(<InicializarDb onDbInitialized={() => onDbInitializedCount++} />);

    // Assert
    const button = screen.getByRole('button');

    expect(button).toBeDefined();
    assert.equal(onDbInitializedCount, 0);
  });

  test('onDbInitialized should be called when backend returns 200', async () => {
    // Arrange
    let onDbInitializedCount = 0;
    let backendCalled = false;

    render(<InicializarDb onDbInitialized={() => onDbInitializedCount++} />);

    server.use(
      http.post(getBackendUrl('/api/data/initialize'), () => {
        backendCalled = true;
        return new HttpResponse('{}', {status: 200});
      })
    );

    const user = userEvent.setup();
    const button = screen.getByRole('button');

    // Act
    await user.click(button);

    // Assert
    expect(backendCalled).toBe(true);
    expect(onDbInitializedCount).toBe(1);
  });

  test('onDbInitialized should not be called when backend returns error', async () => {
    // Arrange
    let onDbInitializedCount = 0;
    let backendCalled = false;

    render(<InicializarDb onDbInitialized={() => onDbInitializedCount++} />);

    server.use(
      http.post(getBackendUrl('/api/data/initialize'), () => {
        backendCalled = true;
        return new HttpResponse('{}', {status: 500});
      })
    );

    const user = userEvent.setup();
    const button = screen.getByRole('button');

    // Act
    await user.click(button);

    // Assert
    expect(backendCalled).toBe(true);
    expect(onDbInitializedCount).toBe(0);
  });
});
