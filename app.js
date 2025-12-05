/**
 * Elliot IA - App Principal (Vanilla JS Modular)
 * Versão 2.2 - Completamente responsiva e integrada
 * Features: Chat com IA, calculadora gemátrica, sidebar mobile, toasts, exportação
 */

class ElliotIA {
    constructor() {
        // Elementos principais
        this.chatContainer = document.getElementById('chatContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.sidebarOverlay = document.querySelector('.sidebar-overlay');
        this.clearChatBtn = document.getElementById('clearChat');
        this.exportChatBtn = document.getElementById('exportChat');
        this.themeToggleBtn = document.getElementById('themeToggle');
        this.toastContainer = document.getElementById('toastContainer');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Elementos da calculadora gemátrica
        this.gematriaInput = document.getElementById('gematriaInput');
        this.calculateGematriaBtn = document.getElementById('calculateGematriaBtn');
        this.gematriaResult = document.getElementById('gematriaResult');
        
        // Elementos de status
        this.dictStatus = document.getElementById('dictStatus');
        this.wordCount = document.getElementById('wordCount');
        this.calcCount = document.getElementById('calcCount');
        this.messageCount = document.getElementById('messageCount');
        
        // Elementos de apoio
        this.pixBtn = document.getElementById('pixBtn');
        this.paypalBtn = document.getElementById('paypalBtn');
        
        // Variáveis de estado
        this.chatHistory = [];
        this.isTyping = false;
        this.dictLoaded = false;
        this.calculationCount = 0;
        this.messageCounter = 0;
        
        // Tema
        this.isDarkMode = true;
        
        this.init();
    }

    init() {
        console.log('🔮 Elliot IA Inicializando...');
        
        // Carrega dicionário
        this.dictionary = window.elliotDict || {};
        this.updateDictStatus('Carregado');
        this.updateWordCount();
        this.dictLoaded = true;
        
        // Event Listeners principais
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.messageInput.addEventListener('input', () => this.autoResizeTextarea());
        this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        this.sidebarOverlay.addEventListener('click', () => this.toggleSidebar());
        this.clearChatBtn.addEventListener('click', () => this.clearChat());
        this.exportChatBtn.addEventListener('click', () => this.exportChat());
        this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        
        // Event Listeners da calculadora
        this.calculateGematriaBtn.addEventListener('click', () => this.calculateGematriaTool());
        this.gematriaInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.calculateGematriaTool();
        });
        
        // Event Listeners de apoio
        this.pixBtn.addEventListener('click', () => this.copyPixKey());
        this.paypalBtn.addEventListener('click', () => this.openPaypal());
        
