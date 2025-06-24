// sidebar-hamburger.js
document.addEventListener('DOMContentLoaded', () => {
  const sidebar    = document.getElementById('sidebar');
  const hamburger  = document.getElementById('menu-toggle');
  const overlay    = document.getElementById('sidebar-overlay');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    hamburger.style.display = 'none';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    // só mostra o hamburger se estivermos em modo colapsado
    if (window.innerWidth <= 1024) {
      hamburger.style.display = 'block';
    }
  }

  // abrir ao clicar no ícone
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    openSidebar();
  });

  // fechar ao clicar no overlay
  overlay.addEventListener('click', (e) => {
    e.stopPropagation();
    closeSidebar();
  });

  // fechar ao clicar em qualquer lugar fora do sidebar
  document.addEventListener('click', (e) => {
    if (
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeSidebar();
    }
  });

  // fecha e ajusta visibilidade do hamburger ao redimensionar
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      // em desktop sempre visível
      closeSidebar();
      hamburger.style.display = 'none';
    } else if (!sidebar.classList.contains('open')) {
      // em tablet/mobile, hamburger aparece se estiver fechado
      hamburger.style.display = 'block';
    }
  });

  // inicialização
  if (window.innerWidth <= 1024) {
    hamburger.style.display = 'block';
  }
});
