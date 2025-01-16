// Define translations object
const translations = {
    en: {
        title: "Free AI Slogan Generator",
        subtitle: "Use this powerful tool to create memorable, catchy slogans that capture the essence of your brand and leave a lasting impression.",
        inputLabel: "I want a slogan for...",
        format: "Format",
        generate: "Generate",
        explainMeaning: "Explain meaning",
        generateButton: "Generate Slogan Ideas",
        signUp: "Sign up",
        customPlaceholder: "e.g., Sassy",
        customHint: "Enter a custom writing tone."
    },
    zh: {
        title: "免费 AI 标语生成器",
        subtitle: "使用这个强大的工具来创建令人难忘的朗朗上口的标语，捕捉品牌精髓并留下持久的印象。",
        inputLabel: "我想要一个标语为...",
        format: "格式",
        generate: "生成",
        explainMeaning: "解释含义",
        generateButton: "生成标语创意",
        signUp: "注册",
        customPlaceholder: "例如：活泼",
        customHint: "输入自定义写作风格。"
    }
};

// Initialize UI after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Define format options inside the DOMContentLoaded handler
    const formatOptions = [
        { icon: "📝", name: "Formal" },
        { icon: "😊", name: "Friendly" },
        { icon: "😎", name: "Casual" },
        { icon: "💼", name: "Professional" },
        { icon: "🤝", name: "Diplomatic" },
        { icon: "💪", name: "Confident" },
        { icon: "📚", name: "Middle school" },
        { icon: "🎓", name: "High school" },
        { icon: "🎓", name: "Academic" },
        { icon: "📖", name: "Simplified" },
        { icon: "🦄", name: "Vivid" },
        { icon: "🤗", name: "Empathetic" },
        { icon: "💎", name: "Luxury" },
        { icon: "👍", name: "Engaging" },
        { icon: "🎨", name: "Custom..." }
    ];

    const languageSelect = document.getElementById('languageSelect');
    
    // Language switcher
    languageSelect.addEventListener('change', (e) => {
        const language = e.target.value;
        updateLanguage(language);
    });

    function updateLanguage(language) {
        document.querySelectorAll('[data-en]').forEach(element => {
            const translationKey = element.getAttribute(`data-${language}`);
            if (translationKey) {
                element.textContent = translationKey;
            }
        });

        // Update custom format placeholder
        const customInput = document.querySelector('.custom-format input');
        if (customInput) {
            customInput.placeholder = translations[language].customPlaceholder;
        }
        
        // Update custom format hint
        const customHint = document.querySelector('.custom-format .hint');
        if (customHint) {
            customHint.textContent = translations[language].customHint;
        }
    }

    // Create format dropdown
    const formatSection = document.querySelector('.format-section');
    formatSection.innerHTML = `
        <div class="format-dropdown">
            <button class="format-btn">
                <span class="selected-format">🎨 Format</span>
                <span class="arrow">▼</span>
            </button>
            <div class="format-options">
                ${formatOptions.map(option => `
                    <div class="format-option" data-format="${option.name}">
                        <span>${option.icon}</span>
                        <span>${option.name}</span>
                    </div>
                `).join('')}
            </div>
            <div class="custom-format">
                <input type="text" placeholder="e.g., Sassy">
                <div class="hint" style="color: #666; font-size: 12px; margin-top: 4px;">
                    Enter a custom writing tone.
                </div>
            </div>
        </div>
    `;

    // Format dropdown functionality
    const formatBtn = document.querySelector('.format-btn');
    const formatOptionsElement = document.querySelector('.format-options');
    const customFormat = document.querySelector('.custom-format');
    const selectedFormat = document.querySelector('.selected-format');

    formatBtn.addEventListener('click', () => {
        formatOptionsElement.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!formatSection.contains(e.target)) {
            formatOptionsElement.classList.remove('show');
        }
    });

    document.querySelectorAll('.format-option').forEach(option => {
        option.addEventListener('click', () => {
            const format = option.dataset.format;
            const icon = option.querySelector('span').textContent;
            
            if (format === 'Custom...') {
                customFormat.classList.add('show');
                selectedFormat.textContent = `${icon} Custom`;
            } else {
                customFormat.classList.remove('show');
                selectedFormat.textContent = `${icon} ${format}`;
            }
            
            formatOptionsElement.classList.remove('show');
        });
    });

    // Generate button click handler
    const generateBtn = document.querySelector('.generate-btn');
    generateBtn.addEventListener('click', () => {
        const input = document.getElementById('sloganInput').value;
        if (input.trim()) {
            // Here you would typically make an API call to generate slogans
            alert('Slogan generation would happen here!');
        } else {
            alert('Please enter a description for your slogan');
        }
    });

    // Explain meaning toggle
    const explainToggle = document.getElementById('explainToggle');
    explainToggle.addEventListener('change', () => {
        console.log('Explanation toggle:', explainToggle.checked);
    });
});


const generateButton = document.querySelector('.generate-btn');
const sloganInput = document.getElementById('sloganInput');
const variantsSelect = document.querySelector('.variants-select');
const explainToggle = document.getElementById('explainToggle');
const generatedSlogansDiv = document.getElementById('generatedSlogans');

generateButton.addEventListener('click', async () => {
    const description = sloganInput.value.trim();
    const variants = variantsSelect.value;
    const tone = explainToggle.checked ? "detailed and explanatory" : "concise and catchy";

    if (!description) {
        alert('Please enter a description.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/generate-slogans', { // Ensure URL is correct
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, variants, tone }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server Error:', errorText);
            throw new Error('Failed to fetch slogans. Please try again.');
        }

        const { slogans } = await response.json();

        // Clear previous results
        generatedSlogansDiv.innerHTML = '';

        // Insert new slogans
        slogans.forEach((slogan, index) => {
            const sloganElement = document.createElement('div');
            sloganElement.className = 'slogan';
            sloganElement.textContent = `${slogan}`;
            generatedSlogansDiv.appendChild(sloganElement);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while generating slogans. Please try again later.');
    }
});
