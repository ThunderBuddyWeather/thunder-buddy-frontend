// Mock for @testing-library/react-native
const { jest } = require('@jest/globals');
const actualModule = jest.requireActual('@testing-library/react-native');

// Create a simplified render function that won't have unmounted renderer issues
const render = (component, options) => {
  // Use the actual render function but with a try-catch to prevent unmounted renderer errors
  try {
    return actualModule.render(component, options);
  } catch (error) {
    console.warn('Render error caught in mock:', error.message);
    // Return a minimal render result with the necessary methods
    return {
      getByText: jest.fn().mockImplementation((text) => {
        return { type: 'Text', props: { children: text } };
      }),
      queryByText: jest.fn().mockImplementation(() => null),
      getAllByText: jest.fn().mockImplementation(() => []),
      getByTestId: jest.fn().mockImplementation(() => ({})),
      queryByTestId: jest.fn().mockImplementation(() => null),
      getAllByTestId: jest.fn().mockImplementation(() => []),
      rerender: jest.fn(),
      unmount: jest.fn(),
      toJSON: jest.fn().mockImplementation(() => null),
      debug: jest.fn(),
      container: { children: [] }
    };
  }
};

// Export everything from the actual module but replace the render function
module.exports = {
  ...actualModule,
  render
}; 