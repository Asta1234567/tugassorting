let data = [];
let i = 0;
let j = 0;
let selesai = false;
let sedangMenukar = false; // Mencegah klik terlalu cepat saat animasi

// Fungsi mengambil input user
function inisialisasiData() {
    const input = document.getElementById('userInput').value;
    // Mengubah input string menjadi array angka
    data = input.split(',')
                .map(num => parseInt(num.trim()))
                .filter(num => !isNaN(num)); // Buang jika bukan angka

    if (data.length < 2) {
        updatePesan("⚠️ Masukkan minimal 2 angka ya, biar bisa dibandingin!");
        return;
    }

    // Reset variabel kontrol
    i = 0;
    j = 0;
    selesai = false;
    sedangMenukar = false;
    document.getElementById('nextBtn').disabled = false;
    renderData(); // Gambar gelembung awal
    updatePesan("✨ Gelembung siap! Ayo tekan tombol lanjut atau Enter.");
}

// Fungsi menggambar kotak angka ke layar
function renderData(activeIndices = [], sortedUpTo = -1) {
    const container = document.getElementById('array-container');
    container.innerHTML = ''; // Bersihkan container

    data.forEach((val, index) => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble-item';
        bubble.innerText = val;
        
        // Atur ukuran sedikit berdasarkan nilai (opsional, biar variasi)
        // const ukuran = Math.min(80, Math.max(50, 50 + val * 2));
        // bubble.style.width = ukuran + 'px';
        // bubble.style.height = ukuran + 'px';

        // Beri warna merah jika sedang dibandingkan
        if (activeIndices.includes(index)) {
            bubble.classList.add('active');
        }

        // Beri warna hijau jika sudah dipastikan urut (di bagian kanan)
        if (index > data.length - 1 - i && i > 0 || selesai) {
             bubble.classList.add('sorted');
        }

        container.appendChild(bubble);
    });
}

// Logika Bubble Sort langkah demi langkah (Paling Intuitif)
async function langkahBerikutnya() {
    if (selesai || sedangMenukar) return;

    if (i < data.length) {
        // Jika masih dalam satu putaran (pass)
        if (j < data.length - i - 1) {
            sedangMenukar = true; // Kunci tombol sebentar
            
            updatePesan(`👀 Membandingkan ${data[j]} dan ${data[j+1]}...`);
            renderData([j, j+1]); // Highlight dua gelembung

            // Beri jeda sedikit agar mata bisa melihat mana yang dibandingkan
            await tidur(600); 

            // Logika Inti: Jika kiri > kanan, TUKAR!
            if (data[j] > data[j+1]) {
                updatePesan(`😮 ${data[j]} lebih besar dari ${data[j+1]}, Gelembung TUKAR posisi!`);
                
                // Proses Penukaran (Swap)
                let temp = data[j];
                data[j] = data[j+1];
                data[j+1] = temp;
                
                renderData([j, j+1]); // Gambar ulang posisi baru
                await tidur(400); // Jeda setelah tukar
            } else {
                updatePesan(`✅ ${data[j]} tidak lebih besar dari ${data[j+1]}, Tetap aman.`);
                await tidur(300);
            }

            j++; // Pindah ke tetangga sebelahnya
            sedangMenukar = false; // Buka kunci tombol
            renderData([j, j+1]); // Highlight tetangga baru (persiapan)
            
            // Perbaikan visual kecil: jika j sudah di ujung, jangan highlight j+1
            if(j >= data.length - i - 1) {
                 renderData([]);
            }

        } else {
            // Putaran ini selesai, angka terbesar sudah "mengambang" ke paling kanan
            updatePesan(`🥳 Putaran selesai. Angka ${data[data.length - 1 - i]} sudah di posisi yang benar!`);
            j = 0; // Reset j ke awal
            i++;   // Lanjut ke putaran berikutnya
            
            // Cek apakah sudah benar-benar selesai semua
            if (i >= data.length - 1) {
                selesai = true;
                updatePesan("🎉 HORE! Semua gelembung sudah berbaris rapi dari kecil ke besar.");
                renderData(); // Gambar akhir (semua hijau)
                document.getElementById('nextBtn').disabled = true;
            } else {
                renderData(); // Update warna sorted
            }
        }
    }
}

// Fungsi pembantu untuk membuat jeda (animasi)
function tidur(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updatePesan(msg) {
    document.getElementById('pesan-logika').innerText = msg;
}

// Menambahkan fitur tekan Enter untuk lanjut
document.addEventListener('keydown', (event) => {
    // Pastikan tidak sedang dalam proses animasi tukar dan tombol tidak disable
    if (event.key === "Enter" && !sedangMenukar && !document.getElementById('nextBtn').disabled) {
        langkahBerikutnya();
    }
});