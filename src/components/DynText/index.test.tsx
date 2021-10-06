import React from 'react';
import renderer from 'react-test-renderer';

import DynText from '.';

describe('DynText', () => {
  test('It renders', () => {
    const component = renderer.create(<DynText />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
