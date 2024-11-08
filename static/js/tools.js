class ToolsManager {
    constructor() {
        this.initialized = false;
        this.initializeRetries = 0;
        this.maxRetries = 5;
        this.retryDelay = 1000; // Base delay in ms
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

        // Wait for DOM to be ready before initialization
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initWithRetry());
        } else {
            this.initWithRetry();
        }
    }

    async initWithRetry() {
        try {
            await this.init();
            this.initialized = true;
        } catch (error) {
            console.warn(`Failed to initialize ToolsManager (attempt ${this.initializeRetries + 1}):`, error);
            if (this.initializeRetries < this.maxRetries) {
                this.initializeRetries++;
                setTimeout(() => this.initWithRetry(), this.retryDelay * this.initializeRetries);
            } else {
                console.error('Failed to initialize ToolsManager after maximum retries');
            }
        }
    }

    async init() {
        await this.setupElements();
        if (this.toolsGrid && this.toolsToggle) {
            this.addEventListeners();
        }
    }

    async setupElements() {
        return new Promise((resolve) => {
            const setupTools = () => {
                // Find or create tools menu
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

                this.renderTools();
                resolve();
            };

            try {
                setupTools();
            } catch (error) {
                console.warn('Error setting up tools:', error);
                setTimeout(() => {
                    try {
                        setupTools();
                        resolve();
                    } catch (retryError) {
                        console.error('Failed to setup tools after retry:', retryError);
                    }
                }, 500);
            }
        });
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
        }
    }

    addEventListeners() {
        if (!this.toolsGrid || !this.toolsToggle) return;

        // Tool card click handler
        this.toolsGrid.addEventListener('click', (e) => {
            const toolCard = e.target.closest('.tool-card');
            if (!toolCard) return;

            const action = toolCard.dataset.action;
            if (action) {
                this.executeTool(action);
                this.toolsMenu.classList.remove('expanded');
            }
        });

        // Tools toggle handler
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
