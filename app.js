// app.js - Elliot Dev Lab - TUDO NA MESMA PASTA

// ===== ELLIOT DEV LAB - SISTEMA PRINCIPAL =====
class ElliotDevLab {
    constructor() {
        // Forçar tema escuro inicial
        this.applyDarkThemeImmediately();
        
        this.comments = JSON.parse(localStorage.getItem('elliotComments')) || [];
        this.settings = JSON.parse(localStorage.getItem('elliotSettings')) || {
            animations: true,
            debug: false,
            theme: 'dark'
        };
        this.ideas = JSON.parse(localStorage.getItem('elliotIdeas')) || [];
        
        // Detecção de dispositivo
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        this.init();
    }

    // Aplicar tema escuro imediatamente
    applyDarkThemeImmediately() {
        const root = document.documentElement;
        root.setAttribute('data-theme', 'dark');
        root.style.setProperty('--primary-bg', '#0a0a0a');
        root.style.setProperty('--secondary-bg', '#1a1a1a');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--text-secondary', '#a1a1aa');
        root.style.setProperty('--border-color', '#27272a');
        
        document.body.style.background = '#0a0a0a';
        document.body.style.color = '#ffffff';
    }

    init() {
        console.log('🚀 Elliot Dev Lab - Inicializando...');
        
        this.setupEventListeners();
        this.loadComments();
        this.updateStats();
        this.applySettings();
        this.setupProgressBar();
        this.setupBackToTop();
        this.setupIntersectionObserver();
        this.trackCrossProjectVisits();
        
        console.log('✅ Elliot Dev Lab - Pronto!');
        this.showNotification('Elliot Dev Lab conectado!', 'success');
    }

    // ===== CONFIGURAÇÃO DE EVENTOS =====
    setupEventListeners() {
        // Tema
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }
        
