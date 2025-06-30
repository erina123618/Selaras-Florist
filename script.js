const userIcon = document.getElementById('userIconText');
const loginModal = document.getElementById('loginModal');

userIcon.addEventListener('click', function(e) {
    e.preventDefault();
    loginModal.style.display = 'flex';
});

function closeModal() {
    loginModal.style.display = 'none';
}

window.addEventListener('click', function(event) {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
});
// UI-only Cart Modal
const cartIcon = document.getElementById("headerCartBtn");
const cartModal = document.getElementById("cartModal");

cartIcon.addEventListener("click", () => {
  cartModal.style.display = "flex";
});

function closeCart() {
  cartModal.style.display = "none";
}

window.addEventListener("click", function(event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

let cartItems = [];
function addToCart(product) {
  const existingItem = cartItems.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }
  renderCart();
}function renderCart() {
  const cartList = document.getElementById('cartItems');
  cartList.innerHTML = '';

  if (cartItems.length === 0) {
    cartList.innerHTML = '<li>Keranjang masih kosong.</li>';
    return;
  }

  cartItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} x ${item.quantity}
      <button class="remove-btn" data-index="${index}">❌</button>
    `;
    cartList.appendChild(li);
  });

  // Tambahkan event listener untuk tombol hapus
  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', () => {
      const index = button.dataset.index;
      cartItems.splice(index, 1); // Hapus 1 item di posisi index
      renderCart(); // Re-render setelah hapus
    });
  });
}

// Event listener untuk tombol "add to cart"
document.querySelectorAll('.cart-btn').forEach((button, index) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();

    const box = button.closest('.box');
    const nameElement = box.querySelector('.content h3');
    const name = nameElement ? nameElement.innerText.trim() : 'Produk';
    const id = index + 1; // Atau bisa pakai data dari server kalau ada

    const product = {
      id: id,
      name: name
    };

    addToCart(product);
  });
});
function loginUser(event) {
  event.preventDefault(); // Mencegah reload halaman

  const usernameInput = document.querySelector('input[name="username"]');
  const username = usernameInput.value.trim();

  if (username) {
    // Simpan username (bisa juga pakai localStorage kalau ingin persist)
    updateUserMenu(username);
    closeModal(); // Tutup modal login
  } else {
    alert("Username harus diisi.");
  }

  return false;
}
function updateUserMenu(username) {
  const greetingSpan = document.getElementById('userGreeting');
  greetingSpan.textContent = `Hai, ${username}`;

  // Tampilkan tombol logout (kalau pakai tombol terpisah)
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.style.display = 'inline-block';

  // Simpan di localStorage (opsional agar tetap login saat reload)
  localStorage.setItem('username', username);
}
function logoutUser() {
  const greetingSpan = document.getElementById('userGreeting');
  greetingSpan.textContent = '';

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.style.display = 'none';

  // Reset localStorage
  localStorage.removeItem('username');
}
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    logoutUser();
  });
}

// Ambil ikon hati di header
const headerHeartIcon = document.getElementById("headerFavoriteBtn");
const favoriteModal = document.getElementById("favoriteModal");

headerHeartIcon.addEventListener("click", (e) => {
  e.preventDefault();
  renderFavorites();
  favoriteModal.style.display = "flex";
});

function closeFavorite() {
  favoriteModal.style.display = "none";
}

function renderFavorites() {
  const list = document.getElementById('favoriteList');
  list.innerHTML = '';

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (favorites.length === 0) {
    list.innerHTML = '<li>Tidak ada favorit.</li>';
    return;
  }

  favorites.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    list.appendChild(li);
  });
}

let favoriteItems = JSON.parse(localStorage.getItem('favorites')) || [];

document.querySelectorAll('.products .box .fa-heart').forEach((heartBtn, index) => {
  heartBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const box = heartBtn.closest('.box');
    const name = box.querySelector('.content h3').innerText.trim();
    const id = index + 1;

    const product = { id, name };

    const exists = favoriteItems.find(item => item.id === id);
    if (!exists) {
      favoriteItems.push(product);
      localStorage.setItem('favorites', JSON.stringify(favoriteItems));
      alert(`'${name}' ditambahkan ke favorit!`);
    } else {
      alert(`'${name}' sudah ada di favorit.`);
    }
  });
});

function renderFavorites() {
  const list = document.getElementById('favoriteList');
  list.innerHTML = '';

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (favorites.length === 0) {
    list.innerHTML = '<li>Tidak ada favorit.</li>';
    return;
  }

  favorites.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name}
      <button class="remove-btn" data-index="${index}">❌</button>
    `;
    list.appendChild(li);
  });

  // Tambahkan event listener untuk tombol hapus
  document.querySelectorAll('#favoriteList .remove-btn').forEach(button => {
    button.addEventListener('click', () => {
      const index = button.dataset.index;
      favorites.splice(index, 1); // Hapus dari array
      localStorage.setItem('favorites', JSON.stringify(favorites)); // Simpan ulang
      renderFavorites(); // Re-render daftar
    });
  });
}

