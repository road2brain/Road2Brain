import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PeekRating } from '@/components/reactbits/PeekRating';
import { PulseHeart } from '@/components/reactbits/PulseHeart';
import { PixelSwap } from '@/components/reactbits/PixelSwap';
import { SpecularButton } from '@/components/reactbits/SpecularButton';
import { GridScan } from '@/components/reactbits/GridScan';
import { LogoLoop } from '@/components/reactbits/LogoLoop';
import { GlareHover } from '@/components/reactbits/GlareHover';
import { Stepper, Step } from '@/components/reactbits/Stepper';

describe('React Bits Feature Suite Tests', () => {
  it('1. PeekRating renders stars, shows labels and handles rating changes', () => {
    const handleRating = vi.fn();
    render(
      <PeekRating
        defaultValue={3}
        count={5}
        labels={['Poor', 'Fair', 'Good', 'Great', 'Superb']}
        onChange={handleRating}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(5);

    // Click 4th star ('Great')
    fireEvent.click(buttons[3]);
    expect(handleRating).toHaveBeenCalledWith(4);
  });

  it('2. PulseHeart toggles like state and fires callback', () => {
    const handleLike = vi.fn();
    render(
      <PulseHeart
        count={50}
        defaultLiked={false}
        onChange={handleLike}
      />
    );

    const likeButton = screen.getByRole('button', { name: /like opportunity/i });
    expect(likeButton).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();

    fireEvent.click(likeButton);
    expect(handleLike).toHaveBeenCalledWith(true, 51);
  });

  it('3. PixelSwap swaps content upon user trigger', async () => {
    render(
      <PixelSwap
        firstContent={<div>Prompt State</div>}
        secondContent={<div>Unlocked State</div>}
        trigger="click"
      />
    );

    expect(screen.getByText('Prompt State')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Prompt State'));

    await waitFor(() => {
      expect(screen.getByText('Unlocked State')).toBeInTheDocument();
    });
  });

  it('4. SpecularButton renders content and responds to click', () => {
    const handleClick = vi.fn();
    render(
      <SpecularButton onClick={handleClick}>
        Get Started Today
      </SpecularButton>
    );

    const btn = screen.getByRole('button', { name: /get started today/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('5. GridScan renders radar grid surface', () => {
    const { container } = render(
      <div style={{ position: 'relative', width: 300, height: 200 }}>
        <GridScan linesColor="#4d4757" scanColor="#7dd3fc" />
      </div>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('6. LogoLoop renders partner logo marquee', () => {
    const logos = [
      { title: 'Google', href: 'https://google.com' },
      { title: 'Apple', href: 'https://apple.com' },
    ];
    render(<LogoLoop logos={logos} ariaLabel="Tech partners" />);
    expect(screen.getByRole('region', { name: /tech partners/i })).toBeInTheDocument();
  });

  it('7. GlareHover renders wrapped content', () => {
    render(
      <GlareHover>
        <span>Glare Card Highlight</span>
      </GlareHover>
    );
    expect(screen.getByText('Glare Card Highlight')).toBeInTheDocument();
  });

  it('8. Stepper navigates through platform walkthrough steps', async () => {
    const handleComplete = vi.fn();
    render(
      <Stepper onFinalStepCompleted={handleComplete}>
        <Step title="Step One">
          <p>Welcome to step 1</p>
        </Step>
        <Step title="Step Two">
          <p>This is step 2</p>
        </Step>
      </Stepper>
    );

    expect(screen.getByText('Welcome to step 1')).toBeInTheDocument();
    const nextBtn = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(screen.getByText('This is step 2')).toBeInTheDocument();
    });

    const finishBtn = screen.getByRole('button', { name: /finish tour/i });
    fireEvent.click(finishBtn);
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });
});
