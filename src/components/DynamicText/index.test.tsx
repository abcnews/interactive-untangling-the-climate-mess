import React from 'react';
import renderer from 'react-test-renderer';

import DynamicText from '.';

describe('DynamicText', () => {
  test('It renders', () => {
    const component = renderer.create(<DynamicText />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
