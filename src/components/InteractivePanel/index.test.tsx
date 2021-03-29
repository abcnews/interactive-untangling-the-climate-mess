import React from 'react';
import renderer from 'react-test-renderer';

import InteractivePanel from '.';

describe('InteractivePanel', () => {
  test('It renders', () => {
    const component = renderer.create(<InteractivePanel />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
