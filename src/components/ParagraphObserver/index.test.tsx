import React from 'react';
import renderer from 'react-test-renderer';

import ParagraphObserver from '.';

describe('ParagraphObserver', () => {
  test('It renders', () => {
    const component = renderer.create(<ParagraphObserver />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
