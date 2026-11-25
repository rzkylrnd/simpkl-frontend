<template>
  <div class="max-w-4xl mx-auto" ref="pageRef">
    <!-- Hero -->
    <div :class="['relative rounded-2xl p-10 mb-8 text-center overflow-hidden reveal', darkMode ? 'bg-gray-800' : 'light-card']" style="--d:0s">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="bg-circle c1"></div>
        <div class="bg-circle c2"></div>
        <div class="bg-circle c3"></div>
        <div class="bg-circle c4"></div>
      </div>
      <div class="relative z-10">
        <div :class="['w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-4xl hero-icon', darkMode ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-xl shadow-blue-500/30']">
          <i class="fas fa-graduation-cap"></i>
        </div>
        <h2 class="text-3xl font-bold mb-2 hero-title">SIMPKL</h2>
        <p :class="['text-sm mb-5 hero-sub', darkMode ? 'text-gray-400' : 'text-gray-500']">Sistem Informasi Praktek Kerja Lapangan</p>
        <p :class="['text-sm leading-relaxed max-w-2xl mx-auto text-justify hero-desc', darkMode ? 'text-gray-300' : 'text-gray-600']">
          SIMPKL adalah sistem informasi yang dirancang untuk mengelola seluruh proses Praktek Kerja Lapangan
          (PKL) siswa secara terpadu. Sistem ini menangani mulai dari data siswa, penempatan siswa ke perusahaan,
          presensi harian, jurnal kegiatan, pengajuan izin, laporan akhir, hingga penilaian — sehingga kegiatan PKL
          dapat dipantau dan dikelola oleh semua pemangku kepentingan secara real-time dan terdokumentasi dengan baik.
        </p>
      </div>
    </div>

    <!-- Visi Misi -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div :class="['rounded-2xl p-7 reveal', darkMode ? 'bg-gray-800' : 'light-card']" style="--d:0.06s">
        <h3 class="text-lg font-bold mb-4 flex items-center gap-2.5">
          <span class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-sm"><i class="fas fa-bullseye"></i></span>
          Visi
        </h3>
        <p :class="['text-sm leading-relaxed text-justify', darkMode ? 'text-gray-300' : 'text-gray-600']">
          Menjadi sistem informasi PKL yang andal dalam mendukung keterampilan siswa melalui pengelolaan data yang
          transparan, akurat, dan mudah diakses bagi sekolah, industri, serta pemangku kepentingan.
        </p>
      </div>
      <div :class="['rounded-2xl p-7 reveal', darkMode ? 'bg-gray-800' : 'light-card']" style="--d:0.12s">
        <h3 class="text-lg font-bold mb-4 flex items-center gap-2.5">
          <span class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-sm"><i class="fas fa-rocket"></i></span>
          Misi
        </h3>
        <ul :class="['text-sm leading-relaxed space-y-2', darkMode ? 'text-gray-300' : 'text-gray-600']">
          <li v-for="(m, i) in misi" :key="i" class="reveal-child flex gap-2" :style="{ '--d': (0.18 + i * 0.07) + 's' }">
            <i class="fas fa-check-circle text-blue-500 mt-0.5 shrink-0 text-xs"></i>
            <span>{{ m }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Fitur Utama -->
    <div :class="['rounded-2xl p-7 mb-8 reveal', darkMode ? 'bg-gray-800' : 'light-card']" style="--d:0.1s">
      <h3 class="text-lg font-bold mb-5 flex items-center gap-2.5">
        <span class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-sm"><i class="fas fa-cubes"></i></span>
        Fitur Utama
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div v-for="(f, i) in fitur" :key="f.title" class="reveal-child fitur-card flex gap-3.5 items-start p-4 rounded-xl cursor-default" :style="{ '--d': (0.15 + i * 0.07) + 's' }">
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-sm shadow-md fitur-icon', f.bg]">
            <i :class="f.icon"></i>
          </div>
          <div>
            <p class="text-sm font-semibold mb-0.5">{{ f.title }}</p>
            <p :class="['text-xs leading-relaxed', darkMode ? 'text-gray-400' : 'text-gray-500']">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Peran Pengguna -->
    <div :class="['rounded-2xl p-7 mb-8 reveal', darkMode ? 'bg-gray-800' : 'light-card']" style="--d:0.12s">
      <h3 class="text-lg font-bold mb-5 flex items-center gap-2.5">
        <span class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-sm"><i class="fas fa-users"></i></span>
        Peran Pengguna
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div v-for="(r, i) in peran" :key="r.role" class="reveal-child peran-card p-4 rounded-xl cursor-default" :style="{ '--d': (0.18 + i * 0.08) + 's' }">
          <div class="flex items-center gap-2.5 mb-1.5">
            <div class="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <i :class="[r.icon, 'text-blue-500 text-xs']"></i>
            </div>
            <p class="text-sm font-semibold">{{ r.role }}</p>
          </div>
          <p :class="['text-xs leading-relaxed pl-9', darkMode ? 'text-gray-400' : 'text-gray-500']">{{ r.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Tentang Kami -->
    <div :class="['rounded-2xl p-7 reveal', darkMode ? 'bg-gray-800' : 'light-card']" style="--d:0.14s">
      <h3 class="text-lg font-bold mb-5 flex items-center gap-2.5">
        <span class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-sm"><i class="fas fa-address-card"></i></span>
        Tentang Kami
      </h3>
      <div :class="['space-y-1 text-sm', darkMode ? 'text-gray-300' : 'text-gray-600']">
        <div v-for="(item, i) in kontak" :key="item.label" class="reveal-child kontak-item flex items-start gap-3 p-3 rounded-xl" :style="{ '--d': (0.2 + i * 0.07) + 's' }">
          <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <i :class="[item.icon, 'text-blue-500 text-xs']"></i>
          </div>
          <div>
            <p class="font-semibold text-xs mb-0.5">{{ item.label }}</p>
            <p :class="['text-xs leading-relaxed', darkMode ? 'text-gray-400' : 'text-gray-500']">{{ item.value }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, nextTick, ref } from 'vue'
const darkMode = false
const pageRef = ref(null)

const misi = [
  'Mempermudah administrasi data siswa, penempatan, dan monitoring PKL.',
  'Mendigitalisasi presensi, jurnal, izin, dan laporan akhir siswa.',
  'Mendukung penilaian siswa secara objektif oleh pembimbing industri.',
  'Menyediakan informasi PKL yang akurat bagi sekolah dan instansi terkait.',
]

const fitur = [
  { title: 'Manajemen Data', desc: 'Kelola users, sekolah, bidang PKL, dan siswa.', icon: 'fas fa-database', bg: 'bg-blue-500' },
  { title: 'Penempatan PKL', desc: 'Tempatkan siswa ke perusahaan beserta pembimbingnya.', icon: 'fas fa-map-marker-alt', bg: 'bg-green-500' },
  { title: 'Presensi Digital', desc: 'Presensi masuk & pulang dengan validasi pembimbing industri.', icon: 'fas fa-clipboard-check', bg: 'bg-yellow-500' },
  { title: 'Jurnal & Izin', desc: 'Catat kegiatan harian beserta bukti foto & pengajuan izin.', icon: 'fas fa-book', bg: 'bg-purple-500' },
  { title: 'Laporan Akhir', desc: 'Upload laporan akhir beserta link untuk divalidasi.', icon: 'fas fa-file-alt', bg: 'bg-red-500' },
  { title: 'Penilaian & Rekap', desc: 'Penilaian 8 aspek & lembar presensi bulanan siap cetak.', icon: 'fas fa-star', bg: 'bg-indigo-500' },
]

const peran = [
  { role: 'Admin', icon: 'fas fa-user-shield', desc: 'Mengelola seluruh data master, akun pengguna, dan pengaturan jam.' },
  { role: 'Siswa', icon: 'fas fa-user-graduate', desc: 'Mengisi presensi, jurnal, izin, laporan akhir, dan melihat penilaian.' },
  { role: 'Pembimbing Sekolah', icon: 'fas fa-chalkboard-teacher', desc: 'Memantau siswa binaan, memvalidasi laporan, dan menilai siswa.' },
  { role: 'Pembimbing Industri', icon: 'fas fa-hard-hat', desc: 'Memvalidasi presensi, jurnal, izin, dan memberikan penilaian.' },
]

const kontak = [
  { label: 'Bidang / Dinas', value: 'Aplikasi ini dikembangkan oleh Diskominfo sebagai bentuk layanan digital kepada sekolah dan dunia usaha.', icon: 'fas fa-building' },
  { label: 'Email', value: 'kontak@simpkl.go.id', icon: 'fas fa-envelope' },
  { label: 'Telepon', value: '(021) 000-0000', icon: 'fas fa-phone-alt' },
  { label: 'Alamat', value: 'Jl. Halaman Instansi Dinas No. 00, Kota/Kabupaten', icon: 'fas fa-map-marker-alt' },
]

let observer = null

onMounted(async () => {
  await nextTick()
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0, rootMargin: '0px 0px -5% 0px' }
  )
  if (pageRef.value) {
    pageRef.value.querySelectorAll('.reveal, .reveal-child').forEach((el) => observer.observe(el))
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
/* === SECTION REVEAL (smooth fade-up) === */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  will-change: transform, opacity;
  transition:
    opacity 1.1s cubic-bezier(0.22, 1, 0.36, 1),
    transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--d, 0s);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* === CHILD ITEM REVEAL === */
.reveal-child {
  opacity: 0;
  transform: translateY(8px);
  will-change: transform, opacity;
  transition:
    opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--d, 0s);
}
.reveal-child.visible {
  opacity: 1;
  transform: translateY(0);
}

/* === FITUR CARD HOVER === */
.fitur-card {
  transition:
    opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.5s ease;
  transition-delay: var(--d, 0s);
}
.fitur-card:hover {
  transform: translateY(-2px) scale(1.005);
  box-shadow: 0 8px 32px -14px rgba(59, 130, 246, 0.16);
  background-color: rgba(59, 130, 246, 0.02);
}
.fitur-card.visible:hover {
  transform: translateY(-2px) scale(1.005);
}
.fitur-card:hover .fitur-icon {
  transform: scale(1.06) rotate(-1.5deg);
}
.fitur-icon {
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

/* === PERAN CARD HOVER === */
.peran-card {
  transition:
    opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.5s ease;
  transition-delay: var(--d, 0s);
}
.peran-card:hover {
  transform: translateY(-1.5px);
  box-shadow: 0 6px 24px -10px rgba(59, 130, 246, 0.12);
  background-color: rgba(59, 130, 246, 0.02);
}

/* === KONTAK HOVER === */
.kontak-item {
  transition:
    opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.8s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.5s ease;
  transition-delay: var(--d, 0s);
}
.kontak-item:hover {
  background-color: rgba(59, 130, 246, 0.03);
}

/* === HERO FLOATING ICON === */
.hero-icon {
  animation: floatIcon 8s cubic-bezier(0.37, 0, 0.63, 1) infinite;
}
@keyframes floatIcon {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-2px) rotate(0.1deg); }
  50% { transform: translateY(-5px) rotate(0deg); }
  75% { transform: translateY(-3px) rotate(-0.1deg); }
}

/* === HERO TEXT ENTRANCE === */
.hero-title {
  opacity: 0;
  transform: translateY(12px);
  animation: heroIn 1.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.12s;
}
.hero-sub {
  opacity: 0;
  transform: translateY(8px);
  animation: heroIn 1.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.28s;
}
.hero-desc {
  opacity: 0;
  transform: translateY(6px);
  animation: heroIn 1.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.42s;
}
@keyframes heroIn {
  to { opacity: 1; transform: translateY(0); }
}

/* === BACKGROUND CIRCLES === */
.bg-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.04;
  will-change: transform;
}
.c1 {
  width: 180px; height: 180px;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  top: -60px; left: -60px;
  animation: drift1 35s ease-in-out infinite alternate;
}
.c2 {
  width: 120px; height: 120px;
  background: linear-gradient(135deg, #60a5fa, #93c5fd);
  bottom: -40px; right: -30px;
  animation: drift2 30s ease-in-out infinite alternate;
}
.c3 {
  width: 80px; height: 80px;
  background: #3b82f6;
  top: 40%; right: 15%;
  animation: drift1 40s ease-in-out infinite alternate;
  animation-delay: -10s;
}
.c4 {
  width: 60px; height: 60px;
  background: #60a5fa;
  bottom: 20%; left: 10%;
  animation: drift2 32s ease-in-out infinite alternate;
  animation-delay: -16s;
}
@keyframes drift1 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(6px, -5px) scale(1.015); }
  100% { transform: translate(-3px, 4px) scale(0.99); }
}
@keyframes drift2 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-5px, 6px) scale(0.99); }
  100% { transform: translate(4px, -3px) scale(1.01); }
}
</style>