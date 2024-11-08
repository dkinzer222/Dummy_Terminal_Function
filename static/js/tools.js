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
        this.initialized = false;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeWithRetry());
        } else {
            this.initializeWithRetry();
        }
    }

    async initializeWithRetry() {
        while (this.retryCount < this.maxRetries && !this.initialized) {
            try {
                await this.setup();
                this.initialized = true;
                break;
            } catch (error) {
                console.warn(`Attempt ${this.retryCount + 1} failed:`, error);
                this.retryCount++;
                if (this.retryCount < this.maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
                }
            }
        }

        if (!this.initialized) {
            console.error('Failed to initialize ToolsManager after multiple attempts');
        }
    }

    async setup() {
        // Ensure DOM elements exist before proceeding
        if (!document.querySelector('.tools-menu')) {
            await this.createToolsMenu();
        }
        
        await this.initializeElements();
        this.addEventListeners();
    }

    async createToolsMenu() {
        return new Promise((resolve) => {
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
                resolve();
            } else {
                throw new Error('App container not found');
            }
        });
    }

    async initializeElements() {
        return new Promise((resolve, reject) => {
            this.toolsMenu = document.querySelector('.tools-menu');
            this.toolsGrid = document.querySelector('.tools-grid');
            this.toolsToggle = document.querySelector('.tools-toggle');

            if (!this.toolsMenu || !this.toolsGrid || !this.toolsToggle) {
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
            throw error;
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

// Initialize tools manager
const toolsManager = new ToolsManager();
toolsManager.init();
window.toolsManager = toolsManager;
