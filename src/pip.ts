// @ts-nocheck
export let pipWindow: Window | null = null;

export const openPip = async () => {
    const app = document.querySelector('#app')!;
    const pipWin = await window.documentPictureInPicture.requestWindow({ height: 900, width: 350 });
    pipWindow = pipWin;
    app.classList.add('pip');

    // Copy styles
    [...document.styleSheets].forEach((styleSheet) => {
        if (!styleSheet) return;
        try {
            const cssRules = styleSheet.cssRules ? [...styleSheet.cssRules].map((rule) => rule.cssText).join('') : '';
            const style = document.createElement('style');
        
            style.textContent = cssRules;
            pipWin.document.head.appendChild(style);
        } catch (e) {
            const link = document.createElement('link');
        
            link.rel = 'stylesheet';
            link.type = styleSheet.type;
            link.media = styleSheet.media;
            link.href = styleSheet.href;
            pipWin.document.head.appendChild(link);
        }
    });

    pipWin.addEventListener("pagehide", (event) => {
        pipWindow = null;
        document.body.innerHTML = '';
        const playerContainer = document.querySelector("body");
        const pipPlayer = event.target.querySelector("#app");
        playerContainer.append(pipPlayer);
        app.style.margin = undefined;
        app.classList.remove('pip');
    });

    pipWin.document.body.append(app);
    if (document.documentElement.classList.contains('dark')) {
        pipWin.document.documentElement.classList.add('dark');
    }
    document.body.innerHTML = '<span>Document is opened in PIP window</span>';
}

export const isPipEnabled = 'documentPictureInPicture' in window;
