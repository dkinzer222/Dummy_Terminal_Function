class ToolsManager {
    constructor() {
        this.toolsGrid = document.querySelector('.tools-grid');
        this.tools = [
            {
                name: 'IP Lookup',
                icon: 'bx bx-search-alt',
                description: 'Get detailed information about an IP address',
                action: 'lookup'
            },
            {
                name: 'Port Scanner',
                icon: 'bx bx-shield-quarter',
                description: 'Scan for open ports on a target system',
                action: 'scan'
            },
            {
                name: 'DNS Lookup',
                icon: 'bx bx-code-block',
                description: 'Retrieve DNS records for a domain',
                action: 'dns'
            },
            // Additional tools preserved from original
        ];
        
        this.init();
    }

    init() {
        this.renderTools();
        this.addEventListeners();
    }

    renderTools() {
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
        this.toolsGrid.addEventListener('click', (e) => {
            const toolCard = e.target.closest('.tool-card');
            if (!toolCard) return;

            const action = toolCard.dataset.action;
            this.executeTool(action);
        });
    }

    executeTool(action) {
        const terminal = document.querySelector('.terminal-section');
        const input = terminal.querySelector('.command-input');
        
        switch(action) {
            case 'lookup':
                input.value = 'lookup ';
                break;
            case 'scan':
                input.value = 'scan ';
                break;
            case 'dns':
                input.value = 'dns ';
                break;
            // Additional tool actions
        }
        
        input.focus();
    }
}

// Initialize tools when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ToolsManager();
});
