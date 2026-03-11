import { Injectable, computed, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'theme';
  private readonly isBrowser = typeof window !== 'undefined';
  private readonly theme = signal<Theme>(this.getInitialTheme());
  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    this.applyTheme(this.theme());

    if (this.isBrowser && !this.hasStoredPreference()) {
      const media = this.getMatchMedia();
      media?.addEventListener?.('change', (event) => {
        const next: Theme = event.matches ? 'dark' : 'light';
        this.theme.set(next);
        this.applyTheme(next);
      });
    }
  }

  toggle(): void {
    const next: Theme = this.isDark() ? 'light' : 'dark';
    this.theme.set(next);
    this.applyTheme(next);
    this.storePreference(next);
  }

  current(): Theme {
    return this.theme();
  }

  private getInitialTheme(): Theme {
    const stored = this.getStoredPreference();
    if (stored === 'dark' || stored === 'light') return stored;

    const prefersDark = this.getMatchMedia()?.matches ?? false;
    return prefersDark ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.dataset['theme'] = theme;
  }

  private hasStoredPreference(): boolean {
    const stored = this.getStoredPreference();
    return stored === 'dark' || stored === 'light';
  }

  private getMatchMedia(): MediaQueryList | null {
    if (!this.isBrowser || typeof window.matchMedia !== 'function') {
      return null;
    }
    return window.matchMedia('(prefers-color-scheme: dark)');
  }

  private getStoredPreference(): string | null {
    if (!this.isBrowser) {
      return null;
    }

    try {
      return window.localStorage.getItem(this.storageKey);
    } catch {
      return null;
    }
  }

  private storePreference(theme: Theme): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      window.localStorage.setItem(this.storageKey, theme);
    } catch {
      // Ignore storage errors (private mode, disabled storage, etc.)
    }
  }
}