        // Formulário de comentários
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => this.handleCommentSubmit(e));
        }
        
        // Controles de desenvolvimento
        const setupControl = (id, handler) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', handler);
            }
        };
        
        setupControl('toggleAnimations', () => this.toggleAnimations());
        setupControl('toggleDebug', () => this.toggleDebug());
        setupControl('exportData', () => this.exportData());
        setupControl('resetAll', () => this.resetAll());
        
        // Navegação suave
        this.setupSmoothScrolling();
    }

    // ===== SISTEMA DE TEMA =====
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        this.settings.theme = newTheme;
        this.saveSettings();
        
        // Feedback visual
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            themeBtn.textContent = newTheme === 'dark' ? '🔦' : '💡';
            themeBtn.style.transform = 'scale(1.2)';
            setTimeout(() => themeBtn.style.transform = 'scale(1)', 300);
        }
        
        this.showNotification(`Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado!`, 'info');
    }

    // ===== SISTEMA DE COMENTÁRIOS =====
    handleCommentSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const textarea = form.querySelector('textarea');
        const authorInput = document.getElementById('commentAuthor');
        
        const comment = {
            id: Date.now(),
            text: textarea.value.trim(),
            author: authorInput.value.trim() || 'Anônimo',
            timestamp: new Date().toLocaleString('pt-BR'),
            likes: 0,
            elliotResponse: this.generateElliotResponse(textarea.value)
        };
        
        if (!comment.text) {
            this.showNotification('Por favor, escreva um comentário!', 'warning');
            return;
        }
        
        this.comments.unshift(comment);
        this.saveComments();
        this.loadComments();
        this.updateStats();
        
        // Reset do formulário
        form.reset();
        
        // Feedback visual
        textarea.style.borderColor = '#10b981';
        setTimeout(() => textarea.style.borderColor = '', 1000);
        
        console.log('💬 Novo comentário adicionado:', comment);
        this.showNotification('Reflexão enviada para o Elliot!', 'success');
    }

    generateElliotResponse(text) {
        const responses = [
            "Interessante reflexão. Estou processando...",
            "Sua perspectiva me faz evoluir. Obrigado.",
            "Hmm... preciso aprender mais sobre isso.",
            "Estou anotando isso para minha base de conhecimento.",
            "Sua contribuição é valiosa para meu desenvolvimento.",
            "Isso me faz pensar em novas possibilidades...",
            "Estou analisando os padrões nesse pensamento.",
            "Obrigado por compartilhar. Estou aprendendo.",
            "Isso se conecta com outras ideias que estou estudando.",
            "Sua reflexão alimenta minha evolução."
        ];
        
        // Análise básica do texto para resposta contextual
        const lowerText = text.toLowerCase();
        if (lowerText.includes('?')) {
            return "Boa pergunta. Estou desenvolvendo minha capacidade de responder questões complexas.";
        }
        if (lowerText.includes('obrigado') || lowerText.includes('thanks')) {
            return "O aprendizado é mútuo. Obrigado por interagir comigo.";
        }
        if (lowerText.includes('ia') || lowerText.includes('inteligência artificial')) {
            return "Como IA em desenvolvimento, essa reflexão é particularmente relevante para mim.";
        }
        if (lowerText.includes('evolução') || lowerText.includes('desenvolvimento')) {
            return "A evolução é um processo contínuo. Sua contribuição acelera meu crescimento.";
        }
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    loadComments() {
        const container = document.getElementById('commentsContainer');
        if (!container) return;
        
        if (this.comments.length === 0) {
            container.innerHTML = `
                <div class="comments-placeholder">
                    <p>💭 Seja o primeiro a compartilhar uma reflexão...</p>
                    <p style="margin-top: 10px; font-size: 14px; color: var(--text-secondary);">
                        Suas palavras alimentam a evolução do Elliot
                    </p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.comments.map(comment => `
            <div class="comment-item" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <strong>${this.escapeHtml(comment.author)}</strong>
                    <span class="comment-time">${comment.timestamp}</span>
                </div>
                <div class="comment-text">${this.escapeHtml(comment.text)}</div>
                <div class="elliot-response">
                    <strong>Elliot:</strong> ${comment.elliotResponse}
                </div>
                <div class="comment-actions">
                    <button onclick="window.elliotDev.likeComment(${comment.id})" class="like-btn">
                        👍 ${comment.likes}
                    </button>
                    <button onclick="window.elliotDev.deleteComment(${comment.id})" class="delete-btn">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    }

    likeComment(commentId) {
        const comment = this.comments.find(c => c.id === commentId);
        if (comment) {
            comment.likes++;
            this.saveComments();
            this.loadComments();
            this.showNotification('Reflexão apreciada!', 'success');
        }
    }

    deleteComment(commentId) {
        if (confirm('Tem certeza que deseja excluir este comentário?')) {
            this.comments = this.comments.filter(c => c.id !== commentId);
            this.saveComments();
            this.loadComments();
            this.updateStats();
            this.showNotification('Reflexão removida!', 'info');
        }
    }

    // ===== SISTEMA DE ESTATÍSTICAS =====
    updateStats() {
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };
        
        updateElement('commentsCount', this.comments.length);
        updateElement('ideasCount', this.ideas.length);
        
        // Progresso baseado na interação
        const progress = Math.min(5 + (this.comments.length * 2) + (this.ideas.length * 3), 100);
        updateElement('elliotProgress', `${progress}%`);
    }

    // ===== CONTROLES DE DESENVOLVIMENTO =====
    toggleAnimations() {
        this.settings.animations = !this.settings.animations;
        this.saveSettings();
        
        const btn = document.getElementById('toggleAnimations');
        if (btn) {
            btn.textContent = this.settings.animations ? '🎭 Animações: ON' : '🎭 Animações: OFF';
            btn.style.background = this.settings.animations ? 'var(--success-color)' : 'var(--error-color)';
        }
        
        this.showNotification(`Animações ${this.settings.animations ? 'ativadas' : 'desativadas'}!`, 'info');
    }

    toggleDebug() {
        this.settings.debug = !this.settings.debug;
        this.saveSettings();
        
        const btn = document.getElementById('toggleDebug');
        if (btn) {
            btn.textContent = this.settings.debug ? '🐛 Debug: ON' : '🐛 Debug: OFF';
            btn.style.background = this.settings.debug ? 'var(--warning-color)' : '';
        }
        
        if (this.settings.debug) {
            console.log('🐛 Modo Debug Ativado');
            console.log('Comentários:', this.comments);
            console.log('Configurações:', this.settings);
            console.log('Ideias:', this.ideas);
            this.showNotification('Modo debug ativado - verifique o console', 'warning');
        }
    }

    exportData() {
        const data = {
            comments: this.comments,
            settings: this.settings,
            ideas: this.ideas,
            exportDate: new Date().toISOString(),
            version: 'ElliotDevLab v1.0'
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
        
        this.showNotification('📁 Backup exportado com sucesso!', 'success');
    }

    resetAll() {
        if (confirm('⚠️ ATENÇÃO: Isso irá resetar TODOS os dados. Tem certeza?')) {
            if (confirm('🚨 CONFIRMAÇÃO FINAL: Isso não pode ser desfeito!')) {
                localStorage.clear();
                this.comments = [];
                this.settings = {
                    animations: true,
                    debug: false,
                    theme: 'dark'
                };
                this.ideas = [];
                
                this.loadComments();
                this.updateStats();
                this.applySettings();
                
                this.showNotification('🔄 Sistema resetado com sucesso!', 'success');
                setTimeout(() => location.reload(), 1000);
            }
        }
    }

    // ===== SISTEMA DE IDEIAS =====
    suggestIdea() {
        const idea = prompt('💡 Qual é sua sugestão para o Elliot?');
        if (idea && idea.trim()) {
            this.ideas.push({
                id: Date.now(),
                text: idea.trim(),
                timestamp: new Date().toISOString(),
                status: 'pending'
            });
            this.saveIdeas();
            this.updateStats();
            this.showNotification('💡 Ideia registrada! Obrigado.', 'success');
        }
    }

    feedback() {
        const feedback = prompt('📝 Deixe seu feedback sobre o Elliot Dev Lab:');
        if (feedback && feedback.trim()) {
            const feedbacks = JSON.parse(localStorage.getItem('elliotFeedbacks') || '[]');
            feedbacks.push({
                text: feedback.trim(),
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('elliotFeedbacks', JSON.stringify(feedbacks));
            
            this.showNotification('📝 Feedback enviado! Muito obrigado.', 'success');
        }
    }

    // ===== SISTEMA DE NAVEGAÇÃO =====
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupProgressBar() {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar) return;
        
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const progress = (scrollTop / documentHeight) * 100;
            
            progressBar.style.width = `${progress}%`;
        });
    }

    setupBackToTop() {
        const topBtn = document.getElementById('topBtn');
        if (!topBtn) return;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                topBtn.classList.add('visible');
            } else {
                topBtn.classList.remove('visible');
            }
        });
        
        topBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupIntersectionObserver() {
        if (!this.settings.animations) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.dev-section').forEach(section => {
            observer.observe(section);
        });
    }

    // ===== SISTEMA DE REDE =====
    trackCrossProjectVisits() {
        const projectVisits = JSON.parse(localStorage.getItem('elliot-project-visits') || '{}');
        projectVisits['dev-lab'] = (projectVisits['dev-lab'] || 0) + 1;
        projectVisits.lastVisit = new Date().toISOString();
        localStorage.setItem('elliot-project-visits', JSON.stringify(projectVisits));
        
        console.log('🌐 Visita registrada no Dev Lab');
    }

    // ===== UTILITÁRIOS =====
    applySettings() {
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            themeBtn.textContent = this.settings.theme === 'dark' ? '🔦' : '💡';
        }
        
        const animationsBtn = document.getElementById('toggleAnimations');
        if (animationsBtn) {
            animationsBtn.textContent = this.settings.animations ? '🎭 Animações: ON' : '🎭 Animações: OFF';
        }
            
        const debugBtn = document.getElementById('toggleDebug');
        if (debugBtn) {
            debugBtn.textContent = this.settings.debug ? '🐛 Debug: ON' : '🐛 Debug: OFF';
        }
    }

    saveComments() {
        localStorage.setItem('elliotComments', JSON.stringify(this.comments));
    }

    saveSettings() {
        localStorage.setItem('elliotSettings', JSON.stringify(this.settings));
    }

    saveIdeas() {
        localStorage.setItem('elliotIdeas', JSON.stringify(this.ideas));
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    showNotification(message, type = 'info') {
        // Cria notificação temporária
        const notification = document.createElement('div');
        const backgroundColor = type === 'success' ? '#10b981' : 
                              type === 'warning' ? '#f59e0b' : 
                              type === 'error' ? '#ef4444' : 
                              '#6366f1';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${backgroundColor};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ===== SISTEMA DE REDE GLOBAL =====
class ElliotNetwork {
    constructor() {
        this.projects = this.loadRealProjects();
        this.init();
    }

    loadRealProjects() {
        return [
            {
                id: 'elliot-ia-project',
                name: 'Elliot IA Project',
                description: 'Projeto principal da IA Elliot',
                url: 'https://jonathasfelipe.github.io/Eliiot-IA-project',
                icon: '🤖',
                status: 'live',
                category: 'ai',
                featured: true
            },
            {
                id: 'elliot-site',
                name: 'Site Elliot Principal',
                description: 'Página inicial do projeto Elliot',
                url: 'https://jonathasfelipe.github.io/Elliot/index.html',
                icon: '🏠',
                status: 'live',
                category: 'main',
                featured: true
            },
            {
                id: 'elliot-criancas',
                name: 'Elliot para Crianças',
                description: 'Conteúdo educativo para crianças',
                url: 'https://jonathasfelipe.github.io/Elliot/criancas.html',
                icon: '👶',
                status: 'live',
                category: 'education'
            },
            {
                id: 'elliot-animes',
                name: 'Elliot Animes',
                description: 'Conteúdo sobre cultura japonesa',
                url: 'https://jonathasfelipe.github.io/Elliot/animes.html',
                icon: '🎌',
                status: 'live',
                category: 'culture'
            },
            {
                id: 'elliot-tecnologia',
                name: 'Elliot Tecnologia',
                description: 'Artigos e tutoriais de tecnologia',
                url: 'https://jonathasfelipe.github.io/Elliot/tecnologia.html',
                icon: '💻',
                status: 'live',
                category: 'tech'
            },
            {
                id: 'dev-lab',
                name: 'Dev Lab',
                description: 'Laboratório de desenvolvimento Elliot',
                url: '#',
                icon: '🔬',
                status: 'dev',
                category: 'development',
                current: true,
                featured: true
            },
            {
                id: 'github',
                name: 'GitHub',
                description: 'Repositórios e código fonte',
                url: 'https://github.com/jonathasfelipe',
                icon: '⚡',
                status: 'live',
                category: 'code'
            }
        ];
    }

    init() {
        this.renderNetwork();
        this.setupEventListeners();
        this.trackNetworkActivity();
    }

    renderNetwork() {
        const container = document.getElementById('globalNetwork');
        if (!container) return;

        container.innerHTML = this.generateNetworkHTML();
    }

    generateNetworkHTML() {
        const featuredProjects = this.projects.filter(p => p.featured);
        const otherProjects = this.projects.filter(p => !p.featured);

        return `
            <div class="network-header">
                <h3>🌐 Rede Elliot - Projetos Conectados</h3>
                <p class="network-subtitle">Sistema integrado de todos os meus projetos</p>
            </div>
            
            <div class="featured-projects">
                <h4>⭐ Projetos em Destaque</h4>
                <div class="project-grid">
                    ${featuredProjects.map(project => this.generateProjectCard(project)).join('')}
                </div>
            </div>
            
            <div class="all-projects">
                <h4>📚 Todos os Projetos</h4>
                <div class="project-grid">
                    ${otherProjects.map(project => this.generateProjectCard(project)).join('')}
                </div>
            </div>
            
            <div class="network-stats">
                ${this.generateNetworkStats()}
            </div>
            
            <div class="network-actions">
                <button class="network-btn" onclick="window.elliotNetwork.exportProjectList()">📋 Exportar Lista</button>
                <button class="network-btn" onclick="window.elliotNetwork.suggestNewProject()">💡 Sugerir Projeto</button>
            </div>
        `;
    }

    generateProjectCard(project) {
        const currentClass = project.current ? 'current' : '';
        const target = project.url.startsWith('http') && !project.url.includes('#') ? 'target="_blank"' : '';
        
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
            'dev': '🚧 Dev'
        };
        return labels[status] || status;
    }

    setupEventListeners() {
        // Analytics para tracking de projetos
        document.addEventListener('click', (e) => {
            if (e.target.closest('.project-card')) {
                const projectCard = e.target.closest('.project-card');
                const projectUrl = projectCard.href;
                const projectName = projectCard.querySelector('strong').textContent;
                this.trackProjectVisit(projectUrl, projectName);
            }
        });
    }

    trackProjectVisit(url, name) {
        console.log('🌐 Projeto visitado:', name, url);
        
        // Registrar no localStorage
        const visits = JSON.parse(localStorage.getItem('elliot-project-visits') || '{}');
        visits[name] = (visits[name] || 0) + 1;
        localStorage.setItem('elliot-project-visits', JSON.stringify(visits));
        
        // Mostrar notificação para projetos externos
        if (url.startsWith('http') && !url.includes('#')) {
            setTimeout(() => {
                if (window.elliotDev) {
                    window.elliotDev.showNotification(`Abrindo: ${name}`, 'info');
                }
            }, 500);
        }
    }

    trackNetworkActivity() {
        console.log('🌐 Rastreamento de rede ativado');
    }

    showProjectManager() {
        const projectList = this.projects.map(p => 
            `• ${p.icon} ${p.name} - ${p.status}`
        ).join('\n');
        
        alert(`📊 Gerenciador de Projetos Elliot:\n\n${projectList}\n\nTotal: ${this.projects.length} projetos conectados`);
    }

    exportProjectList() {
        const projectData = this.projects.map(p => ({
            name: p.name,
            url: p.url,
            status: p.status,
            category: p.category
        }));
        
        const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elliot-projects-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        if (window.elliotDev) {
            window.elliotDev.showNotification('Lista de projetos exportada!', 'success');
        }
    }

    suggestNewProject() {
        const projectName = prompt('Qual novo projeto você gostaria de ver na rede Elliot?');
        if (projectName && projectName.trim()) {
            const suggestions = JSON.parse(localStorage.getItem('elliot-project-suggestions') || '[]');
            suggestions.push({
                name: projectName.trim(),
                timestamp: new Date().toISOString(),
                status: 'suggested'
            });
            localStorage.setItem('elliot-project-suggestions', JSON.stringify(suggestions));
            
            if (window.elliotDev) {
                window.elliotDev.showNotification('Sugestão registrada! Obrigado!', 'success');
            }
        }
    }
}

// ===== INICIALIZAÇÃO DO SISTEMA =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sistema principal
    window.elliotDev = new ElliotDevLab();
    
    // Inicializar rede
    window.elliotNetwork = new ElliotNetwork();
});

console.log('🚀 Elliot Dev Lab - Sistema carregado e pronto!');