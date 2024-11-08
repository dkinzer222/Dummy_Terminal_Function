class ToolsManager {
    constructor() {
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
            },
            {
                id: 'system-command',
                name: 'System Command',
                icon: 'bx bx-terminal',
                description: 'Execute system commands',
                action: 'system'
            }
        ];
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        try {
            // Ensure DOM elements exist before proceeding
            if (!document.querySelector('.tools-menu')) {
                this.createToolsMenu();
            }
            this.initializeElements();
            this.addEventListeners();
        } catch (error) {
            console.error('Error setting up ToolsManager:', error);
        }
    }

    createToolsMenu() {
        const toolsMenu = document.createElement('div');
        toolsMenu.className = 'tools-menu';
        toolsMenu.innerHTML = `
            <button class="tools-toggle">
                <i class='bx bx-chevron-down'></i> Tools
            </button>
            <div class="tools-grid"></div>
        `;
        
        const container = document.querySelector('.app-container');
        if (container) {
            container.insertBefore(toolsMenu, container.firstChild);
        }
    }

    initializeElements() {
        this.toolsMenu = document.querySelector('.tools-menu');
        this.toolsGrid = document.querySelector('.tools-grid');
        this.toolsToggle = document.querySelector('.tools-toggle');

        if (!this.toolsMenu || !this.toolsGrid || !this.toolsToggle) {
            throw new Error('Required tools elements not found');
        }

        this.renderTools();
    }

    renderTools() {
        if (!this.toolsGrid || !Array.isArray(this.tools)) {
            console.error('Tools grid or tools array not available');
            return;
        }

        try {
            const toolsHtml = this.tools.map(tool => `
                <div class="tool-card" data-action="${tool.action}" id="${tool.id}">
                    <div class="tool-icon"><i class='${tool.icon}'></i></div>
                    <div class="tool-name">${tool.name}</div>
                    <div class="tool-description">${tool.description}</div>
                    <button class="use-tool-btn">Use Tool</button>
                </div>
            `).join('');

            this.toolsGrid.innerHTML = toolsHtml;
        } catch (error) {
            console.error('Error rendering tools:', error);
            this.toolsGrid.innerHTML = '<div class="error">Error loading tools</div>';
        }
    }

    addEventListeners() {
        if (!this.toolsGrid || !this.toolsToggle) return;

        this.toolsGrid.addEventListener('click', (e) => {
            const toolCard = e.target.closest('.tool-card');
            if (!toolCard) return;

            const action = toolCard.dataset.action;
            if (action) {
                this.executeTool(action);
                this.toolsMenu.classList.remove('expanded');
            }
        });

        this.toolsToggle.addEventListener('click', () => {
            this.toolsMenu.classList.toggle('expanded');
            const icon = this.toolsToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('bx-chevron-up');
            }
        });
    }

    executeTool(action) {
        try {
            const terminal = document.querySelector('.terminal');
            const input = terminal?.querySelector('.command-input');
            
            if (!input) return;

            const commands = {
                'scan': 'scan ',
                'lookup': 'lookup ',
                'dns': 'dns ',
                'speedtest': 'speedtest',
                'ssl': 'ssl ',
                'system': 'system '
            };

            const command = commands[action];
            if (command) {
                input.value = command;
                input.focus();
                
                if (terminal?.classList.contains('minimized')) {
                    terminal.classList.remove('minimized');
                }
            }
        } catch (error) {
            console.error('Error executing tool:', error);
        }
    }
}

// Initialize tools manager with proper DOM load handling
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const toolsManager = new ToolsManager();
        toolsManager.init();
        window.toolsManager = toolsManager;
    });
} else {
    const toolsManager = new ToolsManager();
    toolsManager.init();
    window.toolsManager = toolsManager;
}