        // Fechar sidebar mobile clicando fora
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !this.sidebar.contains(e.target) && 
                !this.sidebarToggle.contains(e.target) &&
                this.sidebar.classList.contains('active')) {
                this.toggleSidebar();
            }
        });
        
        // Verificar viewport inicialmente
        this.checkViewport();
        window.addEventListener('resize', () => this.checkViewport());
        
        // Inicializações
        this.autoResizeTextarea();
        this.showWelcome();
        this.updateMessageCount();
        
        console.log('✅ Elliot IA Inicializado com sucesso!');
    }

    // ===== RESPONSIVIDADE =====
    checkViewport() {
        if (window.innerWidth <= 768) {
            this.sidebar.classList.add('mobile');
            this.sidebarToggle.style.display = 'flex';
            this.sidebar.classList.remove('collapsed');
        } else {
            this.sidebar.classList.remove('mobile', 'active');
            this.sidebarOverlay.classList.remove('active');
            this.sidebarToggle.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    toggleSidebar() {
        if (window.innerWidth <= 768) {
            this.sidebar.classList.toggle('active');
            this.sidebarOverlay.classList.toggle('active');
            document.body.style.overflow = this.sidebar.classList.contains('active') ? 'hidden' : '';
        } else {
            this.sidebar.classList.toggle('collapsed');
        }
    }

    // ===== CHAT FUNCTIONS =====
    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 160) + 'px';
        this.sendBtn.disabled = this.messageInput.value.trim() === '';
    }

    handleKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        } else if (e.key === 'Escape') {
            this.messageInput.value = '';
            this.autoResizeTextarea();
        }
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;

        this.addMessage('user', message);
        this.messageInput.value = '';
        this.autoResizeTextarea();
        this.setTyping(true);
        this.updateMessageCount();

        // Simula resposta Elliot com lógica inteligente
        setTimeout(() => {
            const gematriaValue = this.calculateGematria(message);
            const response = this.processQuery(message, gematriaValue);
            this.addMessage('elliot', response);
            this.setTyping(false);
            this.scrollToBottom();
            this.updateCalcCount();
        }, 800 + Math.random() * 1200);
    }

    // ===== GEMATRIA FUNCTIONS =====
    calculateGematria(text) {
        if (!text || typeof text !== 'string') return 0;
        
        // Normaliza acentos e remove não-alfanuméricos
        const normalized = text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
            .toUpperCase()
            .replace(/[^A-ZÀ-Ú\s]/g, '')
            .trim();

        if (!normalized) return 0;

        const values = {
            'A':1, 'B':2, 'C':3, 'D':4, 'E':5, 'F':6, 'G':7, 'H':8, 'I':9, 'J':10,
            'K':20, 'L':30, 'M':40, 'N':50, 'O':60, 'P':70, 'Q':80, 'R':90, 'S':100,
            'T':200, 'U':300, 'V':400, 'W':500, 'X':600, 'Y':700, 'Z':800
        };

        let sum = 0;
        for (let char of normalized) {
            if (char !== ' ') {
                sum += values[char] || 0;
            }
        }
        
        this.calculationCount++;
        return sum;
    }

    calculateGematriaTool() {
        const word = this.gematriaInput.value.trim();
        if (!word) {
            this.gematriaResult.textContent = 'Digite uma palavra...';
            return;
        }

        const gematriaValue = this.calculateGematria(word);
        const dictEntry = this.dictionary[word.toLowerCase()];
        
        let result = `"${word}" = ${gematriaValue} (Gematria Simples)`;
        
        if (dictEntry) {
            result += `\n📖 Significado: ${dictEntry.meaning}`;
            if (dictEntry.gematria) {
                result += `\n🔢 Gematria exata: ${dictEntry.gematria}`;
            }
        } else {
            result += `\n💡 Dica: Esta palavra não está no dicionário.`;
        }
        
        this.gematriaResult.textContent = result;
        this.gematriaInput.value = '';
        this.updateCalcCount();
        this.showToast('Cálculo gemátrico realizado!', 'success');
    }

    processQuery(message, gematria) {
        const lowerMessage = message.toLowerCase();
        const dictEntry = this.dictionary[lowerMessage];
        
        if (dictEntry) {
            return `🔮 **${message.toUpperCase()}**\n\n` +
                   `📊 **Gematria:** ${gematria} ${dictEntry.gematria ? `(Exato: ${dictEntry.gematria})` : ''}\n\n` +
                   `📖 **Significado:** ${dictEntry.meaning}\n\n` +
                   `💡 *Esta palavra tem profundas conotações espirituais e simbólicas.*`;
        }
        
        // Respostas inteligentes baseadas em palavras-chave
        if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('hello')) {
            return `Shalom! ✡️\nEu sou Elliot IA, seu assistente de gematria e simbolismo.\nComo posso ajudá-lo hoje?`;
        }
        
        if (lowerMessage.includes('ajuda') || lowerMessage.includes('help')) {
            return `🆘 **Ajuda - Elliot IA**\n\n` +
                   `Posso ajudá-lo com:\n` +
                   `• Cálculos gemátricos de palavras\n` +
                   `• Análise de simbolismo sagrado\n` +
                   `• Explicações sobre termos hebraicos/gregos\n` +
                   `• Conexões numéricas espirituais\n\n` +
                   `Experimente perguntar sobre: "amor", "luz", "sabedoria" ou qualquer palavra que desejar analisar.`;
        }
        
        if (lowerMessage.includes('gematria') || lowerMessage.includes('calcular')) {
            return `🧮 **Cálculo Gemátrico**\n\n` +
                   `A palavra "${message}" tem gematria **${gematria}**\n\n` +
                   `**Sistemas disponíveis:**\n` +
                   `• Simples Inglês (A=1, B=2... Z=800)\n` +
                   `• Hebraico (א=1, ב=2...)\n` +
                   `• Grego (α=1, β=2...)\n\n` +
                   `*Para análise mais profunda, especifique o sistema desejado.*`;
        }
        
        if (lowerMessage.includes('hebraico') || lowerMessage.includes('hebrew')) {
            return `📜 **Gematria Hebraica**\n\n` +
                   `No sistema hebraico, cada letra tem um valor numérico:\n` +
                   `• Aleph (א) = 1\n` +
                   `• Beth (ב) = 2\n` +
                   `• ... até Tav (ת) = 400\n\n` +
                   `*Palavras hebraicas revelam conexões profundas através da gematria.*`;
        }
        
        // Resposta padrão para qualquer palavra
        return `📊 **Análise Gemátrica**\n\n` +
               `A palavra **"${message}"** possui:\n` +
               `• **Gematria Simples:** ${gematria}\n` +
               `• **Redução:** ${this.reduceNumber(gematria)}\n` +
               `• **Caminho da Vida:** ${this.lifePathNumber(gematria)}\n\n` +
               `🔍 **Interpretação:** ${this.interpretGematria(gematria, message)}\n\n` +
               `*Para análise específica, mencione "hebraico", "grego" ou "redução".*`;
    }

    // ===== UTILITY FUNCTIONS =====
    reduceNumber(num) {
        while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
            num = num.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
        }
        return num;
    }

    lifePathNumber(num) {
        return this.reduceNumber(num);
    }

    interpretGematria(value, word) {
        const interpretations = {
            1: "Início, unidade, origem divina",
            2: "Dualidade, parceria, equilíbrio",
            3: "Criação, expressão, trindade",
            4: "Estabilidade, estrutura, fundamento",
            5: "Mudança, liberdade, aventura",
            6: "Harmonia, família, responsabilidade",
            7: "Espiritualidade, sabedoria, introspecção",
            8: "Abundância, poder, manifestação",
            9: "Completude, humanidade, sabedoria",
            11: "Iluminação, intuição, mestrado espiritual",
            22: "Mestre construtor, realização em grande escala",
            33: "Mestre professor, compaixão elevada"
        };
        
        const reduced = this.reduceNumber(value);
        const baseInterpretation = interpretations[reduced] || interpretations[value] || 
                                  "Número com significado único a ser explorado";
        
        return `O número ${value} (reduzido a ${reduced}) representa ${baseInterpretation.toLowerCase()}.`;
    }

    addMessage(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatarIcon = sender === 'user' ? 'fas fa-user' : 'fas fa-brain';
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="${avatarIcon}"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${this.formatMessage(content)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        this.chatContainer.appendChild(messageDiv);
        this.chatHistory.push({ 
            sender, 
            content, 
            timestamp: Date.now(),
            time: time
        });
        
        this.scrollToBottom();
    }

    formatMessage(text) {
        // Converte **negrito** para <strong>
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Converte *itálico* para <em>
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Converte \n para <br>
        text = text.replace(/\n/g, '<br>');
        // Converte • para lista
        text = text.replace(/•/g, '<br>•');
        
        return text;
    }

    setTyping(typing) {
        this.isTyping = typing;
        this.loadingOverlay.classList.toggle('active', typing);
        this.sendBtn.disabled = typing;
    }

    scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    // ===== UI FUNCTIONS =====
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">${message}</div>
            <button class="toast-close">&times;</button>
        `;
        
        this.toastContainer.appendChild(toast);
        
        // Remove toast específico após 4s
        toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 4000);
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        if (this.isDarkMode) {
            document.documentElement.style.setProperty('--bg-primary', '#0A0A0F');
            document.documentElement.style.setProperty('--bg-secondary', '#151520');
            document.documentElement.style.setProperty('--text-primary', '#FFFFFF');
            this.themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            this.showToast('Tema escuro ativado', 'info');
        } else {
            document.documentElement.style.setProperty('--bg-primary', '#F5F5F7');
            document.documentElement.style.setProperty('--bg-secondary', '#FFFFFF');
            document.documentElement.style.setProperty('--text-primary', '#333333');
            this.themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            this.showToast('Tema claro ativado', 'info');
        }
    }

    // ===== DATA MANAGEMENT =====
    clearChat() {
        if (this.chatHistory.length === 0) {
            this.showToast('O chat já está vazio', 'info');
            return;
        }
        
        if (confirm('Tem certeza que deseja limpar todo o histórico de conversa?')) {
            // Remove todas as mensagens exceto a de boas-vindas
            const messages = this.chatContainer.querySelectorAll('.message');
            messages.forEach(msg => {
                if (!msg.closest('.welcome-message')) {
                    msg.remove();
                }
            });
            
            this.chatHistory = this.chatHistory.filter(msg => msg.sender === 'elliot' && 
                msg.content.includes('Olá! Eu sou o Elliot IA'));
            this.messageCounter = 0;
            this.updateMessageCount();
            this.showToast('Chat limpo com sucesso!', 'success');
            
            // Fechar sidebar no mobile
            if (window.innerWidth <= 768) {
                this.toggleSidebar();
            }
        }
    }

    exportChat() {
        if (this.chatHistory.length === 0) {
            this.showToast('Nenhuma conversa para exportar', 'warning');
            return;
        }
        
        const text = this.chatHistory.map(msg => {
            const sender = msg.sender === 'user' ? '👤 Você' : '🤖 Elliot IA';
            return `${sender} [${msg.time}]:\n${msg.content}\n${'-'.repeat(50)}\n`;
        }).join('\n');
        
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elliot-chat-${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Conversa exportada com sucesso!', 'success');
    }

    // ===== STATUS UPDATES =====
    updateDictStatus(status) {
        this.dictStatus.textContent = status;
        this.dictStatus.style.color = status === 'Carregado' ? 'var(--success-color)' : 'var(--text-primary)';
    }

    updateWordCount() {
        this.wordCount.textContent = Object.keys(this.dictionary).length;
    }

    updateCalcCount() {
        this.calcCount.textContent = this.calculationCount;
    }

    updateMessageCount() {
        // Conta apenas mensagens de usuário
        const userMessages = this.chatHistory.filter(msg => msg.sender === 'user').length;
        this.messageCounter = userMessages;
        this.messageCount.textContent = userMessages;
    }

    // ===== SUPPORT FUNCTIONS =====
    copyPixKey() {
        const pixKey = 'elliot-ia@projeto';
        navigator.clipboard.writeText(pixKey).then(() => {
            this.showToast('Chave PIX copiada para a área de transferência!', 'success');
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            this.showToast('Erro ao copiar chave PIX', 'error');
        });
    }

    openPaypal() {
        this.showToast('Redirecionando para PayPal...', 'info');
        setTimeout(() => {
            window.open('https://paypal.me/jonathasfelipe', '_blank');
        }, 1000);
    }

    // ===== WELCOME =====
    showWelcome() {
        // Verifica se já tem mensagens
        const hasMessages = this.chatContainer.querySelectorAll('.message').length > 1;
        if (!hasMessages) {
            // A mensagem de boas-vindas já está no HTML
            this.scrollToBottom();
        }
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.app = new ElliotIA();
        
        // Adiciona alguns exemplos iniciais ao chat
        setTimeout(() => {
            const examples = [
                "Digite 'amor' para ver análise gemátrica",
                "Experimente 'luz' ou 'sabedoria'",
                "Pergunte sobre 'gematria hebraica'",
                "Use a calculadora na sidebar para cálculos rápidos"
            ];
            
            const randomExample = examples[Math.floor(Math.random() * examples.length)];
            if (window.app.chatHistory.length === 1) { // Apenas mensagem de boas-vindas
                const hintDiv = document.createElement('div');
                hintDiv.className = 'welcome-hint';
                hintDiv.style.cssText = `
                    text-align: center;
                    margin-top: 1rem;
                    padding: 1rem;
                    background: rgba(138, 43, 226, 0.1);
                    border-radius: 12px;
                    border: 1px solid rgba(138, 43, 226, 0.3);
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                `;
                hintDiv.innerHTML = `<i class="fas fa-lightbulb"></i> ${randomExample}`;
                window.app.chatContainer.appendChild(hintDiv);
                window.app.scrollToBottom();
            }
        }, 1500);
        
    } catch (error) {
        console.error('❌ Erro ao inicializar Elliot IA:', error);
        alert('Erro ao inicializar a aplicação. Por favor, recarregue a página.');
    }
});