(() => {
        let theme;
        try { theme = localStorage.getItem('edrian-portfolio-theme'); } catch {}
        if (theme !== 'light' && theme !== 'dark') theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
      })();

 document.addEventListener('DOMContentLoaded', () => { document.getElementById('print-resume')?.addEventListener('click', () => window.print()); });
