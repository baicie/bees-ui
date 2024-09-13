import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { Counter } from '../src/index';

const user = userEvent.setup();

test('increments value', async () => {
  const { getByRole } = render(() => <Counter />);
  const counter = getByRole('button');
  expect(counter).toHaveTextContent('1');
  await user.click(counter);
  expect(counter).toHaveTextContent('2');
});
