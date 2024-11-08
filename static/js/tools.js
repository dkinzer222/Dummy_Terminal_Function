class Tools {
    constructor() {
        this.tools = [
            {
                name: 'Port Scanner',
                description: 'Scan ports on specified host',
                icon: 'fas fa-search',
                action: 'scan'
            },
            {
                name: 'IP Lookup',
                description: 'Lookup information for IP address',
                icon: 'fas fa-globe',
                action: 'lookup'
            },
            {
                name: 'DNS Lookup',
                description: 'Perform DNS lookup for domain',
                icon: 'fas fa-server',
                action: 'dns'
            }
        ];
        this.init();
    }

    init() {
        this.toolsGrid = document.querySelector('.tools-grid');
        if (this.toolsGrid) {
            this.render();
            this.addEventListeners();
        }
    }

    render() {
        if (!this.toolsGrid) return;
        
        this.toolsGrid.innerHTML = this.tools.map(tool => `
            <div class="tool-card" data-action="${tool.action}">
                <div class="tool-icon"><i class='${tool.icon}'></i></div>
                <div class="tool-name">${tool.name}</div>
                <div class="tool-description">${tool.description}</div>
                <button class="use-tool-btn">Use Tool</button>
            </div>
        `).join('');
    }

    addEventListeners() {
        if (!this.toolsGrid) return;
        
        this.toolsGrid.addEventListener('click', (e) => {
            const toolCard = e.target.closest('.tool-card');
            if (toolCard) {
                const action = toolCard.dataset.action;
                if (action) {
                    this.executeTool(action);
                }
            }
        });
    }

    executeTool(action) {
        const terminal = document.querySelector('.command-input');
        if (terminal) {
            terminal.value = action;
            terminal.focus();
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            terminal.dispatchEvent(event);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Tools();
});
