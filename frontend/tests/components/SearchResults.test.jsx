import {test, expect, assert, describe} from 'vitest';
import {render, screen} from '@testing-library/react';
import SearchResults from '../../src/components/SearchResults.jsx';

describe('SearchResults', () => {
  test('should not render without data', () => {
    // Act
    const renderResult = render(<SearchResults data={undefined} />);

    // Assert
    expect(renderResult.container.outerHTML).toBe('<div></div>');
  });

  test('should render when data is defined', () => {
    // Arrange
    let data = [];
    for (let i = 0; i < 4; i++) {
      data.push({symbol: 'SYMBOL' + i});
    }

    // Act
    const renderResult = render(<SearchResults data={data} />);

    // Assert
    const notice = renderResult.queryByText('Mostrando sólo los primeros 50 resultados');
    expect(notice).toBeNull();

    let symbol = renderResult.queryByText(data[0].symbol);
    expect(symbol).toBeDefined();
    symbol = renderResult.queryByText(data[1].symbol);
    expect(symbol).toBeDefined();
    symbol = renderResult.queryByText(data[2].symbol);
    expect(symbol).toBeDefined();
    symbol = renderResult.queryByText(data[3].symbol);
    expect(symbol).toBeDefined();
  });

  test('should not render more than 50 items', () => {
    // Arrange
    let data = [];
    for (let i = 0; i < 52; i++) {
      data.push({symbol: 'SYMBOL' + i});
    }

    // Act
    const renderResult = render(<SearchResults data={data} />);

    // Assert
    let symbol = renderResult.queryByText(data[data.length - 1].symbol);
    expect(symbol).toBeNull();
    symbol = renderResult.queryByText(data[data.length - 2].symbol);
    expect(symbol).toBeNull();
    // Este item es el item 50, por lo que se renderiza
    symbol = renderResult.queryByText(data[data.length - 3].symbol);
    expect(symbol).not.toBeNull();
  });

  test('should render notice when data.length > 50', () => {
    // Arrange
    let data = [];
    for (let i = 0; i < 52; i++) {
      data.push({symbol: 'SYMBOL' + i});
    }

    // Act
    const renderResult = render(<SearchResults data={data} />);

    // Assert
    const notice = renderResult.queryByText('Mostrando sólo los primeros 50 resultados');
    expect(notice).not.toBeNull();
  });

  test('should call onClearDb when button is clicked', () => {
    // Arrange
    let data = [];
    for (let i = 0; i < 3; i++) {
      data.push({symbol: 'SYMBOL' + i});
    }

    let onClearDbCalled = false;

    const renderResult = render(
      <SearchResults
        data={data}
        onClearDb={() => {
          onClearDbCalled = true;
        }}
      />
    );
    const button = renderResult.getByText('Vaciar DB');

    // Act
    button.click();

    // Assert
    expect(onClearDbCalled).toBe(true);
  });
});
