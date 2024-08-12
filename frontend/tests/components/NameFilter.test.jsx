import {test, expect, assert, describe} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {NameFilter} from '../../src/components/NameFilter.jsx';

describe('NameFilter', () => {
  test('should render', () => {
    // Arrange
    let onChangeCount = 0;
    let onEnterKeyCount = 0;

    // Act
    render(
      <NameFilter
        labelText='test label'
        onChange={() => onChangeCount++}
        onEnterKey={() => onEnterKeyCount++}
      />
    );

    // Assert
    const label = screen.getByText('test label');
    const input = screen.getByRole('textbox');

    expect(label).toBeDefined();
    expect(input).toHaveValue('');
    assert.equal(onChangeCount, 0);
    assert.equal(onEnterKeyCount, 0);
  });

  test('onChange should be called', async () => {
    // Arrange
    let onChangeCount = 0;
    let onEnterKeyCount = 0;

    render(
      <NameFilter
        labelText='test label'
        onChange={() => onChangeCount++}
        onEnterKey={() => onEnterKeyCount++}
      />
    );

    const user = userEvent.setup();
    const input = screen.getByRole('textbox');

    // Act
    await user.type(input, 'ABC');

    // Assert
    expect(input).toHaveValue('ABC');
    assert.equal(onChangeCount, 3);
    assert.equal(onEnterKeyCount, 0);
  });

  test('onEnterKey should be called', async () => {
    // Arrange
    let onChangeCount = 0;
    let onEnterKeyCount = 0;

    render(
      <NameFilter
        labelText='test label'
        onChange={() => onChangeCount++}
        onEnterKey={() => onEnterKeyCount++}
      />
    );

    const user = userEvent.setup();
    const input = screen.getByRole('textbox');

    // Act
    await user.type(input, 'ABC{Enter}');

    // Assert
    expect(input).toHaveValue('ABC');
    assert.equal(onChangeCount, 3);
    assert.equal(onEnterKeyCount, 1);
  });
});
