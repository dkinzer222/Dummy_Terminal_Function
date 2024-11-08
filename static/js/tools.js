class ToolsManager {
    constructor() {
        this.initialized = false;
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
        
        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            this.init();
        });
    }

    async init() {
        try {
            await this.setupElements();
            this.addEventListeners();
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize ToolsManager:', error);
            // Retry initialization after a delay
            if (!this.initialized) {
                setTimeout(() => this.init(), 1000);
            }
        }
    }

    async setupElements() {
        return new Promise((resolve, reject) => {
            this.toolsMenu = document.querySelector('.tools-menu');
            if (!this.toolsMenu) {
                this.toolsMenu = document.createElement('div');
                this.toolsMenu.className = 'tools-menu';
                this.toolsMenu.innerHTML = `
                    <button class="tools-toggle">
                        <i class='bx bx-chevron-down'></i> Tools
                    </button>
                    <div class="tools-grid"></div>
                `;
                const container = document.querySelector('.app-container');
                if (!container) {
                    reject(new Error('App container not found'));
                    return;
                }
                container.insertBefore(this.toolsMenu, container.firstChild);
            }

            this.toolsGrid = this.toolsMenu.querySelector('.tools-grid');
            this.toolsToggle = this.toolsMenu.querySelector('.tools-toggle');

            if (!this.toolsGrid || !this.toolsToggle) {
                reject(new Error('Required tools elements not found'));
                return;
            }

            this.renderTools();
            resolve();
        });
    }

    renderTools() {
        if (!this.toolsGrid || !Array.isArray(this.tools)) {
            throw new Error('Tools grid or tools array not available');
        }

        const toolsHtml = this.tools.map(tool => `
            <div class="tool-card" data-action="${tool.action}" id="${tool.id}">
                <div class="tool-icon"><i class='${tool.icon}'></i></div>
                <div class="tool-name">${tool.name}</div>
                <div class="tool-description">${tool.description}</div>
                <button class="use-tool-btn">Use Tool</button>
            </div>
        `).join('');

        this.toolsGrid.innerHTML = toolsHtml;
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
                icon.classList.toggle('bx-chevron-down');
            }
        });
    }

    executeTool(action) {
        try {
            const terminal = document.querySelector('.terminal');
            const input = terminal?.querySelector('.command-input');
            
            if (!input) {
                console.error('Terminal input not found');
                return;
            }

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

// Initialize tools manager
window.toolsManager = new ToolsManager();