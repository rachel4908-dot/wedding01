// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    
    // 배경음악 제어 기능
    const backgroundMusic = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');
    let musicPlaying = false;
    
    // 음악 자동재생 시도 (사용자 상호작용 후)
    function initMusic() {
        backgroundMusic.volume = 0.3; // 볼륨 30%로 설정
        
        // 자동재생 시도
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // 자동재생 성공
                    musicPlaying = true;
                    musicToggle.classList.add('playing');
                    musicIcon.textContent = '🎵';
                })
                .catch(() => {
                    // 자동재생 실패 (브라우저 정책)
                    musicPlaying = false;
                    musicToggle.classList.add('paused');
                    musicIcon.textContent = '🔇';
                });
        }
    }
    
    // 음악 토글 함수
    function toggleMusic() {
        if (musicPlaying) {
            backgroundMusic.pause();
            musicPlaying = false;
            musicToggle.classList.remove('playing');
            musicToggle.classList.add('paused');
            musicIcon.textContent = '🔇';
        } else {
            backgroundMusic.play()
                .then(() => {
                    musicPlaying = true;
                    musicToggle.classList.remove('paused');
                    musicToggle.classList.add('playing');
                    musicIcon.textContent = '🎵';
                })
                .catch((error) => {
                    console.log('음악 재생 실패:', error);
                });
        }
    }
    
    // 음악 제어 버튼 클릭 이벤트
    musicToggle.addEventListener('click', toggleMusic);
    
    // 페이지 첫 클릭 시 음악 초기화
    document.addEventListener('click', function initMusicOnFirstClick() {
        initMusic();
        document.removeEventListener('click', initMusicOnFirstClick);
    }, { once: true });
    
    // 음악 종료 시 이벤트 (루프 확인)
    backgroundMusic.addEventListener('ended', function() {
        if (musicPlaying) {
            backgroundMusic.currentTime = 0;
            backgroundMusic.play();
        }
    });
    
    // 벚꽃 애니메이션 변수
    let sakuraAnimationActive = true;
    let sakuraTimeoutId = null;
    const maxPetals = 15; // 최대 벚꽃 개수 제한
    
    // 벚꽃 애니메이션 함수
    function createSakuraPetal() {
        if (!sakuraAnimationActive) return;
        
        const container = document.querySelector('.sakura-container');
        const existingPetals = container.querySelectorAll('.sakura-petal').length;
        
        // 최대 개수 제한으로 성능 최적화
        if (existingPetals >= maxPetals) {
            sakuraTimeoutId = setTimeout(startSakuraAnimation, 500);
            return;
        }
        
        const petal = document.createElement('div');
        petal.className = 'sakura-petal';
        
        // 랜덤 위치와 크기 설정
        const startX = Math.random() * window.innerWidth;
        const animationDuration = Math.random() * 6 + 4; // 4-10초
        const delay = Math.random() * 1; // 0-1초 지연
        
        petal.style.left = startX + 'px';
        petal.style.animationDuration = animationDuration + 's';
        petal.style.animationDelay = delay + 's';
        
        container.appendChild(petal);
        
        // 애니메이션 완료 후 요소 제거
        setTimeout(() => {
            if (petal.parentNode) {
                petal.parentNode.removeChild(petal);
            }
        }, (animationDuration + delay) * 1000);
    }
    
    // 벚꽃 생성 함수 시작
    function startSakuraAnimation() {
        if (!sakuraAnimationActive) return;
        
        createSakuraPetal();
        
        // 랜덤한 간격으로 벚꽃 생성 (400-900ms)
        sakuraTimeoutId = setTimeout(startSakuraAnimation, Math.random() * 500 + 400);
    }
    
    // 화면 크기 변경 시 벚꽃 정리
    window.addEventListener('resize', function() {
        const container = document.querySelector('.sakura-container');
        const petals = container.querySelectorAll('.sakura-petal');
        petals.forEach(petal => {
            if (petal.offsetLeft > window.innerWidth) {
                petal.remove();
            }
        });
    });
    
    // 벚꽃 애니메이션 시작
    startSakuraAnimation();
    // 갤러리 캐러셀 모달 기능
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.getElementById('modal-close');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');
    const modalCounter = document.getElementById('modal-counter');
    
    let currentImageIndex = 0;
    const imageList = [];
    
    // 이미지 리스트 생성
    galleryItems.forEach((item, index) => {
        const imgSrc = item.getAttribute('data-img');
        const imgAlt = item.querySelector('img').alt;
        imageList.push({
            src: imgSrc,
            alt: imgAlt,
            index: index
        });
    });

    // 모달 열기 함수
    function openModal(index) {
        currentImageIndex = index;
        updateModalImage();
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    }

    // 모달 닫기 함수
    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // 스크롤 복원
        modalImage.src = ''; // 메모리 절약
    }
    
    // 모달 이미지 업데이트 함수
    function updateModalImage() {
        const currentImage = imageList[currentImageIndex];
        modalImage.src = currentImage.src;
        modalImage.alt = currentImage.alt;
        modalCounter.textContent = `${currentImageIndex + 1} / ${imageList.length}`;
    }
    
    // 이전 이미지로 이동
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + imageList.length) % imageList.length;
        updateModalImage();
    }
    
    // 다음 이미지로 이동
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % imageList.length;
        updateModalImage();
    }

    // 갤러리 아이템 클릭 시 모달 열기
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openModal(index);
        });
    });

    // 모달 닫기 버튼 클릭 시
    modalClose.addEventListener('click', closeModal);
    
    // 이전/다음 버튼 클릭 시
    modalPrev.addEventListener('click', showPrevImage);
    modalNext.addEventListener('click', showNextImage);

    // 모달 배경 클릭 시 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 키보드 이벤트 처리
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('hidden')) {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });
    
    // 터치 스와이프 기능 (모바일)
    let touchStartX = 0;
    let touchEndX = 0;
    
    modalImage.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    modalImage.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                showNextImage(); // 왼쪽으로 스와이프 = 다음 이미지
            } else {
                showPrevImage(); // 오른쪽으로 스와이프 = 이전 이미지
            }
        }
    }

    // 이미지 로딩 에러 처리
    modalImage.addEventListener('error', function() {
        console.error('이미지를 로드할 수 없습니다.');
        closeModal();
    });
});

// 카카오맵 SDK 로드가 완료되면 이 함수가 실행됩니다.
kakao.maps.load(function() {
    var mapContainer = document.getElementById('map'),
        mapOption = {
            center: new kakao.maps.LatLng(37.451015, 126.681426),
            level: 3
        };

    var map = new kakao.maps.Map(mapContainer, mapOption);

    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
        imageSize = new kakao.maps.Size(64, 69),
        imageOption = {
            offset: new kakao.maps.Point(27, 69)
        };

    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
        markerPosition = new kakao.maps.LatLng(37.451015, 126.681426);

    var marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage
    });

    marker.setMap(map);

    // 지도 확대/축소 컨트롤러를 생성합니다
    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
});

