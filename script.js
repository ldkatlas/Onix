/* =========================================================
   ONIX BURGUER — script.js
   Carrinho, animações, filtros, WhatsApp e interações
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     CONFIGURAÇÕES FÁCEIS DE ALTERAR
     --------------------------------------------------------- */
  // Número do WhatsApp com DDI + DDD (somente dígitos)
  const WHATSAPP_NUMBER = "5511999999999";

  // Nome da loja na mensagem
  const LOJA_NOME = "Onix Burguer";

  // Chave do localStorage do carrinho
  const CART_STORAGE_KEY = "onix_burguer_cart";

  /* ---------------------------------------------------------
     CARDÁPIO — edite preços, nomes e categorias aqui
     emoji: troque por foto depois (use campo image se quiser)
     --------------------------------------------------------- */
  const MENU_ITEMS = [
    {
      id: "smash-classico",
      nome: "Smash Clássico",
      descricao: "Blend smashado, queijo cheddar, picles e molho da casa.",
      preco: 24.9,
      categoria: "smash",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=640&h=480&q=80"
    },
    {
      id: "smash-duplo",
      nome: "Smash Duplo",
      descricao: "Dois smashs, cheddar em dobro e cebola caramelizada.",
      preco: 32.9,
      categoria: "smash",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=640&h=480&q=80"
    },
    {
      id: "smash-bacon",
      nome: "Smash Bacon",
      descricao: "Smash, cheddar, bacon crocante e molho barbecue.",
      preco: 29.9,
      categoria: "smash",
      image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=640&h=480&q=80"
    },
    {
      id: "smash-cheddar",
      nome: "Smash Cheddar",
      descricao: "Smash suculento com cascata de cheddar cremoso.",
      preco: 28.9,
      categoria: "smash",
      image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=640&h=480&q=80"
    },
    {
      id: "smash-onix",
      nome: "Smash Onix",
      descricao: "Especial da casa: smash, cheddar, bacon, onion e molho secreto.",
      preco: 34.9,
      categoria: "smash",
      image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=640&h=480&q=80"
    },
    {
      id: "combo-classico",
      nome: "Combo Clássico",
      descricao: "Smash Clássico + batata média + refrigerante lata.",
      preco: 39.9,
      categoria: "combos",
      image: "https://images.unsplash.com/photo-1596662951482-2c1aa1ab0a63?auto=format&fit=crop&w=640&h=480&q=80"
    },
    {
      id: "combo-onix",
      nome: "Combo Onix",
      descricao: "Smash Onix + onion rings + refrigerante ou suco.",
      preco: 49.9,
      categoria: "combos",
      image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=640&h=480&q=80"
    },
    {
      id: "combo-familia",
      nome: "Combo Família",
      descricao: "4 smashs à escolha + 2 batatas grandes + 2 bebidas.",
      preco: 119.9,
      categoria: "combos",
      image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=640&h=480&q=80"
    },
    {
      id: "batata-frita",
      nome: "Batata Frita",
      descricao: "Porção crocante com sal e ervas. Escolha média ou grande.",
      preco: 14.9,
      categoria: "acompanhamentos",
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=640&h=480&q=80"
    },
    {
      id: "onion-rings",
      nome: "Onion Rings",
      descricao: "Anéis de cebola empanados, dourados e sequinhos.",
      preco: 16.9,
      categoria: "acompanhamentos",
      image: "https://images.unsplash.com/photo-1639024471283-035726710cd1?auto=format&fit=crop&w=640&h=480&q=80"
    },
    {
      id: "refrigerante",
      nome: "Refrigerante",
      descricao: "Lata 350ml — Coca, Guaraná ou Sprite.",
      preco: 7.9,
      categoria: "bebidas",
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=640&h=480&q=80"
    },
    {
      id: "suco-natural",
      nome: "Suco Natural",
      descricao: "Laranja, limão ou maracujá — 400ml.",
      preco: 9.9,
      categoria: "bebidas",
      image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=640&h=480&q=80"
    },
    {
      id: "milkshake",
      nome: "Milkshake",
      descricao: "Chocolate, morango ou baunilha — 400ml cremoso.",
      preco: 18.9,
      categoria: "bebidas",
      image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=640&h=480&q=80"
    }
  ];

  /* ---------------------------------------------------------
     UTILITÁRIOS
     --------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function formatBRL(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function qs(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }

  function qsa(sel, ctx) {
    return Array.from((ctx || document).querySelectorAll(sel));
  }

  function whatsappUrl(mensagem) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(mensagem);
  }

  /* ---------------------------------------------------------
     PRELOADER
     --------------------------------------------------------- */
  function initPreloader() {
    document.body.classList.add("page-ready");
  }

  /* ---------------------------------------------------------
     HEADER STICKY + NAV ATIVO
     --------------------------------------------------------- */
  function initHeader() {
    const header = qs("#siteHeader");
    const hero = qs("#inicio");
    if (!header || !hero) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          // Fora do hero → sticky com vidro
          if (!entry.isIntersecting) {
            header.classList.add("is-sticky");
          } else {
            header.classList.remove("is-sticky");
          }
        });
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );

    observer.observe(hero);

    // Destaque do link ativo por seção
    const sections = qsa("section[id]");
    const links = qsa(".nav-link");

    function updateActive() {
      const y = window.scrollY + window.innerHeight * 0.3;
      let current = "inicio";
      sections.forEach(function (sec) {
        if (sec.offsetTop <= y) current = sec.id;
      });
      links.forEach(function (link) {
        const id = (link.getAttribute("href") || "").replace("#", "");
        link.classList.toggle("active", id === current);
      });
    }

    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
  }

  /* ---------------------------------------------------------
     MENU MOBILE
     --------------------------------------------------------- */
  function initMobileMenu() {
    const toggle = qs("#menuToggle");
    const closeBtn = qs("#menuClose");
    const menu = qs("#mobileMenu");
    if (!toggle || !menu) return;

    function openMenu() {
      menu.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    function closeMenu() {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    toggle.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);

    qsa(".nav-link", menu).forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) closeMenu();
    });
  }

  /* ---------------------------------------------------------
     SMOOTH SCROLL (links âncora)
     --------------------------------------------------------- */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------------
     RENDER DO CARDÁPIO + FILTROS
     --------------------------------------------------------- */
  function initMenu() {
    const grid = qs("#menuGrid");
    if (!grid) return;

    const catLabels = {
      smash: "Smash",
      combos: "Combo",
      acompanhamentos: "Porção",
      bebidas: "Bebida"
    };

    // Renderiza cards sem imagem (formato limpo e quadrado)
    grid.innerHTML = MENU_ITEMS.map(function (item) {
      const badge = catLabels[item.categoria] || "Smash";
      return (
        '<article class="menu-card" data-category="' + item.categoria + '" data-id="' + item.id + '">' +
          '<div class="menu-card-top">' +
            '<span class="menu-badge">' + badge + '</span>' +
            '<span class="menu-price">' + formatBRL(item.preco) + '</span>' +
          '</div>' +
          '<h3>' + item.nome + '</h3>' +
          '<p class="menu-desc">' + item.descricao + '</p>' +
          '<div class="menu-card-bottom">' +
            '<button type="button" class="btn-add magnetic" data-add="' + item.id + '" aria-label="Adicionar ' + item.nome + ' ao carrinho">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>' +
                '<path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>' +
              '</svg>' +
              'Adicionar' +
            '</button>' +
          '</div>' +
        '</article>'
      );
    }).join("");

    // Animação de entrada escalonada
    const cards = qsa(".menu-card", grid);
    cards.forEach(function (card, i) {
      setTimeout(function () {
        card.classList.add("is-shown");
      }, 60 * i);
    });

    // Filtros
    const filterBtns = qsa(".filter-btn");
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const filter = btn.getAttribute("data-filter");
        filterBtns.forEach(function (b) {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-selected", b === btn ? "true" : "false");
        });

        cards.forEach(function (card, i) {
          const cat = card.getAttribute("data-category");
          const show = filter === "todos" || cat === filter;
          card.classList.remove("is-shown");
          if (show) {
            card.classList.remove("is-hidden");
            setTimeout(function () {
              card.classList.add("is-shown");
            }, 40 * i);
          } else {
            card.classList.add("is-hidden");
          }
        });
      });
    });

    // Botões adicionar
    grid.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-add]");
      if (!btn) return;
      const id = btn.getAttribute("data-add");
      const item = MENU_ITEMS.find(function (m) { return m.id === id; });
      if (item) Cart.add(item);
    });
  }

  /* ---------------------------------------------------------
     CARRINHO (localStorage + drawer + WhatsApp)
     --------------------------------------------------------- */
  const Cart = {
    items: [],

    load: function () {
      try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        this.items = raw ? JSON.parse(raw) : [];
      } catch (err) {
        this.items = [];
      }
      this.render();
      this.updateBadge();
    },

    save: function () {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
      this.render();
      this.updateBadge();
    },

    add: function (product) {
      const existing = this.items.find(function (i) { return i.id === product.id; });
      if (existing) {
        existing.qty += 1;
      } else {
        this.items.push({
          id: product.id,
          nome: product.nome,
          preco: product.preco,
          qty: 1
        });
      }
      this.save();
      showToast("Item adicionado");
      shakeCartFab();
    },

    setQty: function (id, qty) {
      const item = this.items.find(function (i) { return i.id === id; });
      if (!item) return;
      if (qty <= 0) {
        this.remove(id);
        return;
      }
      item.qty = qty;
      this.save();
    },

    remove: function (id) {
      this.items = this.items.filter(function (i) { return i.id !== id; });
      this.save();
    },

    subtotal: function () {
      return this.items.reduce(function (sum, i) {
        return sum + i.preco * i.qty;
      }, 0);
    },

    count: function () {
      return this.items.reduce(function (sum, i) {
        return sum + i.qty;
      }, 0);
    },

    updateBadge: function () {
      const badge = qs("#cartBadge");
      if (badge) badge.textContent = String(this.count());
    },

    render: function () {
      const body = qs("#cartBody");
      const footer = qs("#cartFooter");
      if (!body) return;

      if (this.items.length === 0) {
        body.innerHTML =
          '<div class="cart-empty">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>' +
              '<path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>' +
            "</svg>" +
            "<p>Seu carrinho está vazio.<br>Que tal um smash agora?</p>" +
            '<a class="btn-primary" href="#cardapio" id="cartEmptyCta">Ver cardápio</a>' +
          "</div>";
        if (footer) footer.classList.add("is-empty-hide");

        const cta = qs("#cartEmptyCta");
        if (cta) {
          cta.addEventListener("click", function () {
            closeCart();
          });
        }
        return;
      }

      if (footer) footer.classList.remove("is-empty-hide");

      body.innerHTML = this.items.map(function (item) {
        return (
          '<div class="cart-item" data-cart-id="' + item.id + '">' +
            '<div class="cart-item-name">' + item.nome + "</div>" +
            '<div class="cart-item-price">' + formatBRL(item.preco * item.qty) + "</div>" +
            '<div class="cart-item-controls">' +
              '<button type="button" class="qty-btn" data-qty-minus="' + item.id + '" aria-label="Diminuir quantidade">−</button>' +
              '<span class="qty-value">' + item.qty + "</span>" +
              '<button type="button" class="qty-btn" data-qty-plus="' + item.id + '" aria-label="Aumentar quantidade">+</button>' +
              '<button type="button" class="cart-item-remove" data-remove="' + item.id + '">Remover</button>' +
            "</div>" +
          "</div>"
        );
      }).join("");

      const sub = this.subtotal();
      const subEl = qs("#cartSubtotal");
      const totEl = qs("#cartTotal");
      if (subEl) subEl.textContent = formatBRL(sub);
      if (totEl) totEl.textContent = formatBRL(sub);
    },

    checkoutMessage: function () {
      const obs = (qs("#cartObs") && qs("#cartObs").value.trim()) || "";
      let lines = ["Olá! Quero pedir na *" + LOJA_NOME + "*:", ""];
      this.items.forEach(function (item) {
        lines.push(
          "• " + item.qty + "x " + item.nome + " — " + formatBRL(item.preco * item.qty)
        );
      });
      lines.push("");
      lines.push("*Total: " + formatBRL(this.subtotal()) + "*");
      if (obs) {
        lines.push("");
        lines.push("Observações: " + obs);
      }
      return lines.join("\n");
    }
  };

  function showToast(msg) {
    const toast = qs("#toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toast.classList.remove("is-show");
    }, 2200);
  }

  function shakeCartFab() {
    const fab = qs("#cartFab");
    if (!fab || fab.hidden) return;
    fab.classList.remove("is-shake");
    void fab.offsetWidth;
    fab.classList.add("is-shake");
  }

  function openCart() {
    const drawer = qs("#cartDrawer");
    const overlay = qs("#cartOverlay");
    if (!drawer || !overlay) return;
    overlay.hidden = false;
    requestAnimationFrame(function () {
      overlay.classList.add("is-open");
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
    });
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    const drawer = qs("#cartDrawer");
    const overlay = qs("#cartOverlay");
    if (!drawer || !overlay) return;
    overlay.classList.remove("is-open");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    setTimeout(function () {
      overlay.hidden = true;
    }, 400);
    document.body.style.overflow = "";
  }

  function initCartUI() {
    const fab = qs("#cartFab");
    const hero = qs("#inicio");
    const overlay = qs("#cartOverlay");
    const closeBtn = qs("#cartClose");
    const checkout = qs("#btnCheckout");
    const body = qs("#cartBody");

    // FAB só aparece fora do hero
    if (fab && hero) {
      const fabObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              fab.hidden = true;
            } else {
              fab.hidden = false;
            }
          });
        },
        { threshold: 0.15 }
      );
      fabObserver.observe(hero);
    }

    if (fab) fab.addEventListener("click", openCart);
    if (closeBtn) closeBtn.addEventListener("click", closeCart);
    if (overlay) overlay.addEventListener("click", closeCart);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeCart();
    });

    if (body) {
      body.addEventListener("click", function (e) {
        const minus = e.target.closest("[data-qty-minus]");
        const plus = e.target.closest("[data-qty-plus]");
        const remove = e.target.closest("[data-remove]");
        if (minus) {
          const id = minus.getAttribute("data-qty-minus");
          const item = Cart.items.find(function (i) { return i.id === id; });
          if (item) Cart.setQty(id, item.qty - 1);
        }
        if (plus) {
          const id = plus.getAttribute("data-qty-plus");
          const item = Cart.items.find(function (i) { return i.id === id; });
          if (item) Cart.setQty(id, item.qty + 1);
        }
        if (remove) {
          Cart.remove(remove.getAttribute("data-remove"));
        }
      });
    }

    if (checkout) {
      checkout.addEventListener("click", function () {
        if (Cart.items.length === 0) {
          showToast("Carrinho vazio");
          return;
        }
        const msg = Cart.checkoutMessage();
        window.open(whatsappUrl(msg), "_blank", "noopener,noreferrer");
      });
    }

    Cart.load();
  }

  /* ---------------------------------------------------------
     LINKS WHATSAPP (contato / rodapé)
     --------------------------------------------------------- */
  function initWhatsAppLinks() {
    const msg = "Olá! Gostaria de fazer um pedido na " + LOJA_NOME + " 🍔";
    const url = whatsappUrl(msg);
    const btn = qs("#btnWhatsapp");
    const footer = qs("#footerWhatsapp");
    if (btn) btn.href = url;
    if (footer) footer.href = url;
  }

  /* ---------------------------------------------------------
     FORMULÁRIO DE CONTATO → WhatsApp
     --------------------------------------------------------- */
  function initContactForm() {
    const form = qs("#contatoForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const nome = qs("#formNome").value.trim();
      const telefone = qs("#formTelefone").value.trim();
      const mensagem = qs("#formMensagem").value.trim();

      if (!nome || !telefone || !mensagem) {
        showToast("Preencha todos os campos");
        return;
      }

      const text =
        "Olá! Mensagem pelo site da " + LOJA_NOME + ":\n\n" +
        "Nome: " + nome + "\n" +
        "Telefone: " + telefone + "\n" +
        "Mensagem: " + mensagem;

      window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
      form.reset();
      showToast("Abrindo WhatsApp...");
    });
  }

  /* ---------------------------------------------------------
     CARROSSEL DE AVALIAÇÕES
     --------------------------------------------------------- */
  function initCarousel() {
    const cards = qsa(".testimonial-card");
    const prev = qs("#carouselPrev");
    const next = qs("#carouselNext");
    const dotsWrap = qs("#carouselDots");
    if (!cards.length) return;

    let index = 0;

    if (dotsWrap) {
      dotsWrap.innerHTML = cards.map(function (_, i) {
        return '<button type="button" aria-label="Ir para depoimento ' + (i + 1) + '"' + (i === 0 ? ' class="is-active"' : "") + "></button>";
      }).join("");
    }

    const dots = qsa("button", dotsWrap);

    function goTo(i) {
      index = (i + cards.length) % cards.length;
      cards.forEach(function (card, n) {
        card.classList.toggle("is-active", n === index);
      });
      dots.forEach(function (dot, n) {
        dot.classList.toggle("is-active", n === index);
      });
    }

    if (prev) prev.addEventListener("click", function () { goTo(index - 1); });
    if (next) next.addEventListener("click", function () { goTo(index + 1); });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { goTo(i); });
    });

    // Suporte a swipe em telas touch/mobile
    const track = qs(".testimonials-track") || qs(".testimonials-wrap");
    if (track) {
      let touchStartX = 0;
      track.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      track.addEventListener("touchend", function (e) {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          if (diff < 0) goTo(index + 1);
          else goTo(index - 1);
        }
      }, { passive: true });
    }

    // Autoplay leve
    if (!prefersReducedMotion) {
      setInterval(function () {
        goTo(index + 1);
      }, 5500);
    }
  }

  /* ---------------------------------------------------------
     CONTADORES ANIMADOS
     --------------------------------------------------------- */
  function initCounters() {
    const stats = qs(".stats");
    const nums = qsa("[data-count]");
    if (!nums.length) return;

    function runCounter(el) {
      if (el.dataset.counted === "true") return;
      el.dataset.counted = "true";
      el.classList.add("is-ticking");

      const target = parseFloat(el.getAttribute("data-count"));
      const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      const prefix = el.getAttribute("data-prefix") || "";
      const duration = 1800;
      const startTime = performance.now();

      function formatValue(value) {
        if (decimals > 0) {
          return prefix + value.toFixed(decimals).replace(".", ",");
        }
        return prefix + Math.floor(value).toLocaleString("pt-BR");
      }

      function tick(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentVal = target * eased;

        el.textContent = formatValue(currentVal);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = formatValue(target);
          el.classList.remove("is-ticking");
          el.classList.add("counted");
        }
      }

      requestAnimationFrame(tick);
    }

    function checkVisibility() {
      nums.forEach(function (el) {
        if (el.dataset.counted === "true") return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.95 && rect.bottom >= 0) {
          runCounter(el);
          const item = el.closest(".stat-item");
          if (item) item.classList.add("is-animated");
        }
      });
      if (stats && !stats.classList.contains("is-visible")) {
        const sRect = stats.getBoundingClientRect();
        if (sRect.top <= window.innerHeight * 0.95 && sRect.bottom >= 0) {
          stats.classList.add("is-visible");
        }
      }
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              const el = entry.target.querySelector("[data-count]") || entry.target;
              if (el && el.hasAttribute("data-count")) {
                runCounter(el);
              }
              const item = entry.target.closest(".stat-item") || entry.target;
              if (item) item.classList.add("is-animated");
              if (stats) stats.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
      );

      nums.forEach(function (el) {
        const parent = el.closest(".stat-item") || el;
        observer.observe(parent);
      });
      if (stats) observer.observe(stats);
    }

    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility, { passive: true });
    setTimeout(checkVisibility, 200);
  }

  /* ---------------------------------------------------------
     REVELAÇÃO AO SCROLL (seções)
     --------------------------------------------------------- */
  function initScrollReveal() {
    // Quebra títulos em letras
    qsa("[data-title-reveal]").forEach(function (title) {
      const text = title.textContent.trim();
      title.textContent = "";
      text.split("").forEach(function (ch, i) {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = ch === " " ? "\u00A0" : ch;
        span.style.transitionDelay = (0.03 * i) + "s";
        title.appendChild(span);
      });
    });

    const animatables = qsa("[data-animate], [data-title-reveal]");
    if (!animatables.length) return;

    if (prefersReducedMotion) {
      animatables.forEach(function (el) {
        el.classList.add("is-visible", "is-revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("is-visible");
          if (el.hasAttribute("data-title-reveal")) {
            el.classList.add("is-revealed");
          }
          // Stagger em filhos data-animate dentro do mesmo bloco
          const children = qsa("[data-animate]", el);
          children.forEach(function (child, i) {
            setTimeout(function () {
              child.classList.add("is-visible");
            }, 100 * (i + 1));
          });
          observer.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    animatables.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------
     PARALLAX — mouse (desktop) + scroll
     --------------------------------------------------------- */
  function initParallax() {
    if (prefersReducedMotion) return;

    const hero = qs("#inicio");
    if (!hero) return;

    const parallaxEls = qsa("[data-parallax]", hero);
    const burgerWrap = qs("#burgerWrap");
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    if (isFinePointer) {
      hero.addEventListener("mousemove", function (e) {
        const rect = hero.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      });
    }

    function frame() {
      currentX += (mouseX - currentX) * 0.06;
      currentY += (mouseY - currentY) * 0.06;

      const scrollY = window.scrollY;
      const heroH = hero.offsetHeight;
      const progress = Math.min(1, Math.max(0, scrollY / heroH));

      parallaxEls.forEach(function (el) {
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0.05;
        const mx = currentX * speed * 40;
        const my = currentY * speed * 30;
        const sy = scrollY * speed * 0.35;
        el.style.transform = "translate3d(" + mx + "px, " + (my + sy) + "px, 0)";
      });

      // Burger se afasta e diminui ao rolar para fora do hero
      if (burgerWrap) {
        const scale = 1 - progress * 0.18;
        const ty = progress * 40;
        // Mantém o centramento base via left/top do CSS; aplica só o offset extra
        burgerWrap.style.setProperty("--scroll-scale", String(scale));
        if (!burgerWrap.classList.contains("has-entered")) {
          // Após a animação de entrada, assume controle do transform
        }
        // Aplica scale/translate adicionais via filter-friendly approach
        const float = qs(".burger-float", burgerWrap);
        if (float && progress > 0.02) {
          float.style.transform =
            "translateY(" + (-15 * (1 - progress) * Math.sin(Date.now() / 600) * 0) + "px) scale(" + scale + ") translateY(" + ty + "px)";
          if (progress > 0.05) {
            float.style.animation = "none";
          }
        }
        if (progress <= 0.02 && float) {
          float.style.animation = "";
          float.style.transform = "";
        }
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------
     CURSOR PERSONALIZADO
     --------------------------------------------------------- */
  function initCursor() {
    if (!isFinePointer || prefersReducedMotion) return;

    const ring = qs("#customCursor");
    const dot = qs("#customCursorDot");
    if (!ring || !dot) return;

    document.body.classList.add("has-custom-cursor");

    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;

    document.addEventListener("mousemove", function (e) {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = "translate(" + x + "px, " + y + "px) translate(-50%, -50%)";
    });

    function loop() {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = "translate(" + rx + "px, " + ry + "px) translate(-50%, -50%)";
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    document.addEventListener("mouseover", function (e) {
      if (e.target.closest("a, button, .btn-add, .filter-btn, .magnetic")) {
        ring.classList.add("is-hover");
      }
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest("a, button, .btn-add, .filter-btn, .magnetic")) {
        ring.classList.remove("is-hover");
      }
    });
  }

  /* ---------------------------------------------------------
     BOTÕES MAGNÉTICOS
     --------------------------------------------------------- */
  function initMagnetic() {
    if (!isFinePointer || prefersReducedMotion) return;

    qsa(".magnetic").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        const rect = btn.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = "translate(" + dx * 0.18 + "px, " + dy * 0.22 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ---------------------------------------------------------
     MOTOBOY — usa o SVG branco direto (sem fundo)
     --------------------------------------------------------- */
  function initMotoboy() {
    /* arquivo motoboy.svg já é o ícone final; nada a injetar */
  }
  function initYear() {
    const year = qs("#year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* ---------------------------------------------------------
     BOOT
     --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initPreloader();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initMenu();
    initCartUI();
    initWhatsAppLinks();
    initContactForm();
    initCarousel();
    initCounters();
    initScrollReveal();
    initParallax();
    initCursor();
    initMagnetic();
    initMotoboy();
    initYear();
  });
})();
