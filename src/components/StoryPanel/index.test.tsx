import React from 'react';
import renderer from 'react-test-renderer';

import StoryPanel from '.';

describe('StoryPanel', () => {
  test('It renders', () => {
    const component = renderer.create(<StoryPanel />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
