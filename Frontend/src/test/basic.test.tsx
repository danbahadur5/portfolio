import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock component since we're just testing the setup
const SimpleComponent = () => <div>Hello World</div>;

describe('Simple Test', () => {
  it('should render hello world', () => {
    render(<SimpleComponent />);
    expect(screen.getByText(/hello world/i)).toBeDefined();
  });
});
