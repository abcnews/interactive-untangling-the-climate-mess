import React from 'react';
import renderer from 'react-test-renderer';

import UserInputBox from '.';

describe('UserInputBox', () => {
  test('It renders', () => {
    const component = renderer.create(<UserInputBox />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
