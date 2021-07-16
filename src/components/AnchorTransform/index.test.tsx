import React from 'react';
import renderer from 'react-test-renderer';

import UserCount from '.';

describe('UserCount', () => {
  test('It renders', () => {
    const component = renderer.create(<UserCount />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
