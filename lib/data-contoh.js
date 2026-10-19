export const produkContoh = [
  {
    id: 1,
    nama: "Bunga Anggrek",
    harga: 45000,
    deskripsi:
      "Bunga Anggrek",
    foto_url: "/produk/anggrek.jpg",
    kategori: "Bunga",
  },
  {
    id: 2,
    nama: "Bunga Matahari",
    harga: 15000,
    deskripsi: "Bunga Matahari",
    foto_url: "/produk/matahari.jpg",
    kategori: "Bunga",
  },
  {
    id: 3,
    nama: "Bunga Mawar Merah",
    harga: 25000,
    deskripsi: "Bunga Mawar Merah.",
    foto_url: "/produk/mawar merah.jpg",
    kategori: "Bunga",
  },
  {
    id: 4,
    nama: "Bunga Melati",
    harga: 85000,
    deskripsi: "Bunga Melati.",
    foto_url: "/produk/melati.jpg",
    kategori: "Bunga",
  },
  {
    id: 5,
    nama: "Bunga Tulip",
    harga: 120000,
    deskripsi: "Bunga Tulip.",
    foto_url: "/produk/tulip.jpg",
    kategori: "Bunga",
  },

];

export function cariProdukContoh(id) {
  return produkContoh.find((produk) => String(produk.id) === String(id));
}
