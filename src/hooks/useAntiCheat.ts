/**
 * Anti-Cheat & Examination Monitoring Hook
 * Detects tab switching, window blur, clipboard tampering, right-click, and restricted shortcuts.
 * Automatically triggers warnings through EventContext with capture-phase listeners and deduplication.
 */

import { useEffect, useRef } from 'react';
import { useEvent } from '../context/EventContext';

interface UseAntiCheatOptions {
  enabled: boolean;
  roundNumber: 1 | 2;
  onDisqualified?: () => void;
}

export function useAntiCheat({ enabled, onDisqualified }: UseAntiCheatOptions) {
  const { recordWarning, currentParticipant } = useEvent();
  const lastViolationTimeRef = useRef<number>(0);
  const lastViolationTypeRef = useRef<string>('');
  const DEBOUNCE_COOLDOWN_MS = 800; // 500-1000ms debounce window as specified

  // Stable refs for callbacks to prevent unnecessary unmount/remount of listeners
  const recordWarningRef = useRef(recordWarning);
  recordWarningRef.current = recordWarning;
  const onDisqualifiedRef = useRef(onDisqualified);
  onDisqualifiedRef.current = onDisqualified;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    // Only monitor when enabled and participant is authenticated and active
    if (!enabled || !currentParticipant || currentParticipant.isDisqualified) {
      return;
    }

    const triggerViolation = async (type: string, reason: string, details: string) => {
      if (!enabledRef.current) return;
      const now = Date.now();

      // Deduplication check: prevent multiple rapid firings from same single user action
      if (now - lastViolationTimeRef.current < DEBOUNCE_COOLDOWN_MS) {
        return;
      }
      lastViolationTimeRef.current = now;
      lastViolationTypeRef.current = type;

      console.log(`[ANTI-CHEAT] ${type} detected:`, reason);
      console.log('[ANTI-CHEAT] warning RPC called');

      const result = await recordWarningRef.current(reason, details);
      console.log('[ANTI-CHEAT] warning result received:', result);

      if (result.isDisqualified && onDisqualifiedRef.current) {
        onDisqualifiedRef.current();
      }
    };

    // 1. Tab Switching Detection via document.visibilityState
    const handleVisibilityChange = () => {
      console.log('[ANTI-CHEAT] visibilitychange detected, state:', document.visibilityState);
      if (document.visibilityState === 'hidden' || document.hidden) {
        triggerViolation(
          'visibilitychange',
          'Tab switching detected.',
          'Please remain on the examination page.'
        );
      }
    };

    // 2. Window Blur Detection
    const handleWindowBlur = () => {
      // If the page is hidden, visibilitychange handles it
      if (document.visibilityState === 'hidden' || document.hidden) return;
      triggerViolation(
        'window_blur',
        'Tab switching detected.',
        'Please remain on the examination page.'
      );
    };

    // 3. Right-Click Context Menu Prevention
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerViolation(
        'contextmenu',
        'Right-click context menu blocked.',
        'Right-click actions are disabled during the examination.'
      );
    };

    // 4. Clipboard Copy Prevention
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      console.log('[ANTI-CHEAT] copy detected');
      triggerViolation(
        'copy',
        'Copy attempt detected.',
        'Copying content from the examination portal is strictly forbidden.'
      );
    };

    // 5. Clipboard Cut Prevention
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      console.log('[ANTI-CHEAT] cut detected');
      triggerViolation(
        'cut',
        'Cut attempt detected.',
        'Cutting content from the examination portal is prohibited.'
      );
    };

    // 6. Clipboard Paste Prevention
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      console.log('[ANTI-CHEAT] paste detected');
      triggerViolation(
        'paste',
        'Paste attempt detected.',
        'Pasting external content is disabled to maintain examination integrity.'
      );
    };

    // 7. Restricted Keyboard Shortcuts (Ctrl/Cmd + V, C, X, U, S, F12, DevTools)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (isCmdOrCtrl && (key === 'v' || key === 'c' || key === 'x')) {
        e.preventDefault();
        console.log(`[ANTI-CHEAT] shortcut detected: Ctrl/Cmd+${key.toUpperCase()}`);

        const shortcutName =
          key === 'v'
            ? 'Paste attempt detected.'
            : key === 'c'
            ? 'Copy attempt detected.'
            : 'Cut attempt detected.';
        const shortcutDetails =
          key === 'v'
            ? 'Pasting content into the examination portal is strictly prohibited.'
            : key === 'c'
            ? 'Copying content from the examination portal is strictly prohibited.'
            : 'Cutting content from the examination portal is strictly prohibited.';

        triggerViolation(`shortcut_${key}`, shortcutName, shortcutDetails);
      } else if (isCmdOrCtrl && (key === 'u' || key === 's')) {
        e.preventDefault();
        triggerViolation('shortcut_view_source', 'Source inspect shortcut blocked.', 'Viewing source or saving page is disabled.');
      } else if (e.key === 'F12' || (isCmdOrCtrl && e.shiftKey && ['i', 'j', 'c'].includes(key))) {
        e.preventDefault();
        triggerViolation('devtools', 'Developer tools shortcut blocked.', 'Accessing browser developer tools is prohibited.');
      }
    };

    // Use capture: true so child inputs or editors cannot intercept/absorb events
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('cut', handleCut, true);
    document.addEventListener('paste', handlePaste, true);
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('cut', handleCut, true);
      document.removeEventListener('paste', handlePaste, true);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [enabled, currentParticipant?.id, currentParticipant?.isDisqualified]);
}
