<script setup>
import { reactive, ref } from 'vue'

const formData = reactive({
  nama: '',
  nim: '',
  email: '',
  noHp: '',
  jurusan: '',
  region: '',
  semester: '',
  jenis: '',
  penjelasan: ''
})

const isLoading = ref(false)
const isSuccess = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  const GOOGLE_FORM_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSeEbbcAEB_mK4CS7UnE0XQjzph7K1hQkGQH41H5MKVB2-VMKg/formResponse'

  const body = new FormData()
  body.append('entry.892606121', formData.nama)
  body.append('entry.671180148', formData.nim)
  body.append('entry.246072437', formData.email)
  body.append('entry.68696174', formData.noHp)
  body.append('entry.1066675135', formData.jurusan)
  body.append('entry.855311139', formData.region)
  body.append('entry.1051767483', formData.semester)
  body.append('entry.753512526', formData.jenis)
  body.append('entry.564514121', formData.penjelasan)

  try {
    await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: body
    })
    
    isSuccess.value = true
    // Reset form
    Object.keys(formData).forEach(key => formData[key] = '')
    
    // Opsional: Redirect atau tampilkan pesan sukses selama 3 detik
    setTimeout(() => { isSuccess.value = false }, 5000)
  } catch (error) {
    alert('Terjadi kesalahan saat mengirim data.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div class="mx-auto max-w-4xl">
      
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight text-bslc-ink md:text-4xl">Formulir Kontribusi</h1>
        <p class="mt-1 text-sm text-bslc-muted md:text-base">
          Suaramu membantu kami menjadi lebih baik. Berikan feedback atau request postingan forum/video di bawah ini.
        </p>
      </div>

      <div v-if="isSuccess" class="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-800 shadow-sm">
        <p class="font-semibold">Berhasil!</p>
        <p>Data kamu telah terkirim ke sistem kami. Terima kasih!</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <form @submit.prevent="handleSubmit">
          
          <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            
            <div class="space-y-6">
              <h2 class="flex items-center border-b border-slate-200 pb-2 text-lg font-semibold text-bslc-ink">
                <span class="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-bslc-green text-xs font-bold text-white">1</span>
                Data Diri
              </h2>
              
              <div class="space-y-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Lengkap</label>
                <input v-model="formData.nama" type="text" required placeholder="Masukkan nama sesuai KTM"
                  class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D]" />
              </div>

              <div class="space-y-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">NIM</label>
                <input v-model="formData.nim" type="text" required placeholder="Contoh: 2601234567"
                  class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D]" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">Email</label>
                  <input v-model="formData.email" type="email" required placeholder="user@binus.ac.id"
                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D]" />
                </div>
                <div class="space-y-1">
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">No. HP (WA)</label>
                  <input v-model="formData.noHp" type="tel" required placeholder="0812..."
                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D]" />
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <h2 class="flex items-center border-b border-slate-200 pb-2 text-lg font-semibold text-bslc-ink">
                <span class="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-bslc-green text-xs font-bold text-white">2</span>
                Request Postingan Forum/Video
              </h2>

              <div class="space-y-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">Jurusan</label>
                <input v-model="formData.jurusan" type="text" required placeholder="Contoh: Computer Science"
                  class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D]" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">Region</label>
                  <select v-model="formData.region" required
                    class="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D]">
                    <option value="" disabled>Pilih Region</option>
                    <option value="Kemanggisan">Kemanggisan</option>
                    <option value="Alam Sutera">Alam Sutera</option>
                    <option value="Bekasi">Bekasi</option>
                    <option value="Malang">Malang</option>
                    <option value="Bandung">Bandung</option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">Semester</label>
                  <input v-model="formData.semester" type="number" min="1" max="10" required
                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D]" />
                </div>
              </div>

              <div class="space-y-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">Jenis Laporan</label>
                <div class="flex gap-4 mt-2">
                  <label v-for="item in ['Forum', 'Video', 'Saran']" :key="item" class="flex-1">
                    <input type="radio" :value="item" v-model="formData.jenis" class="hidden peer" name="jenis" required>
                    <div class="cursor-pointer rounded-lg border border-slate-200 py-2 text-center text-sm text-slate-600 transition-all hover:bg-slate-50 peer-checked:border-bslc-green peer-checked:bg-bslc-green/10 peer-checked:font-semibold peer-checked:text-bslc-green">
                      {{ item }}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div class="md:col-span-2 mt-2 space-y-1">
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">Penjelasan (Sertakan Link Jika Ada)</label>
              <textarea v-model="formData.penjelasan" rows="5" required
                placeholder="Tuliskan keluhan, masukan, atau link video di sini..."
                class="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D]"></textarea>
            </div>

          </div>

          <div class="mt-8">
            <button type="submit" :disabled="isLoading"
              class="flex w-full items-center justify-center rounded-lg bg-bslc-green px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-bslc-green-dark disabled:cursor-not-allowed disabled:opacity-60">
              <span v-if="!isLoading">Kirim Sekarang</span>
              <span v-else class="flex items-center">
                <svg class="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Memproses...
              </span>
            </button>
          </div>

        </form>
      </div>
    </div>
  </section>
</template>