import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HangulFileOpener } from '../HangulFileOpener';
import { useUIStore } from '@/stores';

const push = vi.fn();
const openFile = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/hooks/useFileOpener', () => ({ useFileOpener: () => ({ openFile }) }));

const strings = { open: 'HWP 파일 열기', opening: '여는 중…', dropHint: '끌어다 놓기' };

function setMobile(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches }) as unknown as typeof window.matchMedia;
}

function choose(file: File) {
  const input = screen.getByLabelText(strings.open, { selector: 'input' });
  fireEvent.change(input, { target: { files: [file] } });
}

describe('HangulFileOpener', () => {
  beforeEach(() => {
    push.mockReset();
    openFile.mockReset();
    useUIStore.getState().setViewMode('editor');
  });

  it('opens the file and goes to the editor, showing both panes on desktop', async () => {
    setMobile(false);
    openFile.mockResolvedValue(true);
    render(<HangulFileOpener locale="ko" t={strings} />);
    choose(new File(['x'], '공고문.hwp'));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/ko'));
    expect(openFile).toHaveBeenCalledTimes(1);
    expect(useUIStore.getState().viewMode).toBe('split');
  });

  it('shows the rendered document on phones', async () => {
    setMobile(true);
    openFile.mockResolvedValue(true);
    render(<HangulFileOpener locale="en" t={strings} />);
    choose(new File(['x'], 'notice.hwpx'));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/en'));
    expect(useUIStore.getState().viewMode).toBe('preview');
  });

  it('stays on the page when the file could not be opened', async () => {
    setMobile(false);
    openFile.mockResolvedValue(false);
    render(<HangulFileOpener locale="ko" t={strings} />);
    choose(new File(['x'], '깨진.hwp'));

    await waitFor(() => expect(openFile).toHaveBeenCalled());
    expect(push).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: strings.open })).not.toBeDisabled();
  });

  it('opens a dropped file', async () => {
    setMobile(false);
    openFile.mockResolvedValue(true);
    render(<HangulFileOpener locale="ko" t={strings} />);
    const zone = screen.getByText(strings.dropHint).parentElement!;
    fireEvent.drop(zone, { dataTransfer: { files: [new File(['x'], '문서.hwp')] } });

    await waitFor(() => expect(push).toHaveBeenCalledWith('/ko'));
  });
});
