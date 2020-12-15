import React from 'react';
import renderer from 'react-test-renderer';

import IntersectionTeller from '.';

describe('IntersectionTeller', () => {
  test('It renders', () => {
    const component = renderer.create(<IntersectionTeller />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
