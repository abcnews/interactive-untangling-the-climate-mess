import React from 'react';
import renderer from 'react-test-renderer';

import DelayedHeader from '.';

describe('DelayedHeader', () => {
  test('It renders', () => {
    const component = renderer.create(<DelayedHeader />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
