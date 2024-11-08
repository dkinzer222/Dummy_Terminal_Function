class ToolsManager {
    constructor() {
        this.init();
    }

    async init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Create tools menu if it doesn't exist
        if (!document.querySelector('.tools-menu')) {
            this.createToolsMenu();
        }

        this.toolsMenu = document.querySelector('.tools-menu');
        this.toolsGrid = document.querySelector('.tools-grid');
        
        if (!this.toolsGrid) {
            console.error('Tools grid not found');
            return;
        }

        this.tools = [
            {
                id: 'port-scanner',
                name: 'Port Scanner',
                icon: 'bx bx-scan',
                description: 'Scan ports on target systems',
                action: 'scan'
            },
            {
                id: 'ip-lookup',
                name: 'IP Lookup',
                icon: 'bx bx-search-alt',
                description: 'Get information about IP addresses',
                action: 'lookup'
            },
            {
                id: 'dns-lookup',
                name: 'DNS Lookup',
                icon: 'bx bx-server',
                description: 'Query DNS records',
                action: 'dns'
            },
            {
                id: 'network-speed',
                name: 'Network Speed Test',
                icon: 'bx bx-broadcast',
                description: 'Test network speed',
                action: 'speedtest'
            },
            {
                id: 'ssl-checker',
                name: 'SSL Checker',
                icon: 'bx bx-lock',
                description: 'Verify SSL certificates',
                action: 'ssl'
            }
        ];

        this.renderTools();
        this.addEventListeners();
        this.addToolsToggle();
    }

    createToolsMenu() {
        const menu = document.createElement('div');
        menu.className = 'tools-menu';
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'tools-toggle';
        toggleBtn.innerHTML = '<i class="bx bx-chevron-down"></i> Tools';
        
        const grid = document.createElement('div');
        grid.className = 'tools-grid';
        
        menu.appendChild(toggleBtn);
        menu.appendChild(grid);
        
        document.querySelector('.app-container').prepend(menu);
    }

    renderTools() {
        if (!this.toolsGrid) return;
        
        this.toolsGrid.innerHTML = this.tools.map(tool => `
            <div class="tool-card" data-action="${tool.action}" id="${tool.id}">
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
            if (!toolCard) return;

            const action = toolCard.dataset.action;
            this.executeTool(action);
            
            // Close tools menu after selection
            this.toolsMenu.classList.remove('expanded');
        });
    }

    addToolsToggle() {
        const toggle = document.querySelector('.tools-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                this.toolsMenu.classList.toggle('expanded');
                toggle.querySelector('i').classList.toggle('bx-chevron-up');
            });
        }
    }

    executeTool(action) {
        const terminal = document.querySelector('.terminal');
        const input = terminal.querySelector('.command-input');
        
        if (!input) return;

        switch(action) {
            case 'scan':
                input.value = 'scan ';
                break;
            case 'lookup':
                input.value = 'lookup ';
                break;
            case 'dns':
                input.value = 'dns ';
                break;
            case 'speedtest':
                input.value = 'speedtest';
                break;
            case 'ssl':
                input.value = 'ssl ';
                break;
        }
        
        input.focus();
        
        // Show terminal if minimized
        terminal.classList.remove('minimized');
    }
}

// Initialize tools manager
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.toolsManager = new ToolsManager();
    });
} else {
    window.toolsManager = new ToolsManager();
}
