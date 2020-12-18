import React from 'react';
import renderer from 'react-test-renderer';

import EndStrings from '.';

describe('EndStrings', () => {
  test('It renders', () => {
    const component = renderer.create(<EndStrings />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
