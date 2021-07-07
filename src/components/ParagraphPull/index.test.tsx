import React from 'react';
import renderer from 'react-test-renderer';

import ParagraphPull from '.';

describe('ParagraphPull', () => {
  test('It renders', () => {
    const component = renderer.create(<ParagraphPull />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
