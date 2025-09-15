document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL HELPERS & DATA ---
    const contentData = [
        { id: 1, image: 'https://placehold.co/600x400/a2d2ff/333333?text=阅声', title: '关于告别', text: '我们一生都在学着如何告别，却总是学不会。', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '4:12' },
        { id: 2, image: 'https://placehold.co/600x400/ffafcc/333333?text=阅声', title: '夏夜的风', text: '夏夜的风，带来了远方的故事，和槐花的香气。', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: '5:25' },
        { id: 3, image: 'https://placehold.co/600x400/bde0fe/333333?text=阅声', title: '城市的猫', text: '它在墙头踱步，优雅又孤独，看尽了这座城市的日出与日落。', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: '3:58' },
        { id: 4, image: 'https://placehold.co/600x400/cddafd/333333?text=阅声', title: '雪国', text: '穿过县界长长的隧道，便是雪国。夜空下一片白茫茫。——川端康成', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration: '4:50' },
        { id: 5, image: 'https://placehold.co/600x400/f5c2e7/333333?text=阅声', title: '断章', text: '你站在桥上看风景，看风景的人在楼上看你。明月装饰了你的窗子，你装饰了别人的梦。——卞之琳', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', duration: '3:15' },
        { id: 6, image: 'https://placehold.co/600x400/b2f2bb/333333?text=阅声', title: '人间草木', text: '我们曾如此渴望命运的波澜，到最后才发现：人生最曼妙的风景，竟是内心的淡定与从容。——汪曾祺', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', duration: '5:02' },
        { id: 7, image: 'https://placehold.co/600x400/f7d1ba/333333?text=阅声', title: '爱在黎明破晓前', text: '我觉得，我就是为遇见你，才来到这个世界的。', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', duration: '2:48' },
        { id: 8, image: 'https://placehold.co/600x400/a6e3e9/333333?text=阅声', title: '海子的诗', text: '你来人间一趟，你要看看太阳，和你的心上人，一起走在街上。', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', duration: '4:22' },
        { id: 9, image: 'https://placehold.co/600x400/e4c1f9/333333?text=阅声', title: '月亮与六便士', text: '我用尽了全力，过着平凡的一生。', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', duration: '3:33' },
        { id: 10, image: 'https://placehold.co/600x400/d4a5a5/333333?text=阅声', title: '无题', text: '生活是具体的，不是一种巨大的、无法战胜的、绝望的虚空。——加缪', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', duration: '4:01' }
    ];

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function showToast(message) {
        let toast = document.querySelector('.toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // --- THEME & FONT-SIZE INITIALIZATION ---
    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    let currentTheme = localStorage.getItem('yuesheng_theme') || 'system';
    let currentFontSize = localStorage.getItem('yuesheng_fontsize') || 'medium';

    function applyTheme(theme) {
        let themeToApply = theme;
        if (theme === 'system') {
            themeToApply = systemThemeQuery.matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', themeToApply);
    }

    function applyFontSize(size) {
        document.documentElement.setAttribute('data-font-size', size);
    }

    applyTheme(currentTheme);
    applyFontSize(currentFontSize);
    systemThemeQuery.addEventListener('change', () => applyTheme(currentTheme));

    // --- PAGE-SPECIFIC LOGIC ---
    const pageId = document.body.id;

    if (pageId === 'page-settings') {
        // --- Theme Switcher Logic ---
        const themeOptions = document.querySelectorAll('.theme-option');
        function updateThemeUI(selectedTheme) {
            themeOptions.forEach(el => {
                el.classList.toggle('active', el.dataset.themeValue === selectedTheme);
            });
        }
        updateThemeUI(currentTheme);
        themeOptions.forEach(el => {
            el.addEventListener('click', () => {
                const newTheme = el.dataset.themeValue;
                localStorage.setItem('yuesheng_theme', newTheme);
                currentTheme = newTheme;
                applyTheme(newTheme);
                updateThemeUI(newTheme);
            });
        });

        // --- Font Size Switcher Logic ---
        const fontSizeOptions = document.querySelectorAll('.segmented-control-option');
        function updateFontSizeUI(selectedSize) {
            fontSizeOptions.forEach(el => {
                el.classList.toggle('active', el.dataset.fontSize === selectedSize);
            });
        }
        updateFontSizeUI(currentFontSize);
        fontSizeOptions.forEach(el => {
            el.addEventListener('click', () => {
                const newSize = el.dataset.fontSize;
                localStorage.setItem('yuesheng_fontsize', newSize);
                currentFontSize = newSize;
                applyFontSize(newSize);
                updateFontSizeUI(newSize);
            });
        });

        // --- Clear Cache Logic ---
        const clearCacheBtn = document.getElementById('clear-cache-btn');
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', () => {
                if (confirm('确定要清除所有本地缓存吗？这将包括您的收藏、历史记录和所有偏好设置。')) {
                    localStorage.clear();
                    alert('缓存已清除！');
                    location.reload();
                }
            });
        }
    }

    if (pageId === 'page-index') {
        const cardImage = document.querySelector('.card img');
        const cardTitle = document.querySelector('.card-content h2');
        const cardText = document.querySelector('.card-content p');
        const favoriteBtn = document.querySelector('.favorite-btn');
        const playPauseBtn = document.querySelector('.play-pause');
        const readFullBtn = document.querySelector('.read-full-btn');
        const progress = document.querySelector('.progress');
        const currentTimeEl = document.querySelector('.current-time');
        const durationEl = document.querySelector('.duration');

        let favorites = JSON.parse(localStorage.getItem('yuesheng_favorites')) || [];
        let history = JSON.parse(localStorage.getItem('yuesheng_history')) || [];
        let currentTrackIndex = 0;
        let isPlaying = false;
        let audio = new Audio();

        function isFavorited(id) {
            return favorites.includes(id);
        }

        function toggleFavorite(id) {
            if (isFavorited(id)) {
                favorites = favorites.filter(favId => favId !== id);
            } else {
                favorites.push(id);
            }
            localStorage.setItem('yuesheng_favorites', JSON.stringify(favorites));
            updateFavoriteButton(id);
        }

        function addToHistory(id) {
            history = [id, ...history.filter(histId => histId !== id)];
            if (history.length > 50) history.pop();
            localStorage.setItem('yuesheng_history', JSON.stringify(history));
        }

        function updateFavoriteButton(id) {
            if (isFavorited(id)) {
                favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
                favoriteBtn.classList.add('favorited');
            } else {
                favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
                favoriteBtn.classList.remove('favorited');
            }
        }

        function loadContent(index) {
            const content = contentData[index];
            currentTrackIndex = index;
            cardImage.src = content.image;
            cardTitle.textContent = content.title;
            cardText.textContent = content.text;
            audio.src = content.audio;
            durationEl.textContent = content.duration;
            currentTimeEl.textContent = '0:00';
            progress.style.width = '0%';
            updateFavoriteButton(content.id);
            if (readFullBtn) {
                readFullBtn.href = `reader.html?id=${content.id}`;
            }
            if (isPlaying) audio.play();
        }

        function playNext() {
            loadContent((currentTrackIndex + 1) % contentData.length);
        }

        function togglePlay() {
            if (isPlaying) {
                audio.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                audio.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                addToHistory(contentData[currentTrackIndex].id);
            }
            isPlaying = !isPlaying;
        }

        favoriteBtn.addEventListener('click', () => toggleFavorite(contentData[currentTrackIndex].id));
        playPauseBtn.addEventListener('click', togglePlay);
        readFullBtn.addEventListener('click', (e) => {});

        audio.addEventListener('timeupdate', () => {
            const { duration, currentTime } = audio;
            if (duration) {
                progress.style.width = `${(currentTime / duration) * 100}%`;
                currentTimeEl.textContent = formatTime(currentTime);
            }
        });
        audio.addEventListener('ended', playNext);
        audio.addEventListener('loadedmetadata', () => {
            if (durationEl) durationEl.textContent = formatTime(audio.duration);
        });

        loadContent(0);
    }

    if (pageId === 'page-me') {
        const followCard = document.querySelector('.follow-us-card');
        if (followCard) {
            followCard.addEventListener('click', () => {
                const textToCopy = document.querySelector('.follow-us-id').textContent;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast('公众号「' + textToCopy + '」已复制');
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                    showToast('复制失败');
                });
            });
        }
    }

    if (pageId === 'page-reader') {
        const urlParams = new URLSearchParams(window.location.search);
        const contentId = parseInt(urlParams.get('id'));
        const content = contentData.find(item => item.id === contentId);

        const titleEl = document.querySelector('.reader-title');
        const contentEl = document.querySelector('.reader-content p');

        if (content) {
            titleEl.textContent = content.title;
            contentEl.textContent = `${content.text} `.repeat(10);
        } else {
            titleEl.textContent = '内容未找到';
            contentEl.textContent = '抱歉，我们无法找到您请求的内容。';
        }
    }
});