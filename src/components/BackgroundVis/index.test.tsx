import React from 'react';
import renderer from 'react-test-renderer';

import BackgroundVis from '.';

describe('BackgroundVis', () => {
  test('It renders', () => {
    const component = renderer.create(<BackgroundVis />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
