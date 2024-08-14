import {test, expect, describe, vi, beforeEach, afterEach} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {StockCard} from '../../src/components/StockCard.jsx';

describe('StockCard', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('should render with data', () => {
    // Arrange
    const data = {
      symbol: 'AA',
      marketCap: 7894870000,
      priceEarnings: null,
      sharesOutsanding: 258339999.99999997,
      ROA: -387,
      ROE: -1258,
      ROI: -864,
      price: 30.56,
      name: 'Alcoa Corp',
    };

    // Act
    render(<StockCard data={data} />);

    // Assert
    const symbol = screen.getByText(data.symbol);
    const name = screen.getByText(data.name);

    // No validamos los datos numericos porque estan formateados
    // y el hecho de que estos dos campos esten definidos
    // es suficiente evidencia de que se renderizo todo ok
    expect(symbol).toBeDefined();
    expect(name).toBeDefined();
  });

  test('should not render without data', () => {
    // Act
    render(<StockCard data={undefined} />);

    // Assert
    const symbol = screen.queryByText('Price:');
    expect(symbol).toBeNull();
  });

  test('should open finviz website when clicked', async () => {
    // Arrange

    let urlOpened = '';

    const openSpy = vi.spyOn(window, 'open');
    openSpy.mockImplementation((url) => {
      urlOpened = url;
      return null;
    });

    const data = {
      symbol: 'AA',
      marketCap: 7894870000,
      priceEarnings: null,
      sharesOutsanding: 258339999.99999997,
      ROA: -387,
      ROE: -1258,
      ROI: -864,
      price: 30.56,
      name: 'Alcoa Corp',
    };

    render(<StockCard data={data} />);
    const symbol = screen.getByText(data.symbol);

    // Act
    await userEvent.click(symbol);

    // Assert
    expect(urlOpened).toBe(`https://finviz.com/quote.ashx?t=${data.symbol}`);
  });
});
