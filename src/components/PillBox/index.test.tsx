import React from 'react';
import renderer from 'react-test-renderer';

import PillBox from '.';

describe('PillBox', () => {
  test('It renders', () => {
    const component = renderer.create(<PillBox />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
