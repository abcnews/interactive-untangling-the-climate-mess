import React from 'react';
import renderer from 'react-test-renderer';

import BackgroundTexture from '.';

describe('BackgroundTexture', () => {
  test('It renders', () => {
    const component = renderer.create(<BackgroundTexture />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
