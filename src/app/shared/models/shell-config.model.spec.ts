import type { ShellConfig } from './shell-config.model';

describe('ShellConfig (modèle)', () => {
  it('devrait accepter une configuration de shell complète', () => {
    const config: ShellConfig = {
      showSidebar: true,
      showToc: true,
      sidebarWidth: '280px',
      tocWidth: '220px',
    };
    expect(config.showSidebar).toBeTrue();
    expect(config.showToc).toBeTrue();
    expect(config.sidebarWidth).toBe('280px');
    expect(config.tocWidth).toBe('220px');
  });

  it('devrait accepter une configuration sans sidebar ni toc', () => {
    const config: ShellConfig = {
      showSidebar: false,
      showToc: false,
      sidebarWidth: '280px',
      tocWidth: '220px',
    };
    expect(config.showSidebar).toBeFalse();
    expect(config.showToc).toBeFalse();
  });

  it('devrait supporter des largeurs CSS arbitraires', () => {
    const config: ShellConfig = {
      showSidebar: true,
      showToc: false,
      sidebarWidth: '320px',
      tocWidth: '0px',
    };
    expect(config.sidebarWidth).toBe('320px');
    expect(config.tocWidth).toBe('0px');
  });
});
