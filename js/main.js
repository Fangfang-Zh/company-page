let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
let autoSlideInterval;

function showSlide(index) {
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }

    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

function moveSlide(direction) {
    showSlide(currentSlideIndex + direction);
    resetAutoSlide();
}

function currentSlide(index) {
    showSlide(index);
    resetAutoSlide();
}

function autoSlide() {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
}

function startAutoSlide() {
    autoSlideInterval = setInterval(autoSlide, 4000);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

document.addEventListener('DOMContentLoaded', function() {
    showSlide(0);
    startAutoSlide();

    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', function() {
        clearInterval(autoSlideInterval);
    });

    carousel.addEventListener('mouseleave', function() {
        startAutoSlide();
    });
});

window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
    } else {
        header.style.boxShadow = '0 1px 0 rgba(0,0,0,0.05)';
    }
});

// 产品分类平滑滚动
document.addEventListener('DOMContentLoaded', function() {
    const categoryLinks = document.querySelectorAll('.category-list a');
    const productCategories = document.querySelectorAll('.product-category');
    const sidebar = document.querySelector('.products-sidebar');

    // 把高亮的这一行滚到侧边栏中间
    function centerActiveLink(link) {
        if (!sidebar || !link) return;

        const sidebarRect = sidebar.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();

        // 计算需要滚动的距离：让 link 垂直居中于 sidebar
        const offset = (linkRect.top - sidebarRect.top)
                     - (sidebarRect.height / 2 - linkRect.height / 2);

        sidebar.scrollTop += offset;
    }

    // 点击左侧分类：平滑滚动 + 高亮 + 居中
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有active类
            categoryLinks.forEach(l => l.classList.remove('active'));
            // 添加active类到当前链接
            this.classList.add('active');

            // 让当前点击的这一行居中到侧边栏中间
            centerActiveLink(this);
            
            // 获取目标ID
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // 平滑滚动到目标位置
                const headerHeight = 100;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 滚动时更新active状态 + 让active行居中
    if (productCategories.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';
            
            productCategories.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            let activeLink = null;

            categoryLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                    activeLink = link;
                }
            });

            // 当你滚到比如 15. SNI-110 那一块时，
            // 对应的 link 被设置为 active，这里把它滚到侧栏中间
            if (activeLink) {
                centerActiveLink(activeLink);
            }
        });
    }
});