// Menangani form komentar
const commentForm = document.getElementById('commentForm');
const commentInput = document.getElementById('commentInput');
const reviewContainer = document.querySelector('.review .box-container');

let storedComments = JSON.parse(localStorage.getItem('comments')) || [];

function renderComments() {
  reviewContainer.innerHTML = ''; // Kosongkan review dulu

  // Komentar default (non-editable)
  const defaultComments = [
    {
      username: "Natasya P",
      text: "Bunga-bunganya segar dan indah banget! Proses pemesanannya juga gampang dan cepat.",
      image: "image/user1.jpg"
    },
    {
      username: "Jeandra",
      text: "Pelayanan di Selaras Florist sangat memuaskan! Adminnya ramah dan responsif.",
      image: "image/user2.jpg"
    },
    {
      username: "Grace A",
      text: "Saya sangat merekomendasikan Selaras Florist. Kualitas bunganya segar dan rapi.",
      image: "image/user3.jpg"
    }
  ];

  defaultComments.forEach(comment => {
    const box = document.createElement('div');
    box.classList.add('box');
    box.innerHTML = `
      <div class="stars">
        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
      </div>
      <p>${comment.text}</p>
      <div class="user">
        <img src="${comment.image}" alt="">
        <div class="user-info">
          <h3>${comment.username}</h3>
          <span>happy customer</span>
        </div>
      </div>
      <span class="fas fa-quote-right"></span>
    `;
    reviewContainer.appendChild(box);
  });

  const currentUser = localStorage.getItem('username');

  // Komentar yang bisa dihapus (punya user)
  storedComments.forEach((comment, index) => {
    const box = document.createElement('div');
    box.classList.add('box');

    let deleteBtn = '';
    if (currentUser === comment.username) {
      deleteBtn = `<button class="remove-btn" data-index="${index}" title="Hapus komentar ini">❌</button>`;
    }

    box.innerHTML = `
      <div class="stars">
        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
      </div>
      <p>${comment.text}</p>
      <div class="user">
        <img src="image/user1.jpg" alt="">
        <div class="user-info">
          <h3>${comment.username}</h3>
          <span>happy customer</span>
        </div>
      </div>
      ${deleteBtn}
      <span class="fas fa-quote-right"></span>
    `;
    reviewContainer.appendChild(box);
  });

  // Hapus komentar milik sendiri
  document.querySelectorAll('.review .remove-btn').forEach(button => {
    button.addEventListener('click', () => {
      const index = button.dataset.index;
      storedComments.splice(index, 1);
      localStorage.setItem('comments', JSON.stringify(storedComments));
      renderComments();
    });
  });
}

renderComments();

commentForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const username = localStorage.getItem('username');
  const commentText = commentInput.value.trim();

  if (!username) {
    alert("Silakan login terlebih dahulu untuk memberikan komentar.");
    return;
  }

  if (commentText) {
    const comment = {
      username: username,
      text: commentText
    };

    storedComments.push(comment);
    localStorage.setItem('comments', JSON.stringify(storedComments));

    // Tambahkan komentar baru ke review
    const box = document.createElement('div');
    box.classList.add('box');
    box.innerHTML = `
      <div class="stars">
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
      </div>
      <p>${comment.text}</p>
      <div class="user">
        <img src="image/user1.jpg" alt="">
        <div class="user-info">
          <h3>${comment.username}</h3>
          <span>happy customer</span>
        </div>
      </div>
      <span class="fas fa-quote-right"></span>
    `;
    reviewContainer.appendChild(box);

    commentInput.value = '';
  }
});