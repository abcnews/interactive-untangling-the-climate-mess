import React from 'react';
import renderer from 'react-test-renderer';

import StateMachine from '.';

describe('StateMachine', () => {
  test('It renders', () => {
    const component = renderer.create(<StateMachine />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
