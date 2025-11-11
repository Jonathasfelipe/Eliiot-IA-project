// app.js - Elliot Dev Lab - COM SISTEMA DE REDE GLOBAL
class ElliotDev {
    constructor() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.debugMode = false;
        this.animationsEnabled = true;
        
        // Bind methods
        this.throttledUpdateProgress = this.throttle(this.updateProgress.bind(this), 16);
        this.throttledToggleButton = this.throttle(this.toggleTopButton.bind(this), 100);
        
        this.init();
    }

    init() {
        console.log('🚀 Elliot Dev Lab - Inicializando...');
        
        this.setupTheme();
        this.setupProgressBar();
        this.setupTopButton();
        this.setupSmoothScroll();
        this.setupDevControls();
        this.setupPerformance();
        this.setupComments();
        
        this.initModules();
        
        console.log('✅ Elliot Dev Lab - Pronto!');
        this.showNotification('Elliot Dev Lab carregado com sucesso!', 'success');
    }

    setupTheme() {
        const themeBtn = document.getElementById('themeBtn');
        if (!themeBtn) {
            console.warn('Botão de tema não encontrado');
            return;
        }

        const currentTheme = localStorage.getItem('theme') || 'dark';

        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            themeBtn.innerHTML = theme === 'light' ? '💡' : '🔦';
            themeBtn.setAttribute('title', theme === 'light' ? 'Modo Claro' : 'Modo Escuro');
            localStorage.setItem('theme', theme);
            
            // Atualizar meta theme-color
            const themeColor = theme === 'light' ? '#f5f2e9' : '#07060a';
            this.updateThemeColor(themeColor);
        };

        themeBtn.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
            
            // Feedback visual
            themeBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                themeBtn.style.transform = 'scale(1)';
            }, 200);
        });

        // Aplicar tema salvo
        applyTheme(currentTheme);

        // Observar preferência do sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    updateThemeColor(color) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.setAttribute('content', color);
    }

    setupProgressBar() {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar) {
            console.warn('Barra de progresso não encontrada');
            return;
        }
        
        window.addEventListener('scroll', this.throttledUpdateProgress);
    }

    updateProgress() {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar) return;
        
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight - winHeight;
        const scrolled = (window.scrollY / docHeight) * 100;
        progressBar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
    }

    setupTopButton() {
        const topBtn = document.getElementById('topBtn');
        if (!topBtn) {
            console.warn('Botão "topo" não encontrado');
            return;
        }

        window.addEventListener('scroll', this.throttledToggleButton);

        topBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Touch feedback
        if (this.isTouchDevice) {
            topBtn.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            topBtn.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        }
    }

    toggleTopButton() {
        const topBtn = document.getElementById('topBtn');
        if (!topBtn) return;

        if (window.pageYOffset > 300) {
            topBtn.classList.add('show');
        } else {
            topBtn.classList.remove('show');
        }
    }

    setupSmoothScroll() {
        const anchors = document.querySelectorAll('a[href^="#"]');
        if (anchors.length === 0) return;

        anchors.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const header = document.querySelector('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupDevControls() {
        // Toggle Animations
        const toggleAnimationsBtn = document.getElementById('toggleAnimations');
        if (toggleAnimationsBtn) {
            toggleAnimationsBtn.addEventListener('click', () => {
                this.animationsEnabled = !this.animationsEnabled;
                document.body.classList.toggle('no-animations', !this.animationsEnabled);
                this.showNotification(`Animações ${this.animationsEnabled ? 'ativadas' : 'desativadas'}`);
            });
        }

        // Toggle Debug
        const toggleDebugBtn = document.getElementById('toggleDebug');
        if (toggleDebugBtn) {
            toggleDebugBtn.addEventListener('click', () => {
                this.debugMode = !this.debugMode;
                document.body.classList.toggle('debug-mode', this.debugMode);
                this.showNotification(`Modo debug ${this.debugMode ? 'ativado' : 'desativado'}`);
            });
        }

        // Export Data
        const exportDataBtn = document.getElementById('exportData');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                this.exportData();
            });
        }

        // Reset All
        const resetAllBtn = document.getElementById('resetAll');
        if (resetAllBtn) {
            resetAllBtn.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja resetar todos os dados? Isso não pode ser desfeito.')) {
                    this.resetAllData();
                }
            });
        }
    }

    setupPerformance() {
        // Throttle resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.updateProgress();
                this.toggleTopButton();
            }, 250);
        });

        // Optimize for mobile
        if (this.isMobile) {
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (reducedMotion) {
                this.disableHeavyAnimations();
            }
        }
    }

    disableHeavyAnimations() {
        document.querySelectorAll('[class*="animation"]').forEach(el => {
            el.style.animation = 'none';
        });
    }

    setupComments() {
        const commentForm = document.getElementById('commentForm');
        if (!commentForm) return;

        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addComment();
        });
    }

    addComment() {
        const form = document.getElementById('commentForm');
        const textarea = form.querySelector('textarea');
        const authorInput = form.querySelector('input[type="text"]');
        
        const content = textarea.value.trim();
        const author = authorInput.value.trim() || 'Anônimo';

        if (!content) {
            this.showNotification('Por favor, escreva uma reflexão antes de enviar.', 'error');
            return;
        }

        const comment = {
            id: Date.now(),
            content: content,
            author: author,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('pt-BR')
        };

        // Salvar no localStorage
        const comments = JSON.parse(localStorage.getItem('elliot-comments') || '[]');
        comments.unshift(comment); // Adicionar no início
        localStorage.setItem('elliot-comments', JSON.stringify(comments));

        // Limpar formulário
        textarea.value = '';
        authorInput.value = '';

        // Atualizar interface
        this.displayComments();
        this.updateStats();
        
        this.showNotification('Reflexão enviada para o Elliot!', 'success');
    }

    displayComments() {
        const container = document.getElementById('commentsContainer');
        if (!container) return;

        const comments = JSON.parse(localStorage.getItem('elliot-comments') || '[]');
        
        if (comments.length === 0) {
            container.innerHTML = '<div class="comments-placeholder"><p>💭 Seja o primeiro a compartilhar uma reflexão...</p></div>';
            return;
        }

        container.innerHTML = comments.map(comment => `
            <div class="comment" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <span class="comment-author">${this.escapeHtml(comment.author)}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <div class="comment-content">
                    ${this.escapeHtml(comment.content)}
                </div>
                <div class="comment-actions">
                    <button onclick="elliotDev.deleteComment(${comment.id})" class="comment-delete">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    deleteComment(commentId) {
        if (!confirm('Tem certeza que deseja excluir esta reflexão?')) return;

        const comments = JSON.parse(localStorage.getItem('elliot-comments') || '[]');
        const filteredComments = comments.filter(comment => comment.id !== commentId);
        localStorage.setItem('elliot-comments', JSON.stringify(filteredComments));
        
        this.displayComments();
        this.updateStats();
        this.showNotification('Reflexão excluída.', 'warning');
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    initModules() {
        // Inicializar módulos
        this.displayComments();
        this.updateStats();
        
        // Inicializar rede global
        this.initNetwork();
        
        // Atualizar progresso do Elliot baseado nos comentários
        this.updateElliotProgress();
    }

    initNetwork() {
        // Inicializar sistema de rede se existir
        if (window.elliotNetwork) {
            window.elliotNetwork.init();
        }
    }

    updateStats() {
        // Atualizar contador de comentários
        const commentsCountEl = document.getElementById('commentsCount');
        if (commentsCountEl) {
            const comments = JSON.parse(localStorage.getItem('elliot-comments') || '[]');
            commentsCountEl.textContent = comments.length;
        }
        
        // Atualizar contador de ideias
        const ideasCountEl = document.getElementById('ideasCount');
        if (ideasCountEl) {
            const ideas = JSON.parse(localStorage.getItem('elliot-ideas') || '[]');
            ideasCountEl.textContent = ideas.length;
        }
    }

    updateElliotProgress() {
        const progressEl = document.getElementById('elliotProgress');
        if (!progressEl) return;

        const comments = JSON.parse(localStorage.getItem('elliot-comments') || '[]');
        const ideas = JSON.parse(localStorage.getItem('elliot-ideas') || '[]');
        
        // Progresso baseado na interação (simulação)
        const interactionScore = comments.length * 2 + ideas.length * 5;
        const progress = Math.min(100, Math.max(5, interactionScore));
        
        progressEl.textContent = `${progress}%`;
    }

    suggestIdea() {
        const idea = prompt('Qual ideia você gostaria de sugerir para o desenvolvimento do Elliot?');
        if (idea && idea.trim()) {
            const ideas = JSON.parse(localStorage.getItem('elliot-ideas') || '[]');
            ideas.push({
                id: Date.now(),
                content: idea.trim(),
                timestamp: new Date().toISOString(),
                status: 'suggested'
            });
            localStorage.setItem('elliot-ideas', JSON.stringify(ideas));
            
            this.updateStats();
            this.updateElliotProgress();
            this.showNotification('Ideia registrada! Obrigado pela contribuição.', 'success');
        }
    }

    feedback() {
        const feedback = prompt('Compartilhe seu feedback sobre o Elliot Dev Lab:');
        if (feedback && feedback.trim()) {
            // Aqui você pode enviar para um backend no futuro
            this.showNotification('Feedback recebido! Muito obrigado.', 'success');
        }
    }

    showNotification(message, type = 'info') {
        // Remover notificações existentes
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        // Adicionar estilos se não existirem
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: var(--panel);
                    color: var(--text);
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    border-left: 4px solid var(--accent);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    z-index: 10000;
                    animation: slideInRight 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    border: 1px solid var(--border);
                    max-width: 400px;
                }
                .notification button {
                    background: none;
                    border: none;
                    color: var(--muted);
                    cursor: pointer;
                    font-size: 1.2rem;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .notification-success {
                    border-left-color: var(--success);
                }
                .notification-error {
                    border-left-color: var(--error);
                }
                .notification-warning {
                    border-left-color: var(--warning);
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Aplicar classe de tipo
        if (type !== 'info') {
            notification.classList.add(`notification-${type}`);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remover após 4 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 4000);
    }

    exportData() {
        const data = {
            comments: JSON.parse(localStorage.getItem('elliot-comments') || '[]'),
            ideas: JSON.parse(localStorage.getItem('elliot-ideas') || '[]'),
            settings: {
                theme: localStorage.getItem('theme'),
                lastVisit: new Date().toISOString(),
                version: '1.0'
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elliot-dev-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Dados exportados com sucesso!', 'success');
    }

    resetAllData() {
        localStorage.removeItem('elliot-comments');
        localStorage.removeItem('elliot-ideas');
        
        this.displayComments();
        this.updateStats();
        this.updateElliotProgress();
        
        this.showNotification('Todos os dados foram resetados!', 'warning');
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Método para limpeza
    destroy() {
        window.removeEventListener('scroll', this.throttledUpdateProgress);
        window.removeEventListener('scroll', this.throttledToggleButton);
    }
}

// SISTEMA DE REDE GLOBAL
class ElliotNetwork {
    constructor() {
        this.projects = this.loadProjects();
    }

    loadProjects() {
        return [
            {
                id: 'main-site',
                name: 'Site Principal Elliot',
                description: 'Versão finalizada em produção',
                url: '../index.html',
                icon: '🏠',
                status: 'live',
                category: 'production'
            },
            {
                id: 'dev-lab',
                name: 'Dev Lab', 
                description: 'Elliot em desenvolvimento ativo',
                url: '#',
                icon: '🔬',
                status: 'dev',
                category: 'development',
                current: true
            },
            {
                id: 'blog',
                name: 'Blog Pessoal',
                description: 'Reflexões e jornada de aprendizado',
                url: '../blog/index.html',
                icon: '📝',
                status: 'live',
                category: 'content'
            },
            {
                id: 'portfolio',
                name: 'Portfólio',
                description: 'Trabalhos profissionais e projetos',
                url: '../portfolio/index.html', 
                icon: '💼',
                status: 'live',
                category: 'professional'
            },
            {
                id: 'experiments',
                name: 'Laboratório',
                description: 'Experimentos e POCs em tempo real',
                url: '../experiments/index.html',
                icon: '🧪',
                status: 'experimental',
                category: 'learning'
            },
            {
                id: 'studies',
                name: 'Projetos de Estudo',
                description: 'Aprendizado contínuo em prática',
                url: '../study-projects/index.html',
                icon: '📚',
                status: 'learning',
                category: 'learning'
            },
            {
                id: 'elliot-ai',
                name: 'Elliot IA',
                description: 'Perfil da inteligência artificial',
                url: '../elliot/index.html',
                icon: '🤖',
                status: 'dev',
                category: 'ai'
            }
        ];
    }

    init() {
        this.renderNetwork();
        this.setupEventListeners();
    }

    renderNetwork() {
        const networkContainer = document.getElementById('globalNetwork');
        if (!networkContainer) return;

        networkContainer.innerHTML = this.generateNetworkHTML();
    }

    generateNetworkHTML() {
        return `
            <div class="network-header">
                <h3>🌐 Rede de Projetos Conectados</h3>
                <p class="network-subtitle">Todos os meus projetos em um ecossistema integrado</p>
            </div>
            
            <div class="project-grid">
                ${this.projects.map(project => this.generateProjectCard(project)).join('')}
            </div>
            
            <div class="network-stats">
                ${this.generateNetworkStats()}
            </div>
        `;
    }

    generateProjectCard(project) {
        const currentClass = project.current ? 'current' : '';
        const target = project.url.startsWith('http') || project.url.includes('../') ? '' : 'target="_blank"';
        
        return `
            <a href="${project.url}" class="project-card ${currentClass}" ${target}>
                <span class="project-icon">${project.icon}</span>
                <div class="project-info">
                    <strong>${project.name}</strong>
                    <span>${project.description}</span>
                </div>
                <span class="project-status ${project.status}">${this.getStatusLabel(project.status)}</span>
            </a>
        `;
    }

    generateNetworkStats() {
        const liveProjects = this.projects.filter(p => p.status === 'live').length;
        const devProjects = this.projects.filter(p => p.status === 'dev').length;
        const totalProjects = this.projects.length;

        return `
            <div class="network-stat">
                <span class="stat-number">${liveProjects}</span>
                <span class="stat-label">Online</span>
            </div>
            <div class="network-stat">
                <span class="stat-number">${devProjects}</span>
                <span class="stat-label">Em Dev</span>
            </div>
            <div class="network-stat">
                <span class="stat-number">${totalProjects}</span>
                <span class="stat-label">Total</span>
            </div>
        `;
    }

    getStatusLabel(status) {
        const labels = {
            'live': '🌐 Online',
            'dev': '🚧 Dev',
            'experimental': '🧪 Exp',
            'learning': '📚 Estudo'
        };
        return labels[status] || status;
    }

    setupEventListeners() {
        // Analytics para tracking de projetos
        document.addEventListener('click', (e) => {
            if (e.target.closest('.project-card')) {
                const projectUrl = e.target.closest('.project-card').href;
                this.trackProjectVisit(projectUrl);
            }
        });
    }

    trackProjectVisit(url) {
        console.log('🌐 Projeto visitado:', url);
        // Futuro: integrar com Google Analytics ou sistema próprio
    }

    showProjectManager() {
        const projectList = this.projects.map(p => 
            `• ${p.icon} ${p.name} (${this.getStatusLabel(p.status)})`
        ).join('\n');
        
        alert(`📊 Gerenciador de Projetos Elliot:\n\n${projectList}\n\nTotal: ${this.projects.length} projetos`);
    }

    addProject(projectData) {
        this.projects.push({
            id: `project-${Date.now()}`,
            ...projectData
        });
        this.renderNetwork();
    }

    removeProject(projectId) {
        this.projects = this.projects.filter(p => p.id !== projectId);
        this.renderNetwork();
    }
}

// Inicializar a aplicação
document.addEventListener('DOMContentLoaded', () => {
    window.elliotDev = new ElliotDev();
    window.elliotNetwork = new ElliotNetwork();
    window.elliotNetwork.init();
});

// CSS para notificações (backup)
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Garantir que os estilos das notificações existam
if (!document.querySelector('#notification-animations')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'notification-animations';
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);
}