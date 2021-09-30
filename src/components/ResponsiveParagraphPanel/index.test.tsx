import React from 'react';
import renderer from 'react-test-renderer';

import ResponsiveParagraphPanel from '.';

describe('ResponsiveParagraphPanel', () => {
  test('It renders', () => {
    const component = renderer.create(<ResponsiveParagraphPanel />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
