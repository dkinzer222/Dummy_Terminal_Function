class ToolsManager {
    constructor() {
        this.initialized = false;
        this.initializeRetries = 0;
        this.maxRetries = 5;
        this.retryDelay = 1000;
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

        // Start initialization when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.initWithRetry(), 100);
            });
        } else {
            setTimeout(() => this.initWithRetry(), 100);
        }
    }

    async initWithRetry() {
        if (this.initialized) return;

        try {
            await this.init();
            this.initialized = true;
            console.log('ToolsManager initialized successfully');
        } catch (error) {
            console.warn(`Failed to initialize ToolsManager (attempt ${this.initializeRetries + 1}):`, error);
            
            if (this.initializeRetries < this.maxRetries) {
                this.initializeRetries++;
                const delay = this.retryDelay * Math.pow(2, this.initializeRetries - 1);
                setTimeout(() => this.initWithRetry(), delay);
            } else {
                console.error('Failed to initialize ToolsManager after maximum retries');
                this.handleInitializationFailure();
            }
        }
    }

    handleInitializationFailure() {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Failed to initialize tools. Please refresh the page.';
        document.body.appendChild(errorMessage);
    }

    async init() {
        try {
            await this.setupElements();
            if (!this.toolsGrid || !this.toolsToggle) {
                throw new Error('Required elements not found');
            }
            await this.addEventListeners();
            await this.renderTools();
        } catch (error) {
            throw new Error(`Initialization failed: ${error.message}`);
        }
    }

    async setupElements() {
        return new Promise((resolve, reject) => {
            try {
                this.toolsMenu = document.querySelector('.tools-menu');
                if (!this.toolsMenu) {
                    const container = document.querySelector('.app-container');
                    if (!container) {
                        throw new Error('App container not found');
                    }

                    this.toolsMenu = document.createElement('div');
                    this.toolsMenu.className = 'tools-menu';
                    this.toolsMenu.innerHTML = `
                        <button class="tools-toggle">
                            <i class='bx bx-chevron-down'></i> Tools
                        </button>
                        <div class="tools-grid"></div>
                    `;
                    container.insertBefore(this.toolsMenu, container.firstChild);
                }

                this.toolsGrid = this.toolsMenu.querySelector('.tools-grid');
                this.toolsToggle = this.toolsMenu.querySelector('.tools-toggle');

                if (!this.toolsGrid || !this.toolsToggle) {
                    throw new Error('Required tools elements not found');
                }

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async renderTools() {
        return new Promise((resolve, reject) => {
            if (!this.toolsGrid || !Array.isArray(this.tools)) {
                reject(new Error('Tools grid or tools array not available'));
                return;
            }

            try {
                requestAnimationFrame(() => {
                    const toolsHtml = this.tools.map(tool => `
                        <div class="tool-card" data-action="${tool.action}" id="${tool.id}">
                            <div class="tool-icon"><i class='${tool.icon}'></i></div>
                            <div class="tool-name">${tool.name}</div>
                            <div class="tool-description">${tool.description}</div>
                            <button class="use-tool-btn">Use Tool</button>
                        </div>
                    `).join('');

                    this.toolsGrid.innerHTML = toolsHtml;
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async addEventListeners() {
        return new Promise((resolve) => {
            if (!this.toolsGrid || !this.toolsToggle) {
                resolve();
                return;
            }

            // Tool card click handler with error boundary
            this.toolsGrid.addEventListener('click', (e) => {
                try {
                    const toolCard = e.target.closest('.tool-card');
                    if (!toolCard) return;

                    const action = toolCard.dataset.action;
                    if (action) {
                        this.executeTool(action);
                        this.toolsMenu.classList.remove('expanded');
                    }
                } catch (error) {
                    console.error('Error handling tool click:', error);
                }
            });

            // Tools toggle handler with error boundary
            this.toolsToggle.addEventListener('click', () => {
                try {
                    this.toolsMenu.classList.toggle('expanded');
                    const icon = this.toolsToggle.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('bx-chevron-up');
                        icon.classList.toggle('bx-chevron-down');
                    }
                } catch (error) {
                    console.error('Error toggling tools menu:', error);
                }
            });

            resolve();
        });
    }

    executeTool(action) {
        try {
            const terminal = window.terminal;
            const input = terminal?.input;
            
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
                
                if (terminal?.terminal?.classList.contains('minimized')) {
                    terminal.terminal.classList.remove('minimized');
                }
            }
        } catch (error) {
            console.error('Error executing tool:', error);
        }
    }
}

// Initialize tools manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.toolsManager = new ToolsManager();
    });
} else {
    window.toolsManager = new ToolsManager();
}
