import '@testing-library/jest-dom';

// Mock Next.js Image to a simple img for tests
jest.mock('next/image', () => {
  const React = require('react');
  return function MockImage(props: any) {
    return React.createElement('img', { ...props });
  };
});
