(function () {
    const form = document.querySelector('form');
    const textarea = document.querySelector('textarea');
    const responses = document.getElementById('responses');
    const img = <HTMLImageElement>document.getElementById('image');

    function addMe(text: string) {
        addText(text, 'Me');
    }

    function addGPT(url: string) {
        addText(url, 'ChatGPT');

        if (!img) {
            return;
        }

        img.src = url;
        img.classList.remove('hidden');
    }

    function addText(text: string, prefix: string) {
        const el = document.createElement('div');
        el.className = 'response';

        el.textContent = `${prefix}: ${text}`;

        responses?.insertBefore(el, responses.firstChild);
    }

    form?.addEventListener('submit', async (ev) => {
        ev.preventDefault();

        const prompt = textarea?.value;

        if (!prompt) {
            alert('Prompt needed to continue');
            return;
        }

        addMe(prompt);
        textarea.value = '';

        try {
            const res = await fetch('/api/v1/ai', {
                method: 'POST',
                body: JSON.stringify({
                    prompt,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();

            if (res.status !== 200) {
                throw new Error(data.error);
            }

            addGPT(data?.[0]?.url);
        } catch (e) {
            alert(`Error: ${(e as Error).message}`);
        }
    }, false);
})();