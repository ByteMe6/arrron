document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.completed-slider');
  const slides = document.querySelectorAll('.completed-slider__item');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.completed-slider__btn.prev');
  const nextBtn = document.querySelector('.completed-slider__btn.next');
  
  let currentSlide = 0;
  let isAnimating = false;
  let isMobile = window.innerWidth <= 768; // Проверяем ширину экрана
  
  // Обработчик изменения размера окна
  window.addEventListener('resize', () => {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    
    // Если изменился режим отображения
    if (wasMobile !== isMobile) {
      updateSlider();
    }
  });
  
  function updateSlider() {
    if (isAnimating) return;
    isAnimating = true;
    
    if (isMobile) {
      // Мобильная версия - показываем только активный слайд
      slides.forEach((slide, index) => {
        slide.classList.remove('active');
        slide.style.opacity = '0';
        slide.style.position = 'absolute';
      });
      
      slides[currentSlide].classList.add('active');
      slides[currentSlide].style.opacity = '1';
      slides[currentSlide].style.position = 'relative';
    } else {
      // Десктоп версия - показываем все слайды
      slides.forEach((slide, index) => {
        slide.classList.remove('active');
        slide.style.opacity = '1';
        slide.style.position = 'relative';
        slide.style.transform = `scale(${index === currentSlide ? 1 : 0.85})`;
      });
      
      slides[currentSlide].classList.add('active');
    }
    
    // Обновляем точки
    dots.forEach((dot, index) => {
      dot.classList.remove('active');
    });
    dots[currentSlide].classList.add('active');

    setTimeout(() => {
      isAnimating = false;
    }, 600);
  }

  function nextSlide() {
    if (!isAnimating) {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlider();
    }
  }

  function prevSlide() {
    if (!isAnimating) {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateSlider();
    }
  }
  
  // Инициализация
  updateSlider();
  
  // Обработчики событий
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  
  // Обработчики для точек с защитой от двойных кликов
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (!isAnimating && currentSlide !== index) {
        currentSlide = index;
        updateSlider();
      }
    });
  });

  // Обработка свайпов
  let touchStartX = 0;
  
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) { // Минимальное расстояние для свайпа
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }, { passive: true });

  // Автоматическое переключение слайдов
  let autoplayInterval;

  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000); // Переключение каждые 5 секунд
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Запускаем автопрокрутку
  startAutoplay();

  // Останавливаем при взаимодействии
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  slider.addEventListener('touchstart', stopAutoplay);
  slider.addEventListener('touchend', startAutoplay);
}); 