/* ============================================================
   ХААИС — Оюутны зоогийн газар
   script.js — бүх хуудаст ашиглагдах нэгдсэн скрипт
   Хуудас бүр <body data-page="..."> тэмдэглэгээгээр хуваарилагдана
   ============================================================ */

if (!window.__haaisBooted) {
    window.__haaisBooted = true;
    (function () {
        "use strict";

        const PAGE = document.body ? (document.body.dataset.page || "index") : "index";
        const PAGES = ["index.html", "menu.html", "favorites.html", "cart.html", "checkout.html", "orders.html", "profile.html", "login.html", "about.html", "contact.html"];

        /* ---------- Хоолны өгөгдөл ---------- */
        const foods = [
            { id: 1, name: "Өглөөний сет", category: "Өглөөний цай", price: 7500, oldPrice: 8500, rating: 4.8, time: "10–15 мин", calories: 520, featured: true, image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=85", description: "Өндөг, хэмх, талх, шинэ ногоо болон халуун цай." },
            { id: 2, name: "Бууз", category: "Үндсэн хоол", price: 9500, rating: 4.9, time: "10–15 мин", calories: 480, featured: true, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSluXbIOTTGC-AS9T7lDnNWvLIUW8iXJvbGEy-6VevGNQ&s=10", description: "Гар хийцийн жигнэсэн махтай, ногоотой амттай бууз." },
            { id: 3, name: "Монгол цуйван", category: "Үндсэн хоол", price: 15000, oldPrice: 17000, rating: 4.8, time: "15–20 мин", calories: 690, featured: true, image: "https://correctmongolia.com/wp-content/uploads/2023/03/tsuivan-recipe.jpg", description: "Гурил, мах болон шинэ ногоотой монгол цуйван." },
            { id: 4, name: "Банштай шөл", category: "Шөл", price: 9000, rating: 4.7, time: "10–15 мин", calories: 390, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8y93W7NCO-N5m0hVyswoPA3jJDH0KjdzfAC3Q5xh6mg&s=10", description: "Дулаахан, амттай гар хийцийн банштай ногоотой шөл." },
            { id: 5, name: "Ногоотой хуурга", category: "Үндсэн хоол", price: 10500, rating: 4.6, time: "15–20 мин", calories: 610, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZU7h63q4QbAM0Oer4Xi4zJ-qwS5nTRdtL3DfbnwtG8w&s=10", description: "Шинэ ногоо, мах бүхий тэжээллэг эрүүл хоол." },
            { id: 6, name: "Будаатай шөл", category: "Шөл", price: 9500, rating: 4.7, time: "10–15 мин", calories: 430, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxe9G8_mHL91nvLjE6FhxavIOQzZTAjg6YlneQuy8XyQ&s=10", description: "Ногоо, лууван, сонгиноор тэжээллэг болсон халуун шөл." },
            { id: 7, name: "Сүүтэй цай", category: "Ундаа", price: 1800, rating: 4.9, time: "5 мин", calories: 120, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ_CVVX7ds-2ekJEYwddrBrcvay3D9wMtXXfPsod3Exg&s=10", description: "Монгол уламжлалт сүүтэй цай, бага зэрэг давстай." },
            { id: 8, name: "Жимсний смүүти", category: "Ундаа", price: 5500, rating: 4.8, time: "5–10 мин", calories: 260, image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=900&q=85", description: "Шинэ жимсээр хийсэн аминдэмтэй, хүйтэн смүүти." },
            { id: 9, name: "Өндөгтэй шарсан талх", category: "Өглөөний цай", price: 5500, rating: 4.6, time: "8–12 мин", calories: 470, image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85", description: "Өндөг, шарсан талх, ногоо бүхий амттай өглөөний хоол." },
            { id: 10, name: "Будаатай хуурга", category: "Үндсэн хоол", price: 9000, rating: 4.7, time: "15–20 мин", calories: 720, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85", description: "Мах, будаа болон шинэ ногоотой амттай хуурга." },
            { id: 11, name: "Тахианы шарсан мах", category: "Үндсэн хоол", price: 12500, oldPrice: 14500, rating: 4.9, time: "15–20 мин", calories: 660, image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85", description: "Шарсан тахиа, төмс болон шинэ ногооны амттай хачир." },
            { id: 12, name: "Махтай будаатай шөл", category: "Шөл", price: 10500, rating: 4.8, time: "10–15 мин", calories: 510, image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85", description: "Мах, будаа, лууван болон сонгинотой тэжээллэг шөл." },
            { id: 13, name: "Грек салат", category: "Салат", price: 9000, rating: 4.6, time: "5–10 мин", calories: 340, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIfbi3HJi8V_-qy8YFcqRTRNI6a23_BQ4BPTJ8pC7oNw&s=10", description: "Шинэ ногоо, бяслаг болон хөнгөн соустай грек салат." },
            { id: 14, name: "Тахианы салат", category: "Салат", price: 10000, oldPrice: 11800, rating: 4.8, time: "8–12 мин", calories: 380, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5XdrV-DbAoWosY17bao7rmOXbTiGyuPfuF3UuUL3pVw&s=10", description: "Тахианы цээж мах, салат навч, ногоо болон тусгай соус." },
            { id: 15, name: "Шоколадтай бялуу", category: "Амттан", price: 4500, rating: 4.8, time: "5 мин", calories: 410, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85", description: "Зөөлөн шоколадтай, амттай бялуу." },
            { id: 16, name: "Алимтай пирог", category: "Амттан", price: 5000, rating: 4.6, time: "5 мин", calories: 350, image: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?auto=format&fit=crop&w=900&q=85", description: "Шинэхэн алимтай, хөнгөн амттай пирог." },
            { id: 17, name: "Капучино", category: "Ундаа", price: 7500, rating: 4.7, time: "5–8 мин", calories: 180, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85", description: "Сүүтэй, зөөлөн амттай халуун капучино." },
            { id: 18, name: "Хүйтэн кофе", category: "Ундаа", price: 5000, rating: 4.8, time: "5–8 мин", calories: 10, image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=85", description: "Сэрүүцүүлэх, сэргээгч хүйтэн кофе." },
            { id: 19, name: "Жимсний салат", category: "Салат", price: 7000, rating: 4.7, time: "5 мин", calories: 220, image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=900&q=85", description: "Шинэ улирлын жимсээр хийсэн аминдэмтэй салат." },
            { id: 20, name: "Шарсан төмстэй стейк", category: "Үндсэн хоол", price: 20000, oldPrice: 25000, rating: 4.9, time: "20–25 мин", calories: 780, image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85", description: "Зөөлөн мах, шарсан төмс болон шинэ ногооны хачир." },
            { id: 21, name: "Төмсний нухаштай тахиа", category: "Үндсэн хоол", price: 12500, rating: 4.7, time: "15–20 мин", calories: 590, image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85", description: "Зөөлөн тахиа, төмсний нухаш болон ногооны хачир." },
            { id: 22, name: "Банш", category: "Үндсэн хоол", price: 7000, rating: 4.8, time: "10–15 мин", calories: 450, image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=85", description: "Шинэхэн махтай гар хийцийн сонгинотой банш." },
            { id: 23, name: "Тарагтай жимс", category: "Өглөөний цай", price: 4500, rating: 4.7, time: "5 мин", calories: 290, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85", description: "Тараг, шинэ жимс болон үр тарианы хөнгөн сонголт." },
            { id: 24, name: "Ногоон смүүти", category: "Ундаа", price: 6000, rating: 4.7, time: "5–10 мин", calories: 240, image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=900&q=85", description: "Жимс, ногоо болон тарагтай эрүүл ногоон смүүти." }
        ];

        const categories = ["Бүгд", "Өглөөний цай", "Үндсэн хоол", "Шөл", "Салат", "Амттан", "Ундаа"];
        const couponCodes = { STUDENT10: { rate: 0.10, label: "10%" }, HA2026: { rate: 0.15, label: "15%" } };
        const PICKUP_SPOTS = ["Дархан ХААИС"];
        const PICKUP_TIMES = ["11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"];

        /* ---------- Хадгалах туслах ---------- */
        const storage = {
            get(key, fallback) {
                try {
                    const value = localStorage.getItem(key);
                    return value ? JSON.parse(value) : fallback;
                } catch (error) {
                    return fallback;
                }
            },
            set(key, value) {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                } catch (error) {
                    showToast("Хадгалж чадсангүй. Хувийн режимыг шалгана уу.", "error");
                }
            },
            remove(key) {
                try { localStorage.removeItem(key); } catch (error) {}
            }
        };

        const state = {
            cart: (function () {
                const saved = storage.get("haaisCart", []);
                return Array.isArray(saved)
                    ? saved.filter(item => foods.some(food => food.id === Number(item.id)) && Number(item.qty) > 0)
                        .map(item => ({ id: Number(item.id), qty: Math.max(1, Math.min(20, Math.floor(Number(item.qty) || 1))) }))
                    : [];
            })(),
            favorites: (function () {
                const saved = storage.get("haaisFavorites", []);
                return Array.isArray(saved) ? [...new Set(saved.map(Number))].filter(id => foods.some(food => food.id === id)) : [];
            })(),
            user: storage.get("haaisUser", null),
            users: Array.isArray(storage.get("haaisUsers", [])) ? storage.get("haaisUsers", []) : [],
            orders: Array.isArray(storage.get("haaisOrders", [])) ? storage.get("haaisOrders", []) : [],
            coupon: storage.get("haaisCoupon", ""),
            currentCategory: "Бүгд",
            query: "",
            sortBy: "default",
            maxPrice: 0,
            discountRate: 0,
            paymentMethod: "cash",
            pickupDate: "",
            pickupTime: ""
        };

        /* Нэвтэрсэн мэдээллийг шалгана: нэр болон оюутны код шаардлагатай */
        if (state.user && (typeof state.user !== "object" || !state.user.name || !state.user.studentId)) state.user = null;
        if (state.coupon && couponCodes[state.coupon]) state.discountRate = couponCodes[state.coupon].rate;
        else { state.coupon = ""; state.discountRate = 0; }

        function saveCart() { storage.set("haaisCart", state.cart); }
        function saveFavorites() { storage.set("haaisFavorites", state.favorites); }
        function saveCoupon() {
            if (state.coupon) storage.set("haaisCoupon", state.coupon);
            else storage.remove("haaisCoupon");
        }

        /* ---------- Туслах функцууд ---------- */
        function icon(name, className = "icon") {
            return `<svg class="${className}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
        }

        function formatPrice(value) {
            return new Intl.NumberFormat("mn-MN").format(Math.max(0, Math.round(value)));
        }

        function escapeHTML(value) {
            return String(value).replace(/[&<>'"]/g, character => ({
                "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;"
            })[character]);
        }

        function getFood(id) {
            return foods.find(food => food.id === Number(id));
        }

        function cartCount() {
            return state.cart.reduce((sum, item) => sum + item.qty, 0);
        }

        function getSubtotal() {
            return state.cart.reduce((sum, item) => {
                const food = getFood(item.id);
                return food ? sum + food.price * item.qty : sum;
            }, 0);
        }

        function getDiscount(subtotal = getSubtotal()) {
            return Math.round(subtotal * state.discountRate);
        }

        function getTotal() {
            const subtotal = getSubtotal();
            return Math.max(0, subtotal - getDiscount(subtotal));
        }

        function discountPercent(food) {
            return food.oldPrice ? Math.round((1 - food.price / food.oldPrice) * 100) : 0;
        }

        function highlightHTML(text, query) {
            const escaped = escapeHTML(text);
            const normalized = query.trim().toLowerCase();
            if (!normalized) return escaped;
            try {
                const pattern = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                return escaped.replace(new RegExp(`(${pattern})`, "gi"), "<mark>$1</mark>");
            } catch (error) {
                return escaped;
            }
        }

        function showToast(message, type = "success") {
            const region = document.getElementById("toastRegion");
            if (!region) return;
            const toast = document.createElement("div");
            toast.className = `toast${type === "error" ? " error" : ""}`;
            toast.innerHTML = `<span class="toast-icon">${icon(type === "error" ? "alert" : "check")}</span>
                <p>${escapeHTML(message)}</p>
                <button type="button" aria-label="Хаах">${icon("close")}</button>`;
            region.appendChild(toast);
            let removed = false;
            const remove = () => {
                if (removed) return;
                removed = true;
                toast.classList.add("removing");
                window.setTimeout(() => toast.remove(), 240);
            };
            toast.querySelector("button").addEventListener("click", remove);
            window.setTimeout(remove, 3800);
        }

        function safeRedirectTarget() {
            const target = new URLSearchParams(window.location.search).get("redirect");
            if (target && PAGES.includes(target)) return target;
            return "profile.html";
        }

        function requireAuth(pageKey) {
            if (state.user) return true;
            window.location.replace(`login.html?redirect=${encodeURIComponent(pageKey)}`);
            return false;
        }

        function avatarOrInitials(user, className) {
            if (user && user.avatar) {
                return `<span class="${className} has-photo"><img src="${user.avatar}" alt="${escapeHTML(user.name)}"></span>`;
            }
            const initials = (user ? user.name : "")
                .split(/\s+/)
                .slice(0, 2)
                .map(part => part[0] || "")
                .join("")
                .toUpperCase();
            return `<span class="${className}">${escapeHTML(initials)}</span>`;
        }

        /* ---------- Толгой (header) нийтлэг ажиллагаа ---------- */
        function updateCartBadge() {
            const badge = document.getElementById("cartBadge");
            if (!badge) return;
            const count = cartCount();
            badge.textContent = count > 99 ? "99+" : String(count);
            badge.hidden = count === 0;
        }

        function updateAccountButton() {
            const accountButton = document.getElementById("accountButton");
            if (!accountButton) return;
            if (state.user) {
                const avatarHTML = state.user.avatar
                    ? `<span class="account-avatar"><img src="${state.user.avatar}" alt=""></span>`
                    : `<svg class="icon"><use href="#icon-user"></use></svg>`;
                accountButton.innerHTML = `${avatarHTML}<span class="account-name">${escapeHTML(state.user.name)}</span>`;
                accountButton.setAttribute("aria-label", `${state.user.name}-ийн профайл`);
                accountButton.setAttribute("href", "profile.html");
            } else {
                accountButton.innerHTML = `<svg class="icon"><use href="#icon-user"></use></svg><span class="account-name">Нэвтрэх</span>`;
                accountButton.setAttribute("aria-label", "Бүртгэл ба нэвтрэх");
                accountButton.setAttribute("href", "login.html");
            }
        }

        function setupHeader() {
            document.querySelectorAll(".main-nav .nav-link[href]").forEach(link => {
                const href = link.getAttribute("href").split("#")[0];
                if (href === `${PAGE === "index" ? "index" : PAGE}.html` || href === `${PAGE}.html`) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });

            const mobileButton = document.getElementById("mobileMenuButton");
            const header = document.getElementById("siteHeader");
            if (mobileButton && header) {
                mobileButton.addEventListener("click", () => {
                    const opened = header.classList.toggle("nav-open");
                    mobileButton.setAttribute("aria-expanded", String(opened));
                });
            }
            if (header) {
                const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
                window.addEventListener("scroll", onScroll, { passive: true });
                onScroll();
            }
            window.addEventListener("resize", () => {
                if (window.innerWidth > 980 && header) header.classList.remove("nav-open");
            });

            updateCartBadge();
            updateAccountButton();
            loadCustomLogo();
        }

        function toggleTheme() {
            const dark = document.documentElement.classList.toggle("dark");
            storage.set("haaisTheme", dark ? "dark" : "light");
            const button = document.getElementById("themeButton");
            if (button) button.setAttribute("aria-label", dark ? "Гэрэлтэй горимд шилжих" : "Харанхуй горимд шилжих");
        }

        function loadCustomLogo() {
            if (window.__haaisLogoTried) return;
            window.__haaisLogoTried = true;
            const logo = new window.Image();
            logo.onload = () => {
                document.querySelectorAll(".brand-mark").forEach(mark => {
                    mark.classList.add("has-logo");
                    mark.innerHTML = `<img src="assets/logo.png" alt="ХААИС лого" class="brand-logo">`;
                });
            };
            logo.src = "assets/logo.png";
        }

        function setupThemeButton() {
            const themeButton = document.getElementById("themeButton");
            if (!themeButton) return;
            const dark = document.documentElement.classList.contains("dark");
            themeButton.setAttribute("aria-label", dark ? "Гэрэлтэй горимд шилжих" : "Харанхуй горимд шилжих");
            themeButton.addEventListener("click", toggleTheme);
        }
        /* ---------- Сагс, дуртай, барааны үйлдлүүд ---------- */
        function addToCart(id) {
            const food = getFood(id);
            if (!food) return;
            const item = state.cart.find(cartItem => cartItem.id === food.id);
            if (item) {
                if (item.qty >= 20) {
                    showToast("Нэг хоолоос хамгийн ихдээ 20 ширхэг авч болно.", "error");
                    return;
                }
                item.qty += 1;
            } else {
                state.cart.push({ id: food.id, qty: 1 });
            }
            saveCart();
            updateCartBadge();
            if (PAGE === "cart") renderCartPage();
            toastWithCartLink(`${food.name} сагсанд нэмэгдлээ.`);
        }

        function changeQuantity(id, amount) {
            const item = state.cart.find(cartItem => cartItem.id === Number(id));
            if (!item) return;
            item.qty += amount;
            if (item.qty <= 0) {
                state.cart = state.cart.filter(cartItem => cartItem.id !== Number(id));
            } else if (item.qty > 20) {
                item.qty = 20;
                showToast("Хамгийн ихдэе 20 ширхэг.", "error");
            }
            saveCart();
            updateCartBadge();
            renderCartPage();
        }

        function removeFromCart(id) {
            const food = getFood(id);
            state.cart = state.cart.filter(item => item.id !== Number(id));
            saveCart();
            updateCartBadge();
            renderCartPage();
            if (food) showToast(`${food.name} сагснаас хасагдлаа.`);
        }

        function syncFavoriteButtons(id) {
            const active = state.favorites.includes(Number(id));
            document.querySelectorAll(`[data-favorite="${Number(id)}"]`).forEach(button => {
                button.classList.toggle("active", active);
                button.setAttribute("aria-label", active ? "Таалагдасан хасах" : "Таалагдасан нэмэх");
            });
        }

        function toggleFavorite(id) {
            const food = getFood(id);
            if (!food) return;
            const index = state.favorites.indexOf(food.id);
            if (index >= 0) {
                state.favorites.splice(index, 1);
                showToast(`${food.name} Таалагдасан хоолноос хасагдлаа.`);
            } else {
                state.favorites.push(food.id);
                showToast(`${food.name} Таалагдасан хоолд нэмэгдлээ.`);
            }
            saveFavorites();
            syncFavoriteButtons(food.id);
            if (PAGE === "favorites") renderFavoritesPage();
        }

        function applyCoupon(code) {
            const normalized = String(code || "").trim().toUpperCase();
            if (!normalized) {
                state.coupon = "";
                state.discountRate = 0;
                saveCoupon();
                showToast("Урамшуулын код ариллаа.");
                if (PAGE === "cart") renderCartPage();
                return;
            }
            if (!couponCodes[normalized]) {
                showToast("Урамшуулын код буруу байна.", "error");
                return;
            }
            state.coupon = normalized;
            state.discountRate = couponCodes[normalized].rate;
            saveCoupon();
            showToast(`${normalized} кодоор ${couponCodes[normalized].label} хямдрал хэрэглэгдлээ.`);
            if (PAGE === "cart") renderCartPage();
        }

        function toastWithCartLink(message) {
            const region = document.getElementById("toastRegion");
            if (!region) {
                showToast(message);
                return;
            }
            const toast = document.createElement("div");
            toast.className = "toast";
            toast.innerHTML = `<span class="toast-icon">${icon("check")}</span>
                <p>${escapeHTML(message)}</p>
                <a class="toast-link" href="cart.html">Сагс</a>`;
            region.appendChild(toast);
            let removed = false;
            const remove = () => {
                if (removed) return;
                removed = true;
                toast.classList.add("removing");
                window.setTimeout(() => toast.remove(), 240);
            };
            window.setTimeout(remove, 4200);
        }

        /* ---------- Анимацтай категорийн шилжүүлгэ ---------- */
        function switchMenuWithAnimation() {
            const grid = document.getElementById("menuGrid");
            if (!grid) {
                if (PAGE === "menu") renderMenuGrid();
                return;
            }
            grid.classList.add("is-switching");
            window.setTimeout(() => {
                renderMenuGrid();
                grid.classList.remove("is-switching");
            }, 180);
        }

        function setCategory(category, shouldScroll = false) {
            if (!categories.includes(category)) return;
            state.currentCategory = category;
            renderCategoryChips();
            switchMenuWithAnimation();
            closeMobileNav();
            if (shouldScroll) {
                const menu = document.getElementById("menu");
                if (menu) menu.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }

        function closeMobileNav() {
            const header = document.getElementById("siteHeader");
            if (header) header.classList.remove("nav-open");
        }

        /* ---------- Нийтлэг товчны үйлдлүүд (бүх хуудас) ---------- */
        document.addEventListener("click", event => {
            const target = event.target instanceof Element ? event.target : null;
            if (!target) return;

            const closeButton = target.closest("[data-close-overlay]");
            if (closeButton) {
                const overlay = closeButton.closest(".overlay");
                if (overlay) overlay.classList.remove("show");
                document.body.classList.remove("no-scroll");
                return;
            }

            if (target.classList.contains("overlay")) {
                target.classList.remove("show");
                document.body.classList.remove("no-scroll");
                return;
            }

            const addButton = target.closest("[data-add]");
            if (addButton) {
                event.preventDefault();
                event.stopPropagation();
                addToCart(addButton.dataset.add);
                return;
            }

            const favoriteButton = target.closest("[data-favorite]");
            if (favoriteButton) {
                event.preventDefault();
                event.stopPropagation();
                toggleFavorite(favoriteButton.dataset.favorite);
                return;
            }

            const detailTarget = target.closest("[data-detail-id]");
            if (detailTarget) {
                event.preventDefault();
                showDetails(detailTarget.dataset.detailId);
                return;
            }

            const categoryButton = target.closest("[data-category]");
            if (categoryButton) {
                event.preventDefault();
                setCategory(categoryButton.dataset.category);
                return;
            }

            if (target.closest("[data-reset-filters]")) {
                event.preventDefault();
                state.query = "";
                state.sortBy = "default";
                state.maxPrice = 0;
                const search = document.getElementById("foodSearch");
                const sortSelect = document.getElementById("sortSelect");
                const priceFilter = document.getElementById("priceFilter");
                if (search) search.value = "";
                if (sortSelect) sortSelect.value = "default";
                if (priceFilter) priceFilter.value = "0";
                setCategory("Бүгд");
                return;
            }

            if (target.closest("#searchClear")) {
                event.preventDefault();
                state.query = "";
                const search = document.getElementById("foodSearch");
                if (search) {
                    search.value = "";
                    search.focus();
                }
                const clear = document.getElementById("searchClear");
                if (clear) clear.classList.remove("visible");
                renderMenuGrid();
                return;
            }

            const quantityButton = target.closest("[data-qty]");
            if (quantityButton) {
                event.preventDefault();
                changeQuantity(quantityButton.dataset.qty, Number(quantityButton.dataset.amount) || 0);
                return;
            }

            const removeButton = target.closest("[data-remove]");
            if (removeButton) {
                event.preventDefault();
                removeFromCart(removeButton.dataset.remove);
                return;
            }

            const timeChip = target.closest("[data-pickup-time]");
            if (timeChip) {
                event.preventDefault();
                state.pickupTime = timeChip.dataset.pickupTime || "";
                document.querySelectorAll(".time-chip").forEach(chip => {
                    chip.classList.toggle("active", chip.dataset.pickupTime === state.pickupTime);
                });
                const grid = document.getElementById("pickupTimeGrid");
                if (grid) grid.classList.remove("invalid");
                return;
            }

            const paymentButton = target.closest("[data-payment]");
            if (paymentButton) {
                event.preventDefault();
                state.paymentMethod = paymentButton.dataset.payment || "cash";
                document.querySelectorAll("[data-payment]").forEach(button => {
                    button.classList.toggle("active", button.dataset.payment === state.paymentMethod);
                });
                return;
            }

            const authTab = target.closest("[data-auth-tab]");
            if (authTab) {
                event.preventDefault();
                setAuthTab(authTab.dataset.authTab);
                return;
            }

            if (target.closest("[data-avatar-pick]")) {
                event.preventDefault();
                const input = document.getElementById("avatarInput");
                if (input) input.click();
                return;
            }

            if (target.closest("[data-avatar-reset]")) {
                event.preventDefault();
                clearAvatar();
                return;
            }

            if (target.closest("[data-logout]")) {
                event.preventDefault();
                logout();
                return;
            }
        });

        document.addEventListener("change", event => {
            if (event.target.matches("#avatarInput")) {
                applyAvatarImage(event.target.files[0]);
                event.target.value = "";
            }
        });

        /* ---------- Нийтлэг хуудасны функциуд ---------- */
        function logout() {
            state.user = null;
            storage.remove("haaisUser");
            showToast("Та системээс гарлаа.");
            window.setTimeout(() => { window.location.href = "index.html"; }, 600);
        }

        function setAuthTab(tab) {
            const loginForm = document.getElementById("loginForm");
            const registerForm = document.getElementById("registerForm");
            document.querySelectorAll(".auth-tab").forEach(button => {
                const active = button.dataset.authTab === tab;
                button.classList.toggle("active", active);
                button.setAttribute("aria-selected", String(active));
            });
            if (loginForm) loginForm.hidden = tab !== "login";
            if (registerForm) registerForm.hidden = tab !== "register";
        }

        /* ============================================================
           PAGE 3 — Хуудас тус бүрийн логик
           ============================================================ */

        /* ---------- Нийтлэг туслах ---------- */
        function todayISO() {
            const now = new Date();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            return `${now.getFullYear()}-${month}-${day}`;
        }

        function formatDate(isoValue) {
            const date = new Date(isoValue);
            if (Number.isNaN(date.getTime())) return "";
            return date.toLocaleDateString("mn-MN", { year: "numeric", month: "long", day: "numeric" });
        }

        function formatDateTime(isoValue) {
            const date = new Date(isoValue);
            if (Number.isNaN(date.getTime())) return "";
            return `${formatDate(isoValue)} · ${date.toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit" })}`;
        }

        /* Нууц үгийг шифрлэн хадгална (демо зэрэглэлийн энгийн шифр) */
        function hashPassword(password) {
            const text = `haais::${password}`;
            let hash = 0x811c9dc5;
            for (let i = 0; i < text.length; i += 1) {
                hash ^= text.charCodeAt(i);
                hash = Math.imul(hash, 0x01000193) >>> 0;
            }
            return `h1:${hash.toString(36)}:${(text.length % 10007).toString(36)}`;
        }

        function findUserByStudentCode(studentId) {
            const normalized = String(studentId || "").trim().toLowerCase();
            return state.users.find(user => typeof user.studentId === "string" && user.studentId.trim().toLowerCase() === normalized) || null;
        }

        function saveUsers() { storage.set("haaisUsers", state.users); }

        function verifyPassword(record, password) {
            if (!record || typeof record.password !== "string") return false;
            if (record.password.startsWith("h1:")) return record.password === hashPassword(password);
            /* Хуучин түр бүртгэлийг шинэ шифрлэлт рүү шилжүүлнэ */
            if (record.password === password) {
                record.password = hashPassword(password);
                saveUsers();
                return true;
            }
            return false;
        }

        function initialsOf(name) {
            return String(name || "")
                .split(/\s+/)
                .slice(0, 2)
                .map(part => part[0] || "")
                .join("")
                .toUpperCase();
        }

        /* ============================================================
           Меню хуудас (menu.html)
           ============================================================ */
        function menuFiltered() {
            let list = foods.slice();
            if (state.currentCategory !== "Бүгд") {
                list = list.filter(food => food.category === state.currentCategory);
            }
            const query = state.query.trim().toLowerCase();
            if (query) {
                list = list.filter(food =>
                    `${food.name} ${food.description} ${food.category}`.toLowerCase().includes(query));
            }
            if (state.maxPrice > 0) {
                list = list.filter(food => food.price <= state.maxPrice);
            }
            switch (state.sortBy) {
                case "price-asc": list.sort((a, b) => a.price - b.price); break;
                case "price-desc": list.sort((a, b) => b.price - a.price); break;
                case "rating": list.sort((a, b) => b.rating - a.rating); break;
                default: break;
            }
            return list;
        }

        function menuCardHTML(food) {
            const sale = Boolean(food.oldPrice);
            return `
            <article class="menu-card">
                <div class="menu-image">
                    <img src="${food.image}" alt="${escapeHTML(food.name)}" loading="lazy">
                    <div class="menu-badges">
                        ${sale ? `<span class="pill pill-sale">-${discountPercent(food)}%</span>` : ""}
                        ${food.featured ? `<span class="pill pill-popular">${icon("sparkles")} Онцлох</span>` : ""}
                    </div>
                    <button class="favorite-button" type="button" data-favorite="${food.id}" aria-label="Дуртайд нэмэх">${icon("heart")}</button>
                </div>
                <div class="menu-body">
                    <div class="menu-title-row">
                        <h3>${highlightHTML(food.name, state.query)}</h3>
                        <strong class="price">${formatPrice(food.price)}₮ ${sale ? `<del>${formatPrice(food.oldPrice)}₮</del>` : ""}</strong>
                    </div>
                    <p class="menu-description">${highlightHTML(food.description, state.query)}</p>
                    <div class="menu-meta">
                        <span>${icon("star")} ${food.rating}</span>
                        <span>${icon("clock")} ${escapeHTML(food.time)}</span>
                        <span class="meta-dot">${escapeHTML(food.category)}</span>
                    </div>
                    <div class="menu-footer">
                        <button class="details-button" type="button" data-detail-id="${food.id}">Дэлгэрэнгүй ${icon("arrow")}</button>
                        <button class="quick-add" type="button" data-add="${food.id}" aria-label="${escapeHTML(food.name)} сагслах">${icon("bag")}</button>
                    </div>
                </div>
            </article>`;
        }

        function renderMenuGrid() {
            const grid = document.getElementById("menuGrid");
            if (!grid || PAGE !== "menu") return;
            const list = menuFiltered();
            const resultCount = document.getElementById("resultCount");
            if (resultCount) resultCount.textContent = `${list.length} хоол олдлоо`;
            if (!list.length) {
                grid.innerHTML = `
                <div class="empty-state wide">
                    <div class="empty-visual">${icon("search")}</div>
                    <h3>Хайсан хоол олдсонгүй</h3>
                    <p>Өөр түлхүүр үг, ангилал эсвэл үнийн шүүлтээр дахин хайж үзээрэй.</p>
                    <button class="secondary-button" type="button" data-reset-filters>Шүүлтийг арилгах</button>
                </div>`;
                return;
            }
            grid.innerHTML = list.map(menuCardHTML).join("");
            list.forEach(food => syncFavoriteButtons(food.id));
        }

        function renderCategoryChips() {
            const list = document.getElementById("categoryList");
            if (!list) return;
            list.innerHTML = categories.map(category => {
                const count = category === "Бүгд"
                    ? foods.length
                    : foods.filter(food => food.category === category).length;
                return `<button class="category-chip${state.currentCategory === category ? " active" : ""}" type="button" data-category="${escapeHTML(category)}">${escapeHTML(category)} <span class="count">${count}</span></button>`;
            }).join("");
        }

        function showDetails(id) {
            const food = getFood(id);
            if (!food) return;
            const overlay = document.getElementById("detailOverlay");
            const content = document.getElementById("detailContent");
            if (!overlay || !content) return;
            const sale = Boolean(food.oldPrice);
            content.innerHTML = `
                <div class="detail-image"><img src="${food.image}" alt="${escapeHTML(food.name)}" loading="lazy"></div>
                <div class="detail-title-row">
                    <h2 id="detailTitle">${highlightHTML(food.name, state.query)}</h2>
                    <strong class="detail-price">${formatPrice(food.price)}₮ ${sale ? `<del>${formatPrice(food.oldPrice)}₮</del>` : ""}</strong>
                </div>
                <p class="detail-description">${escapeHTML(food.description)}</p>
                <div class="detail-meta">
                    <span class="detail-tag">${icon("star")} ${food.rating} үнэлгээ</span>
                    <span class="detail-tag">${icon("clock")} ${escapeHTML(food.time)} мин. хугацаа</span>
                    <span class="detail-tag">${icon("leaf")} ${food.calories} ккал</span>
                    <span class="detail-tag">${escapeHTML(food.category)}</span>
                </div>
                <div class="detail-actions">
                    <button class="primary-button" type="button" data-add="${food.id}">${icon("plus")} Сагсанд нэмэх</button>
                    <button class="fav-chip" type="button" data-favorite="${food.id}">${icon("heart")} Дуртайд нэмэх</button>
                </div>`;
            overlay.classList.add("show");
            document.body.classList.add("no-scroll");
            syncFavoriteButtons(food.id);
        }

        function initMenu() {
            const categoryParam = new URLSearchParams(window.location.search).get("category");
            if (categoryParam && categories.includes(categoryParam)) state.currentCategory = categoryParam;
            renderCategoryChips();
            renderMenuGrid();

            const search = document.getElementById("foodSearch");
            if (search) {
                search.addEventListener("input", () => {
                    state.query = search.value;
                    const clear = document.getElementById("searchClear");
                    if (clear) clear.classList.toggle("visible", state.query.trim().length > 0);
                    renderMenuGrid();
                });
            }
            const sortSelect = document.getElementById("sortSelect");
            if (sortSelect) {
                sortSelect.addEventListener("change", () => {
                    state.sortBy = sortSelect.value;
                    switchMenuWithAnimation();
                });
            }
            const priceFilter = document.getElementById("priceFilter");
            if (priceFilter) {
                priceFilter.addEventListener("change", () => {
                    state.maxPrice = Number(priceFilter.value) || 0;
                    switchMenuWithAnimation();
                });
            }
            const detailParam = new URLSearchParams(window.location.search).get("detail");
            if (detailParam) showDetails(detailParam);
        }

        /* ============================================================
           Дуртай хоол (favorites.html)
           ============================================================ */
        function renderFavoritesPage() {
            if (PAGE !== "favorites") return;
            const listEl = document.getElementById("favoriteList");
            if (!listEl) return;
            const list = state.favorites.map(getFood).filter(Boolean);
            const countView = document.getElementById("favoritesCount");
            if (countView) countView.textContent = `Нийт ${list.length} хоол дуртай хоолонд хадгалагдсан`;
            if (!list.length) {
                listEl.innerHTML = `
                <div class="empty-state wide">
                    <div class="empty-visual">${icon("heart")}</div>
                    <h3>Одоогоор таалагдасан хоол нэмээгүй байна</h3>
                    <p>Цэсний хоол бүр дээрх зүрхэн дүрсийг дарж таалагдасан хоол хэсэгт нэмээрэй.</p>
                    <a class="primary-button" href="menu.html">Цэсийг үзэх ${icon("arrow")}</a>
                </div>`;
                return;
            }
            listEl.innerHTML = `<div class="favorite-list">${list.map(food => `
                <article class="favorite-row">
                    <img src="${food.image}" alt="${escapeHTML(food.name)}" loading="lazy">
                    <div class="fav-info">
                        <h3>${escapeHTML(food.name)}</h3>
                        <p>${escapeHTML(food.description)}</p>
                        <div class="price">${formatPrice(food.price)}₮</div>
                    </div>
                    <div class="fav-actions">
                        <button class="secondary-button" type="button" data-add="${food.id}">${icon("plus")} Сагслах</button>
                        <button class="favorite-button active" type="button" data-favorite="${food.id}" aria-label="Дуртайгаас хасах">${icon("heart")}</button>
                    </div>
                </article>`).join("")}</div>`;
        }

        function initFavorites() {
            renderFavoritesPage();
        }

        /* ============================================================
           Сагс (cart.html)
           ============================================================ */
        function summaryRowsHTML() {
            const subtotal = getSubtotal();
            const discount = getDiscount(subtotal);
            const total = getTotal();
            return `
            <div class="summary-row"><span>Хоолны нийлбэр</span><strong>${formatPrice(subtotal)}₮</strong></div>
            ${state.coupon ? `<div class="summary-row discount"><span>Хямдрал · ${escapeHTML(state.coupon)}</span><strong>-${formatPrice(discount)}₮</strong></div>` : ""}
            <div class="summary-total">
                <span>Нийт төлөх дүн</span>
                <strong>${formatPrice(total)}₮</strong>
            </div><p class="form-note">Хүргэлт байхгүй — захиалгыг цайны газраас өөрөө очиж авна уу.</p>`;
        }

        function renderCartPage() {
            if (PAGE !== "cart") return;
            const itemsEl = document.getElementById("cartItems");
            if (!itemsEl) return;
            const emptyEl = document.getElementById("cartEmpty");
            const summaryEl = document.getElementById("summaryBody");
            const asideEl = document.getElementById("cartAside");
            const couponInput = document.getElementById("couponInput");
            const countNote = document.getElementById("cartCountNote");
            if (countNote) {
                const count = cartCount();
                countNote.textContent = `Нийт ${count} ширхэг хоол сагсанд байна`;
            }

            if (couponInput) {
                couponInput.value = state.coupon || "";
                couponInput.placeholder = state.coupon ? state.coupon : "Урамшуулын код оруулах";
            }

            if (!state.cart.length) {
                if (emptyEl) emptyEl.hidden = false;
                if (summaryEl) summaryEl.innerHTML = "";
                itemsEl.innerHTML = "";
                if (asideEl) asideEl.hidden = true;
                return;
            }
            if (emptyEl) emptyEl.hidden = true;
            if (asideEl) asideEl.hidden = false;
            itemsEl.innerHTML = state.cart.map(item => {
                const food = getFood(item.id);
                return `
                <article class="cart-item">
                    <img src="${food.image}" alt="${escapeHTML(food.name)}" loading="lazy">
                    <div class="cart-item-info">
                        <strong>${escapeHTML(food.name)}</strong>
                        <small>${escapeHTML(food.category)} · нэгж үнэ ${formatPrice(food.price)}₮</small>
                        <div class="cart-item-price">${formatPrice(food.price * item.qty)}₮</div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-button" type="button" data-qty="${food.id}" data-amount="-1" aria-label="Тоог хасах">${icon("minus")}</button>
                        <span class="quantity-button"><strong>${item.qty}</strong></span>
                        <button class="quantity-button" type="button" data-qty="${food.id}" data-amount="1" aria-label="Тоог нэмэх">${icon("plus")}</button>
                        <button class="remove-button" type="button" data-remove="${food.id}" aria-label="Устгах">${icon("trash")}</button>
                    </div>
                </article>`;
            }).join("");
            if (summaryEl) summaryEl.innerHTML = summaryRowsHTML();
        }

        function initCart() {
            renderCartPage();
            const couponForm = document.getElementById("couponForm");
            if (couponForm) {
                couponForm.addEventListener("submit", event => {
                    event.preventDefault();
                    const input = document.getElementById("couponInput");
                    applyCoupon(input ? input.value : "");
                });
            }
        }

        /* ============================================================
           Нүүр хуудас (index.html)
           ============================================================ */
        function renderFeatured() {
            const grid = document.getElementById("featuredGrid");
            if (!grid) return;
            const list = foods.filter(food => food.featured).slice(0, 3);
            grid.innerHTML = list.map(food => `
                <article class="featured-card">
                    <div class="featured-top">
                        <img src="${food.image}" alt="${escapeHTML(food.name)}" loading="lazy">
                        <div class="featured-shade"></div>
                    </div>
                    <div class="featured-copy">
                        <h3>${escapeHTML(food.name)}</h3>
                        <p>${escapeHTML(food.description)}</p>
                        <div class="featured-meta">
                            <span>${icon("star")}${food.rating}</span>
                            <span>${icon("clock")}${escapeHTML(food.time)}</span>
                            <span class="meta-dot">${escapeHTML(food.category)}</span>
                        </div>
                        <div class="featured-bottom">
                            <strong class="featured-price">${formatPrice(food.price)}₮ ${food.oldPrice ? `<del>${formatPrice(food.oldPrice)}₮</del>` : ""}</strong>
                            <button class="featured-add" type="button" data-add="${food.id}">${icon("plus")} Сагслах</button>
                        </div>
                    </div>
                </article>`).join("");
        }

        function initIndex() {
            renderFeatured();
        }

        /* ============================================================
           Захиалгын түүх (orders.html)
           ============================================================ */
        function userOrders() {
            if (!state.user) return [];
            return state.orders.filter(order =>
                (order.studentId || "").toString().trim().toLowerCase() === state.user.studentId.trim().toLowerCase()
                || (order.userName && order.userName === state.user.name)).slice().reverse();
        }

        function orderCardHTML(order) {
            const items = Array.isArray(order.items) ? order.items : [];
            return `
            <article class="order-block" data-order-number="${escapeHTML(order.number)}">
                <header class="order-block-head">
                    <div>
                        <h3>${escapeHTML(order.number)}</h3>
                        <small>${formatDateTime(order.createdAt)}</small>
                    </div>
                    <span class="order-status">${escapeHTML(order.status || "Баталгаажсан")}</span>
                </header>
                <div class="order-items">
                    ${items.length
                    ? items.map(item => `<div class="order-item"><span>${escapeHTML(item.name)} × ${Number(item.qty) || 0}</span><strong>${formatPrice(Number(item.price) * Number(item.qty))}₮</strong></div>`).join("")
                    : `<div class="order-item"><span>Хоолны мэдээлэл байхгүй</span><span></span></div>`}
                </div>
                <div class="order-meta">
                    <div><small>Очих байр</small><strong>${escapeHTML(order.pickupSpot || "-")}</strong></div>
                    <div><small>Очих өдөр</small><strong>${formatDate(order.pickupDate) || "-"}</strong></div>
                    <div><small>Очих цаг</small><strong>${escapeHTML(order.pickupTime || "-")}</strong></div>
                    <div><small>Утас</small><strong>${escapeHTML(order.phone || "-")}</strong></div>
                    <div><small>Төлбөр</small><strong>${escapeHTML(paymentLabel(order.payment))}</strong></div>
                    <div><small>Оюутны код</small><strong>${escapeHTML(order.studentId || "-")}</strong></div>
                </div>
                ${order.note ? `<p class="order-note">Тэмдэглэл: ${escapeHTML(order.note)}</p>` : ""}
                <footer class="order-block-foot">
                    <span>Нийт төлсөн дүн ${state.discountRate ? `${formatPrice(order.subtotal)}₮ -${formatPrice(order.discount)}₮` : ""}</span>
                    <strong>${formatPrice(order.total)}₮</strong>
                </footer>
            </article>`;
        }

        function paymentLabel(value) {
            switch (value) {
                case "cash": return "Бэлэн мөнгө";
                case "qpay": return "QPay";
                case "card": return "Карт";
                default: return "-";
            }
        }

        function renderOrdersPage(newNumber) {
            if (PAGE !== "orders") return;
            const listEl = document.getElementById("orderList");
            if (!listEl) return;
            const countView = document.getElementById("ordersCount");
            const list = userOrders();
            if (countView) countView.textContent = `Нийт ${list.length} захиалга бүртгэлээр байна`;
            if (!list.length) {
                listEl.innerHTML = `
                <div class="empty-state wide">
                    <div class="empty-visual">${icon("clock")}</div>
                    <h3>Одоогоор захиалга хийгээгүй байна</h3>
                    <p>Цэснээс хоол сонгож, очих цагаа сонгож захиалаарай.</p>
                    <a class="primary-button" href="menu.html">Цэс рүү очих ${icon("arrow")}</a>
                </div>`;
                return;
            }
            listEl.innerHTML = list.map(orderCardHTML).join("");
            if (newNumber) {
                const target = listEl.querySelector(`[data-order-number="${escapeHTML(newNumber)}"]`);
                if (target) {
                    target.classList.add("highlight");
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        }

        function initOrders() {
            if (!requireAuth("orders.html")) return;
            const newNumber = new URLSearchParams(window.location.search).get("new");
            renderOrdersPage(newNumber);
            if (newNumber) showToast("Захиалга амжилттай бүртгэгдлээ.");
        }
        /* ============================================================
           Захиалга баталгаажуулах (checkout.html)
           ============================================================ */
        function pickupChipsHTML() {
            const isToday = state.pickupDate === todayISO();
            const now = new Date();
            const nowMinutes = now.getHours() * 60 + now.getMinutes();
            return PICKUP_TIMES.map(time => {
                const [hour, minute] = time.split(":").map(Number);
                const past = isToday && (hour * 60 + minute) <= nowMinutes + 15;
                return `<button class="time-chip${state.pickupTime === time ? " active" : ""}" type="button" data-pickup-time="${time}"${past ? " disabled" : ""}>${time}</button>`;
            }).join("");
        }

        function renderPickupChips() {
            const grid = document.getElementById("pickupTimeGrid");
            if (!grid) return;
            grid.innerHTML = pickupChipsHTML();
            grid.classList.remove("invalid");
        }

        function renderCheckoutSummary() {
            if (PAGE !== "checkout") return;
            const preview = document.getElementById("checkoutItemsPreview");
            const summary = document.getElementById("checkoutSummary");
            if (preview) {
                preview.innerHTML = state.cart.map(item => {
                    const food = getFood(item.id);
                    return `
                    <div class="preview-item">
                        <img src="${food.image}" alt="${escapeHTML(food.name)}" loading="lazy">
                        <div>
                            <strong>${escapeHTML(food.name)}</strong>
                            <small>${item.qty} ширхэг</small>
                        </div>
                        <span>${formatPrice(food.price * item.qty)}₮</span>
                    </div>`;
                }).join("");
            }
            if (summary) summary.innerHTML = summaryRowsHTML();
        }

        function initCheckout() {
            if (!requireAuth("checkout.html")) return;
            if (!state.cart.length) {
                window.location.replace("cart.html");
                return;
            }
            /* Сонгосон захиалга дээр хэрэглэгчийн кодыг харуулна */
            const userChip = document.getElementById("checkoutUserChip");
            if (userChip) userChip.textContent = `${state.user.name} · ${state.user.studentId}`;

            const dateInput = document.getElementById("pickupDate");
            const maxDate = (function () {
                const limit = new Date();
                limit.setDate(limit.getDate() + 6);
                return `${limit.getFullYear()}-${String(limit.getMonth() + 1).padStart(2, "0")}-${String(limit.getDate()).padStart(2, "0")}`;
            })();
            if (dateInput) {
                dateInput.min = todayISO();
                dateInput.max = maxDate;
                dateInput.value = todayISO();
                state.pickupDate = dateInput.value;
                dateInput.addEventListener("change", () => {
                    state.pickupDate = dateInput.value || "";
                    state.pickupTime = "";
                    renderPickupChips();
                });
            }

            const spotSelect = document.getElementById("pickupSpot");
            if (spotSelect && !spotSelect.options.length) {
                spotSelect.innerHTML = `<option value="">Байр сонгох</option>${PICKUP_SPOTS.map(spot => `<option value="${escapeHTML(spot)}">${escapeHTML(spot)} гуанз</option>`).join("")}`;
            }

            renderPickupChips();
            renderCheckoutSummary();

            const form = document.getElementById("checkoutForm");
            if (form) {
                form.addEventListener("submit", submitCheckout);
            }
        }

        function submitCheckout(event) {
            event.preventDefault();
            const spot = document.getElementById("pickupSpot");
            const dateInput = document.getElementById("pickupDate");
            const phone = document.getElementById("pickupPhone");
            const note = document.getElementById("pickupNote");
            const grid = document.getElementById("pickupTimeGrid");

            if (phone) phone.value = phone.value.trim();

            const emptySpot = !spot || !spot.value;
            const emptyDate = !dateInput || !dateInput.value;
            const emptyTime = !state.pickupTime;
            const digits = phone ? phone.value.replace(/\D/g, "") : "";
            const badPhone = digits.length < 8 || digits.length > 11;

            markField(spot, emptySpot);
            markField(dateInput, emptyDate);
            markField(phone, badPhone);
            if (grid) {
                grid.classList.toggle("invalid", emptyTime);
                grid.querySelectorAll(".time-chip").forEach(chip => {
                    chip.classList.toggle("active", chip.dataset.pickupTime === state.pickupTime);
                });
            }

            const firstError = emptySpot ? "Очих байраа сонгоно уу."
                : emptyDate ? "Очих өдөрөө сонгоно уу."
                    : emptyTime ? "Очих цагаа сонгоно уу."
                        : badPhone ? "Утасны дугаараа зөв бичнэ үү (8–11 цифр)." : "";

            if (firstError) {
                showToast(firstError, "error");
                return;
            }

            state.pickupDate = dateInput.value;
            createOrder({
                pickupSpot: spot.value,
                pickupDate: dateInput.value,
                pickupTime: state.pickupTime,
                phone: phone.value,
                note: note ? note.value.trim() : ""
            });
        }

        function createOrder(info) {
            const submitButton = document.querySelector("#checkoutForm .checkout-button");
            if (submitButton && submitButton.disabled) return;
            if (submitButton) submitButton.disabled = true;

            const subtotal = getSubtotal();
            const discount = getDiscount(subtotal);
            const now = new Date();
            const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
            const order = {
                number: `HA-${stamp}-${Math.floor(100 + Math.random() * 900)}`,
                createdAt: now.toISOString(),
                status: "Баталгаажсан",
                studentId: state.user.studentId,
                userName: state.user.name,
                items: state.cart.map(item => {
                    const food = getFood(item.id);
                    return { id: food.id, name: food.name, price: food.price, qty: item.qty };
                }),
                subtotal,
                discount,
                coupon: state.coupon || "",
                total: subtotal - discount,
                orderType: "pickup",
                pickupSpot: info.pickupSpot,
                pickupDate: info.pickupDate,
                pickupTime: info.pickupTime,
                phone: info.phone,
                note: info.note,
                payment: state.paymentMethod
            };

            state.orders.push(order);
            storage.set("haaisOrders", state.orders);
            state.cart = [];
            saveCart();
            updateCartBadge();
            state.coupon = "";
            state.discountRate = 0;
            saveCoupon();
            showToast("Захиалга амжилттай баталгаажлаа.");
            window.location.href = `orders.html?new=${encodeURIComponent(order.number)}`;
        }

        /* ============================================================
           Нэвтрэх ба бүртгэл (login.html)
           ============================================================ */
        function initLogin() {
            if (state.user) {
                window.location.replace(safeRedirectTarget());
                return;
            }
            const tabs = new URLSearchParams(window.location.search);
            if (tabs.get("tab") === "register") setAuthTab("register");

            const redirectHint = document.getElementById("authRedirectHint");
            const target = tabs.get("redirect");
            const targetPage = target && PAGES.includes(target) ? target : "";
            if (redirectHint) {
                redirectHint.hidden = !targetPage || targetPage === "profile.html";
            }

            const loginForm = document.getElementById("loginForm");
            if (loginForm) loginForm.addEventListener("submit", handleLogin);

            const registerForm = document.getElementById("registerForm");
            if (registerForm) registerForm.addEventListener("submit", handleRegister);
        }

        function markField(input, bad) {
            if (input) input.classList.toggle("invalid", bad);
        }

        function finishLogin(record) {
            state.user = { name: record.name, studentId: record.studentId, avatar: record.avatar || "" };
            storage.set("haaisUser", state.user);
            showToast(`Тавтай морил, ${record.name}!`);
            window.setTimeout(() => { window.location.href = safeRedirectTarget(); }, 500);
        }

        function handleLogin(event) {
            event.preventDefault();
            const codeInput = document.getElementById("loginStudentId");
            const passwordInput = document.getElementById("loginPassword");
            const code = codeInput ? codeInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value : "";
            markField(codeInput, false);
            markField(passwordInput, false);
            let ok = true;
            if (!code) { markField(codeInput, true); ok = false; }
            if (!password) { markField(passwordInput, true); ok = false; }
            if (!ok) {
                showToast("Оюутны болон нууц үгээ бичнэ үү.", "error");
                return;
            }
            const record = findUserByStudentCode(code);
            if (!record) {
                markField(codeInput, true);
                showToast("Оюутны код бүртгэлд олдсонгүй. Бүртгэл үүсгээрэй.", "error");
                return;
            }
            if (!verifyPassword(record, password)) {
                markField(passwordInput, true);
                showToast("Нууц үг буруу байна. Дахин оруулна уу.", "error");
                return;
            }
            finishLogin(record);
        }

        function handleRegister(event) {
            event.preventDefault();
            const surname = document.getElementById("registerSurname");
            const givenName = document.getElementById("registerGivenName");
            const codeInput = document.getElementById("registerStudentId");
            const passwordInput = document.getElementById("registerPassword");
            const repeatInput = document.getElementById("registerPassword2");
            const surnameValue = surname ? surname.value.trim().replace(/\s+/g, " ") : "";
            const givenValue = givenName ? givenName.value.trim().replace(/\s+/g, " ") : "";
            const codeValue = codeInput ? codeInput.value.trim() : "";
            const passwordValue = passwordInput ? passwordInput.value : "";
            const repeatValue = repeatInput ? repeatInput.value : "";

            [surname, givenName, codeInput, passwordInput, repeatInput].forEach(input => markField(input, false));

            let message = "";
            if (surnameValue.length < 2) { markField(surname, true); message = "Хамгийн багадаа 2 тэмдэгт байх ёстой."; }
            else if (givenValue.length < 2) { markField(givenName, true); message = "Хамгийн багадаа 2 тэмдэгт байх ёстой."; }
            else if (codeValue.length < 4 || codeValue.length > 16) {
                markField(codeInput, true);
                /* Шалгалтын дүрмийг studentCodePattern-аар цааш өөрчилж болно */
                message = "Оюутны код 4–16 тэмдэгт байх ёстой.";
            } else if (!/^[0-9A-Za-zА-Яа-яӨөҮүЁё\-]{4,16}$/.test(codeValue)) {
                markField(codeInput, true);
                message = "Оюутны код латин/кирилл үсэг болон тооноос бүрдэнэ.";
            } else if (findUserByStudentCode(codeValue)) {
                markField(codeInput, true);
                message = "Энэ оюутны кодоор бүртгэл үүссэн байна.";
            } else if (passwordValue.length < 6) {
                markField(passwordInput, true);
                message = "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.";
            } else if (passwordValue !== repeatValue) {
                markField(repeatInput, true);
                message = "Давтсан нууц үг таарахгүй байна.";
            }

            if (message) {
                showToast(message, "error");
                return;
            }

            const record = {
                name: `${surnameValue} ${givenValue}`.trim(),
                studentId: codeValue,
                password: hashPassword(passwordValue),
                avatar: "",
                createdAt: new Date().toISOString()
            };
            state.users.push(record);
            saveUsers();
            showToast("Бүртгэл амжилттай үүслээ. Одоо нэвтэрч орно.");
            finishLogin(record);
        }

        /* ============================================================
           Профайл (profile.html)
           ============================================================ */
        function avatarZoneHTML() {
            return `
            <div class="avatar-picker">
                <span class="profile-avatar${state.user.avatar ? " has-photo" : ""}">
                    ${state.user.avatar ? `<img src="${state.user.avatar}" alt="Профайлын зураг">` : escapeHTML(initialsOf(state.user.name))}
                </span>
                <div class="picker-actions">
                    <button class="primary-button" type="button" data-avatar-pick>Зураг солих</button>
                    <button class="secondary-button" type="button" data-avatar-reset${state.user.avatar ? "" : " hidden"}>Устгах</button>
                    <small class="picker-label">PNG/JPG · 2МБ хүртэл</small>
                </div>
            </div>
            <input type="file" id="avatarInput" accept="image/*" hidden>`;
        }

        function saveUserAvatar(avatar) {
            state.user.avatar = avatar || "";
            storage.set("haaisUser", state.user);
            const record = findUserByStudentCode(state.user.studentId);
            if (record) {
                record.avatar = state.user.avatar;
                saveUsers();
            }
            updateAccountButton();
            if (PAGE === "profile") renderProfile();
        }

        function clearAvatar() {
            if (!state.user || !state.user.avatar) return;
            saveUserAvatar("");
            showToast("Профайлын зураг устгагдлаа.");
        }

        function applyAvatarImage(file) {
            if (!state.user) return;
            if (!file) return;
            if (!file.type || !file.type.startsWith("image/")) {
                showToast("Зөвхөн зураг файл оруулж болно.", "error");
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                showToast("Зургийн хэмжээ 2МБ-аас бага байх ёстой.", "error");
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                const image = new window.Image();
                image.onload = () => {
                    const size = 256;
                    const canvas = document.createElement("canvas");
                    canvas.width = size;
                    canvas.height = size;
                    const context = canvas.getContext("2d");
                    const scale = Math.max(size / image.width, size / image.height);
                    const drawWidth = image.width * scale;
                    const drawHeight = image.height * scale;
                    context.drawImage(image, (size - drawWidth) / 2, (size - drawHeight) / 2, drawWidth, drawHeight);
                    saveUserAvatar(canvas.toDataURL("image/jpeg", 0.85));
                    showToast("Профайлын зураг шинэчлэгдлээ.");
                };
                image.onerror = () => showToast("Зураг уншихад алдаа гарлаа.", "error");
                image.src = String(reader.result);
            };
            reader.onerror = () => showToast("Файл уншихад алдаа гарлаа.", "error");
            reader.readAsDataURL(file);
        }

        function renderProfile() {
            if (PAGE !== "profile" || !state.user) return;
            const body = document.getElementById("profileBody");
            if (!body) return;
            const record = findUserByStudentCode(state.user.studentId);
            const myOrders = userOrders();
            const spent = myOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
            const recent = myOrders.slice(0, 3);

            body.innerHTML = `
            <div class="profile-head">
                ${avatarZoneHTML()}
                <div>
                    <h2>${escapeHTML(state.user.name)}</h2>
                    <p>Оюутны код: ${escapeHTML(state.user.studentId)} · Бүртгэл ${record && record.createdAt ? formatDate(record.createdAt) : "-"}</p>
                </div>
            </div>
            <div class="profile-stats">
                <div class="profile-stat"><strong>${myOrders.length}</strong><span>Нийт захиалга</span></div>
                <div class="profile-stat"><strong>${formatPrice(spent)}₮</strong><span>Зарцуулалт</span></div>
                <div class="profile-stat"><strong>${state.favorites.length}</strong><span>Дуртай хоол</span></div>
                <div class="profile-stat"><strong>${cartCount()}</strong><span>Сагсанд байгаа</span></div>
            </div>

            <section class="profile-panel">
                <h3 class="profile-section-title">Хувийн мэдээлэл засах</h3>
                <form id="profileInfoForm" class="profile-form" novalidate>
                    <div class="form-group">
                        <label class="form-label" for="profileName">Овог, нэр</label>
                        <div class="field-wrap">
                            <svg class="icon"><use href="#icon-user"></use></svg>
                            <input class="form-control" id="profileName" type="text" value="${escapeHTML(state.user.name)}" minlength="3" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="profileStudentId">Оюутны код (нэвтрэх код)</label>
                        <div class="field-wrap">
                            <svg class="icon"><use href="#icon-ticket"></use></svg>
                            <input class="form-control" id="profileStudentId" type="text" value="${escapeHTML(state.user.studentId)}" readonly>
                        </div>
                    </div>
                    <button class="form-submit" type="submit">${icon("check")} Өөрчлөлт хадгалах</button>
                </form>
                <div class="profile-links">
                    <a class="secondary-button" href="favorites.html">${icon("heart")} Дуртай хоол</a>
                    <a class="secondary-button" href="orders.html">${icon("clock")} Захиалгын түүх</a>
                    <a class="secondary-button" href="menu.html">${icon("store")} Цэс рүү очих</a>
                    <button class="secondary-button" type="button" id="profileThemeButton">${icon("moon")} Гэрэлтэй / Бараан горим</button>
                    <button class="logout-button" type="button" data-logout>Гарах</button>
                </div>
            </section>

            <section class="profile-panel">
                <h3 class="profile-section-title">Сүүлийн захиалгууд</h3>
                ${recent.length
                ? `<div class="order-list">${recent.map(order => `
                    <div class="order-row">
                        <div>
                            <strong>${escapeHTML(order.number || "")}</strong>
                            <small>${formatDateTime(order.createdAt)} · ${escapeHTML(order.pickupTime || "-")} · ${escapeHTML(order.pickupSpot || "")}</small>
                        </div>
                        <span>${formatPrice(Number(order.total) || 0)}₮</span>
                    </div>`).join("")}</div>
                    <a class="text-link" href="orders.html">Бүх захиалгыг харах ${icon("arrow")}</a>`
                : `<p class="muted-note">Одоогоор захиалга хийгээгүй байна.</p>
                    <a class="primary-button" href="menu.html">Цэс рүү очих ${icon("arrow")}</a>`}
            </section>`;

            const infoForm = document.getElementById("profileInfoForm");
            if (infoForm) {
                infoForm.addEventListener("submit", event => {
                    event.preventDefault();
                    const input = document.getElementById("profileName");
                    const value = input ? input.value.trim().replace(/\s+/g, " ") : "";
                    if (value.length < 3) {
                        markField(input, true);
                        showToast("Нэр хамгийн багадаа 3 тэмдэгт байх ёстой.", "error");
                        return;
                    }
                    markField(input, false);
                    state.user.name = value;
                    storage.set("haaisUser", state.user);
                    const record2 = findUserByStudentCode(state.user.studentId);
                    if (record2) {
                        record2.name = value;
                        saveUsers();
                    }
                    updateAccountButton();
                    renderProfile();
                    showToast("Мэдээлэл амжилттай хадгалагдлаа.");
                });
            }

            const themeSwitch = document.getElementById("profileThemeButton");
            if (themeSwitch) themeSwitch.addEventListener("click", toggleTheme);
        }

        function initProfile() {
            if (!requireAuth("profile.html")) return;
            renderProfile();
        }

        /* ============================================================
           Холбоо барих (contact.html)
           ============================================================ */
        function initContact() {
            const form = document.getElementById("contactForm");
            if (!form) return;
            form.addEventListener("submit", event => {
                event.preventDefault();
                const name = document.getElementById("contactName");
                const contact = document.getElementById("contactInfo");
                const message = document.getElementById("contactMessage");
                const nameValue = name ? name.value.trim() : "";
                const contactValue = contact ? contact.value.trim() : "";
                const messageValue = message ? message.value.trim() : "";

                [name, contact, message].forEach(input => markField(input, false));
                if (nameValue.length < 2) {
                    markField(name, true);
                    showToast("Нэрээ бичнэ үү.", "error");
                    return;
                }
                if (contactValue.length < 5) {
                    markField(contact, true);
                    showToast("Утас эсвэл и-мэйлээ үлдээнэ үү.", "error");
                    return;
                }
                if (messageValue.length < 10) {
                    markField(message, true);
                    showToast("Мэдэгдэл хамгийн багадаа 10 тэмдэгт байх ёстой.", "error");
                    return;
                }
                const messages = Array.isArray(storage.get("haaisMessages", [])) ? storage.get("haaisMessages", []) : [];
                messages.push({ name: nameValue, contact: contactValue, message: messageValue, createdAt: new Date().toISOString() });
                storage.set("haaisMessages", messages);
                form.reset();
                showToast("Таны мэдэгдлийг хүлээн авлаа. Энэ сайт демо горимд ажиллаж байна.");
            });
        }

        /* ============================================================
           Эхлүүлэгч — хуудас бүрээр тасалбарладаг
           ============================================================ */
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                document.querySelectorAll(".overlay.show").forEach(overlay => {
                    overlay.classList.remove("show");
                    document.body.classList.remove("no-scroll");
                });
            }
        });

        function init() {
            setupHeader();
            setupThemeButton();
            switch (PAGE) {
                case "menu": initMenu(); break;
                case "cart": initCart(); break;
                case "checkout": initCheckout(); break;
                case "login": initLogin(); break;
                case "profile": initProfile(); break;
                case "orders": initOrders(); break;
                case "favorites": initFavorites(); break;
                case "contact": initContact(); break;
                case "index": initIndex(); break;
                default: break; /* about.html зэрэг статик хуудас */
            }
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", init);
        } else {
            init();
        }
    })();
}