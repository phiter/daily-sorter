// @ts-nocheck
export const openPip = async () => {
    const app = document.querySelector('#app')!;
    const pipWindow = await window.documentPictureInPicture.requestWindow({ height: 900, width: 350 });
    app.classList.add('pip');

    // Copy styles
    [...document.styleSheets].forEach((styleSheet) => {
        try {
            const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
            const style = document.createElement('style');
        
            style.textContent = cssRules;
            pipWindow.document.head.appendChild(style);
        } catch (e) {
            const link = document.createElement('link');
        
            link.rel = 'stylesheet';
            link.type = styleSheet.type;
            link.media = styleSheet.media;
            link.href = styleSheet.href;
            pipWindow.document.head.appendChild(link);
        }
    });

    pipWindow.addEventListener("pagehide", (event) => {
        document.body.innerHTML = '';
        const playerContainer = document.querySelector("body");
        const pipPlayer = event.target.querySelector("#app");
        playerContainer.append(pipPlayer);
        app.style.margin = undefined;
        app.classList.remove('pip');
    });

    pipWindow.document.body.append(app);
    document.body.innerHTML = '<span>Document is opened in PIP window</span>';
}

export const isPipEnabled = 'documentPictureInPicture' in window;
