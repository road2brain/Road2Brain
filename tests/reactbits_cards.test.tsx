import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { TiltedCard } from '@/components/reactbits/TiltedCard';
import { Card } from '@/components/common/Card';

describe('React Bits Card Suite Tests', () => {
  it('1. SpotlightCard renders children and handles mouse events', () => {
    const { container } = render(
      <SpotlightCard spotlightColor="rgba(37, 99, 235, 0.15)" borderColor="rgba(37, 99, 235, 0.4)">
        <span>Spotlight Content</span>
      </SpotlightCard>
    );

    expect(screen.getByText('Spotlight Content')).toBeInTheDocument();

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toBeInTheDocument();

    // Trigger mouse enter and mouse move
    fireEvent.mouseEnter(cardElement);
    fireEvent.mouseMove(cardElement, { clientX: 120, clientY: 80 });
    fireEvent.mouseLeave(cardElement);
  });

  it('2. TiltedCard renders children and handles 3D perspective interactions', () => {
    const { container } = render(
      <TiltedCard maxTilt={8} scale={1.02} spotlightColor="rgba(20, 184, 166, 0.15)">
        <span>Tilted Content</span>
      </TiltedCard>
    );

    expect(screen.getByText('Tilted Content')).toBeInTheDocument();

    const perspectiveWrapper = container.firstChild as HTMLElement;
    expect(perspectiveWrapper).toHaveStyle({ perspective: '1000px' });

    const innerCard = perspectiveWrapper.firstChild as HTMLElement;
    fireEvent.mouseEnter(innerCard);
    fireEvent.mouseMove(innerCard, { clientX: 150, clientY: 100 });
    fireEvent.mouseLeave(innerCard);
  });

  it('3. Common Card delegates to SpotlightCard or TiltedCard based on props', () => {
    const { rerender } = render(
      <Card spotlight spotlightColor="rgba(37, 99, 235, 0.1)">
        <span>Spotlight Delegated</span>
      </Card>
    );
    expect(screen.getByText('Spotlight Delegated')).toBeInTheDocument();

    rerender(
      <Card tilt maxTilt={6}>
        <span>Tilt Delegated</span>
      </Card>
    );
    expect(screen.getByText('Tilt Delegated')).toBeInTheDocument();

    rerender(
      <Card>
        <span>Standard Card</span>
      </Card>
    );
    expect(screen.getByText('Standard Card')).toBeInTheDocument();
  });
});
