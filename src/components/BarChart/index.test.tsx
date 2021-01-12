import React from 'react';
import renderer from 'react-test-renderer';

import BarChart from '.';

describe('BarChart', () => {
  test('It renders', () => {
    const component = renderer.create(<BarChart />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
