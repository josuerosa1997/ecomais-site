'use strict';
const WHATSAPP_NUMBER = '5594981068031';
function whatsappLink(message) { return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message); }
function quoteMessage(data) {
  const details = [
    'Olá, equipe ECOMAIS! Gostaria de orientação técnica e orçamento.',
    '', 'Solução: ' + data.service,
    data.name ? 'Nome: ' + data.name : '',
    data.city ? 'Cidade / UF: ' + data.city : '',
    data.message ? '\nSobre o projeto:\n' + data.message : ''
  ];
  return details.filter((line, index) => line || index === 1).join('\n');
}
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menu'); mobileNav.hidden = true; }
menuButton.addEventListener('click', () => { const expanded = menuButton.getAttribute('aria-expanded') === 'true'; menuButton.setAttribute('aria-expanded', String(!expanded)); menuButton.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu'); mobileNav.hidden = expanded; });
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); } });
const form = document.querySelector('#quote-form');
const preview = document.querySelector('#request-preview');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  const data = Object.fromEntries(['name','city','service','message'].map(key => [key, String(fields.get(key) || '').trim()]));
  const body = quoteMessage(data);
  const url = whatsappLink(body);
  preview.value = body;
  document.querySelector('#email-fallback').hidden = false;
  document.querySelector('#retry-whatsapp').href = url;
  document.querySelector('#copy-status').textContent = '';
  window.open(url, '_blank', 'noopener,noreferrer');
});
document.querySelector('#copy-request').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText(preview.value); status.textContent = 'Mensagem copiada. Cole no WhatsApp para enviar.'; }
  catch { preview.focus(); preview.select(); status.textContent = 'Texto selecionado. Use a opção Copiar do seu dispositivo.'; }
});
document.querySelector('#year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => { document.querySelector('.whatsapp-float').classList.toggle('is-hidden', entries[0].isIntersecting); }, { threshold: .08 }); observer.observe(document.querySelector('#orcamento')); }
