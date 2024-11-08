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
        try {
            // Create tools menu if it doesn't exist
            if (!document.querySelector('.tools-menu')) {
                this.createToolsMenu();
            }

            this.toolsMenu = document.querySelector('.tools-menu');
            this.toolsGrid = document.querySelector('.tools-grid');
            
            if (!this.toolsGrid) {
                console.error('Tools grid not found, creating one');
                this.createToolsGrid();
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
        } catch (error) {
            console.error('Error during ToolsManager setup:', error);
        }
    }

    createToolsGrid() {
        if (this.toolsMenu) {
            const grid = document.createElement('div');
            grid.className = 'tools-grid';
            this.toolsMenu.appendChild(grid);
            this.toolsGrid = grid;
        }
    }

    createToolsMenu() {
        try {
            const menu = document.createElement('div');
            menu.className = 'tools-menu';
            
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'tools-toggle';
            toggleBtn.innerHTML = '<i class="bx bx-chevron-down"></i> Tools';
            
            const grid = document.createElement('div');
            grid.className = 'tools-grid';
            
            menu.appendChild(toggleBtn);
            menu.appendChild(grid);
            
            const container = document.querySelector('.app-container');
            if (container) {
                container.prepend(menu);
            } else {
                document.body.prepend(menu);
            }
        } catch (error) {
            console.error('Error creating tools menu:', error);
        }
    }

    renderTools() {
        try {
            if (!this.toolsGrid || !this.tools) return;
            
            this.toolsGrid.innerHTML = this.tools.map(tool => `
                <div class="tool-card" data-action="${tool.action}" id="${tool.id}">
                    <div class="tool-icon"><i class='${tool.icon}'></i></div>
                    <div class="tool-name">${tool.name}</div>
                    <div class="tool-description">${tool.description}</div>
                    <button class="use-tool-btn">Use Tool</button>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error rendering tools:', error);
        }
    }

    addEventListeners() {
        try {
            if (!this.toolsGrid) return;

            this.toolsGrid.addEventListener('click', (e) => {
                const toolCard = e.target.closest('.tool-card');
                if (!toolCard) return;

                const action = toolCard.dataset.action;
                this.executeTool(action);
                
                // Close tools menu after selection
                if (this.toolsMenu) {
                    this.toolsMenu.classList.remove('expanded');
                }
            });
        } catch (error) {
            console.error('Error adding tool event listeners:', error);
        }
    }

    addToolsToggle() {
        try {
            const toggle = document.querySelector('.tools-toggle');
            if (toggle && this.toolsMenu) {
                toggle.addEventListener('click', () => {
                    this.toolsMenu.classList.toggle('expanded');
                    const icon = toggle.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('bx-chevron-up');
                    }
                });
            }
        } catch (error) {
            console.error('Error adding tools toggle:', error);
        }
    }

    executeTool(action) {
        try {
            const terminal = document.querySelector('.terminal');
            const input = terminal?.querySelector('.command-input');
            
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
            if (terminal) {
                terminal.classList.remove('minimized');
            }
        } catch (error) {
            console.error('Error executing tool:', error);
        }
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
