// Google Translate Initialization
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,hi,bn',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
}

function toggleTranslateDropdown() {
  var el = document.getElementById("google_translate_element");
  el.style.display = (el.style.display === "none") ? "block" : "none";
}

// AOS Initialization and Fetch Calls
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }

  // Fetch notices
  fetch('notices.json')
    .then(response => {
        if (!response.ok) throw new Error('Notices fetch failed');
        return response.json();
    })
    .then(data => displayNotices(data))
    .catch(error => {
        console.error('Error loading notices:', error);
        const container = document.getElementById('notices-container');
        if(container) container.innerHTML = '<p class="text-muted">No new notices at this time.</p>';
    });
    
  // Fetch Gallery Data
  fetch('gallery.json')
    .then(response => {
        if (!response.ok) throw new Error('Gallery fetch failed');
        return response.json();
    })
    .then(data => displayGallery(data))
    .catch(error => console.error('Error loading gallery:', error));
});

function displayNotices(notices) {
  const container = document.getElementById('notices-container');
  if (!container) return;

  notices.forEach(notice => {
    const noticeDiv = document.createElement('div');
    noticeDiv.classList.add('notice');

    noticeDiv.innerHTML = `
      <h3>${notice.title}</h3>
      <p><strong>Date:</strong> ${notice.date}</p>
      <p>${notice.description}</p>
    `;

    container.appendChild(noticeDiv);
  });
}

function displayGallery(images) {
  const container = document.getElementById('gallery-container');
  if (!container) return;
  
  if (!images || images.length === 0) {
    container.innerHTML = '<p class="text-center">No images found.</p>';
    return;
  }

  // Build the entire carousel structure dynamically
  let html = `
    <div id="galleryCarousel" class="carousel slide carousel-dark" data-bs-ride="carousel">
      <div class="carousel-inner shadow-lg">
  `;

  images.forEach((img, index) => {
    const activeClass = index === 0 ? 'active' : '';
    html += `
      <div class="carousel-item ${activeClass}">
        <div style="position: relative; overflow: hidden; border-radius: 20px;">
          <img src="${img.src}" class="d-block w-100" alt="${img.alt}">
          <div class="gallery-caption">
            <h5>${img.title}</h5>
            <p>${img.artist}</p>
          </div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#galleryCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#galleryCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>
  `;

  container.innerHTML = html;
}

// Scroll to Top Button
let scrollBtn = document.getElementById("scrollBtn");

window.onscroll = function () {
  scrollFunction();
  highlightNav();
};

function scrollFunction() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    scrollBtn.style.display = "flex"; 
  } else {
    scrollBtn.style.display = "none";
  }
}

function topFunction() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Active link highlighting script
function highlightNav() {
  const sections = document.querySelectorAll("section, footer");
  const navLinks = document.querySelectorAll(".nav-btn");
  const headerElement = document.getElementById("mainHeader");
  
  if (!headerElement || sections.length === 0 || navLinks.length === 0) return;
  
  const headerHeight = headerElement.offsetHeight;
  let current = "";
  const scrollPosition = window.scrollY + headerHeight + 50;

  sections.forEach(section => {
    if (
      scrollPosition >= section.offsetTop &&
      scrollPosition < section.offsetTop + section.offsetHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
    current = "footer";
  }

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
}
