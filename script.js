// Mobile Menu Toggle
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Smooth Scrolling
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

        // Scroll Animation
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(element => {
            observer.observe(element);
        });

        // GitHub API Integration
        const username = 'sudoankit404';
        
        async function fetchGitHubData() {
            try {
                // Fetch user data
                const userResponse = await fetch(`https://api.github.com/users/${username}`);
                const userData = await userResponse.json();

                // Update profile image
                if (userData.avatar_url) {
                    document.getElementById('profileImage').src = userData.avatar_url;
                }

                // Update stats
                document.getElementById('repoCount').textContent = userData.public_repos || 0;
                document.getElementById('followerCount').textContent = userData.followers || 0;
                document.getElementById('totalRepos').textContent = userData.public_repos || 0;
                document.getElementById('totalFollowers').textContent = userData.followers || 0;
                document.getElementById('totalFollowing').textContent = userData.following || 0;

                // Fetch repositories
                const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
                const repos = await reposResponse.json();

                // Calculate total stars
                const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
                document.getElementById('totalStars').textContent = totalStars;

                // Display projects
                displayProjects(repos);

            } catch (error) {
                console.error('Error fetching GitHub data:', error);
                document.getElementById('projectsContainer').innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                        <p>Unable to load projects. Please visit my <a href="https://github.com/${username}" target="_blank" style="color: var(--accent);">GitHub profile</a> directly.</p>
                    </div>
                `;
            }
        }

        function displayProjects(repos) {
            const projectsContainer = document.getElementById('projectsContainer');
            
            if (!repos || repos.length === 0) {
                projectsContainer.innerHTML = '<p class="error-message">No repositories found.</p>';
                return;
            }

            // Filter out forked repos and sort by stars and update date
            const filteredRepos = repos
                .filter(repo => !repo.fork)
                .sort((a, b) => {
                    const starsA = a.stargazers_count || 0;
                    const starsB = b.stargazers_count || 0;
                    if (starsB !== starsA) return starsB - starsA;
                    return new Date(b.updated_at) - new Date(a.updated_at);
                })
                .slice(0, 12); // Show top 12 projects

            const projectsHTML = `
                <div class="projects-grid">
                    ${filteredRepos.map(repo => createProjectCard(repo)).join('')}
                </div>
            `;

            projectsContainer.innerHTML = projectsHTML;
        }

        function createProjectCard(repo) {
            const icon = getProjectIcon(repo);
            const category = getProjectCategory(repo);
            
            return `
                <div class="project-card" data-category="${category}">
                    <div class="project-header">
                        <span class="project-icon">${icon}</span>
                        <h3>${repo.name}</h3>
                    </div>
                    <div class="project-body">
                        <p class="project-description">
                            ${repo.description || 'A project by Ankit Kumar'}
                        </p>
                        <div class="project-stats">
                            <span class="project-stat">
                                <i class="fas fa-star"></i> ${repo.stargazers_count || 0}
                            </span>
                            <span class="project-stat">
                                <i class="fas fa-code-branch"></i> ${repo.forks_count || 0}
                            </span>
                            ${repo.language ? `
                            <span class="project-stat">
                                <i class="fas fa-circle" style="color: ${getLanguageColor(repo.language)};"></i> ${repo.language}
                            </span>
                            ` : ''}
                        </div>
                        <div class="project-tags">
                            ${repo.topics ? repo.topics.slice(0, 3).map(topic => `<span class="tag">${topic}</span>`).join('') : ''}
                            ${!repo.topics || repo.topics.length === 0 ? `<span class="tag">${category}</span>` : ''}
                        </div>
                        <div class="project-links">
                            <a href="${repo.html_url}" class="project-link" target="_blank">
                                <i class="fab fa-github"></i> View Code
                            </a>
                            ${repo.homepage ? `
                            <a href="${repo.homepage}" class="project-link" target="_blank">
                                <i class="fas fa-external-link-alt"></i> Demo
                            </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }

        function getProjectIcon(repo) {
            const name = repo.name.toLowerCase();
            const description = (repo.description || '').toLowerCase();
            const topics = repo.topics || [];

            if (name.includes('security') || description.includes('security') || topics.includes('security')) return '🔐';
            if (name.includes('bot') || description.includes('bot')) return '🤖';
            if (name.includes('web') || description.includes('website')) return '🌐';
            if (name.includes('tool') || description.includes('tool')) return '🛠️';
            if (name.includes('api') || description.includes('api')) return '⚡';
            if (name.includes('automation') || description.includes('automation')) return '🔄';
            if (repo.language === 'Python') return '🐍';
            if (repo.language === 'JavaScript') return '📜';
            return '📁';
        }

        function getProjectCategory(repo) {
            const name = repo.name.toLowerCase();
            const description = (repo.description || '').toLowerCase();
            const topics = repo.topics || [];

            if (name.includes('security') || description.includes('security') || topics.includes('security') || 
                topics.includes('pentesting') || topics.includes('cybersecurity')) return 'security';
            if (name.includes('automation') || description.includes('automation') || topics.includes('automation')) return 'automation';
            if (name.includes('tool') || description.includes('tool') || topics.includes('tool')) return 'tools';
            return 'all';
        }

        function getLanguageColor(language) {
            const colors = {
                'Python': '#3572A5',
                'JavaScript': '#f1e05a',
                'TypeScript': '#2b7489',
                'Go': '#00ADD8',
                'Rust': '#dea584',
                'Java': '#b07219',
                'C++': '#f34b7d',
                'C': '#555555',
                'Shell': '#89e051',
                'Ruby': '#701516',
                'PHP': '#4F5D95',
                'HTML': '#e34c26',
                'CSS': '#563d7c'
            };
            return colors[language] || '#8b949e';
        }

        // Project Filtering
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                // Update active button
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                // Filter projects
                const filter = e.target.dataset.filter;
                const projects = document.querySelectorAll('.project-card');

                projects.forEach(project => {
                    if (filter === 'all' || project.dataset.category === filter) {
                        project.style.display = 'block';
                    } else {
                        project.style.display = 'none';
                    }
                });
            }
        });

        // Form Submission
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! I\'ll get back to you soon. 🚀');
            e.target.reset();
        });

        // Initialize
        fetchGitHubData();

        // Active Navigation Link on Scroll
        window.addEventListener('scroll', () => {
            let current = '';
            const sections = document.querySelectorAll('section[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });
        });
        // Typing Animation for Name and Designation (Both at Same Time)
function initTypingAnimation() {
    const typingName = document.getElementById('typingName');
    const typingDesignation = document.getElementById('typingDesignation');
    
    // Start both typing animations at the same time
    setTimeout(() => {
        typingName.classList.add('active');
        typingDesignation.classList.add('active');
        
        // Remove cursor from name after 3 seconds (name completes)
        setTimeout(() => {
            typingName.classList.add('completed');
        }, 3000);
        
        // Remove cursor from designation after 4 seconds (designation completes)
        setTimeout(() => {
            typingDesignation.classList.add('completed');
        }, 4000);
    }, 500);
}

// Initialize typing animation when page loads
window.addEventListener('load', initTypingAnimation);
