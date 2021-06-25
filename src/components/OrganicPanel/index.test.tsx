import React from 'react';
import renderer from 'react-test-renderer';

import OrganicPanel from '.';

describe('OrganicPanel', () => {
  test('It renders', () => {
    const component = renderer.create(<OrganicPanel />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
