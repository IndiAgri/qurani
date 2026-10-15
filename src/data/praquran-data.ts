export interface PraQuranWord {
  id: string;
  arabic: string;
  transliteration?: string;
  tokens: string[]; // individual clickable parts
}

export interface PraQuranRow {
  id: number;
  words: PraQuranWord[];
}

export interface PraQuranPage {
  pageNumber: number;
  title: string;
  subTitle: string;
  instruction: string;
  rows: PraQuranRow[];
}

export interface PraQuranJilid {
  id: string;
  name: string;
  totalPages: number;
  description: string;
  pages: Record<number, PraQuranPage>;
}

export const PRAQURAN_JILIDS: Record<string, PraQuranJilid> = {
  "yanbua-1": {
    id: "yanbua-1",
    name: "Yanbu'a Jilid 1",
    totalPages: 48,
    description: "Materi dasar mengenal huruf hijaiyah tunggal berharakat Fathah dengan kaidah Yanbu'a.",
    pages: {
      1: {
        pageNumber: 1,
        title: "Materi Huruf اَ (Alif) & بَ (Ba)",
        subTitle: "Pengenalan Huruf Berharakat Fathah Dasar",
        instruction: "Baca dengan suara jelas dan tegas, satu ketukan per huruf, tidak dipanjangkan.",
        rows: [
          {
            id: 1,
            words: [
              { id: "1-1", arabic: "اَ بَ", transliteration: "A - Ba", tokens: ["اَ", "بَ"] },
              { id: "1-2", arabic: "بَ اَ", transliteration: "Ba - A", tokens: ["بَ", "اَ"] },
              { id: "1-3", arabic: "اَ اَ", transliteration: "A - A", tokens: ["اَ", "اَ"] },
              { id: "1-4", arabic: "بَ بَ", transliteration: "Ba - Ba", tokens: ["بَ", "بَ"] },
            ],
          },
          {
            id: 2,
            words: [
              { id: "2-1", arabic: "بَ اَ بَ", transliteration: "Ba - A - Ba", tokens: ["بَ", "اَ", "بَ"] },
              { id: "2-2", arabic: "اَ بَ اَ", transliteration: "A - Ba - A", tokens: ["اَ", "بَ", "اَ"] },
              { id: "2-3", arabic: "اَ اَ بَ", transliteration: "A - A - Ba", tokens: ["اَ", "اَ", "بَ"] },
              { id: "2-4", arabic: "بَ بَ اَ", transliteration: "Ba - Ba - A", tokens: ["بَ", "بَ", "اَ"] },
            ],
          },
          {
            id: 3,
            words: [
              { id: "3-1", arabic: "اَ بَ اَ بَ", transliteration: "A - Ba - A - Ba", tokens: ["اَ", "بَ", "اَ", "بَ"] },
              { id: "3-2", arabic: "بَ اَ بَ اَ", transliteration: "Ba - A - Ba - A", tokens: ["بَ", "اَ", "بَ", "اَ"] },
              { id: "3-3", arabic: "اَ بَ بَ اَ", transliteration: "A - Ba - Ba - A", tokens: ["اَ", "بَ", "بَ", "اَ"] },
              { id: "3-4", arabic: "بَ اَ اَ بَ", transliteration: "Ba - A - A - Ba", tokens: ["بَ", "اَ", "اَ", "بَ"] },
            ],
          },
        ],
      },
      2: {
        pageNumber: 2,
        title: "Materi Huruf تَ (Ta) & ثَ (Tsa)",
        subTitle: "Pengenalan Makhraj Ujung Lidah",
        instruction: "Perhatikan makhraj huruf Tsa (keluar dari ujung lidah bertemu ujung gigi seri atas).",
        rows: [
          {
            id: 1,
            words: [
              { id: "p2-1", arabic: "تَ ثَ", transliteration: "Ta - Tsa", tokens: ["تَ", "ثَ"] },
              { id: "p2-2", arabic: "بَ تَ", transliteration: "Ba - Ta", tokens: ["بَ", "تَ"] },
              { id: "p2-3", arabic: "ثَ اَ", transliteration: "Tsa - A", tokens: ["ثَ", "اَ"] },
              { id: "p2-4", arabic: "تَ بَ ثَ", transliteration: "Ta - Ba - Tsa", tokens: ["تَ", "بَ", "ثَ"] },
            ],
          },
          {
            id: 2,
            words: [
              { id: "p2-5", arabic: "اَ تَ ثَ", transliteration: "A - Ta - Tsa", tokens: ["اَ", "تَ", "ثَ"] },
              { id: "p2-6", arabic: "تَ اَ بَ", transliteration: "Ta - A - Ba", tokens: ["تَ", "اَ", "بَ"] },
              { id: "p2-7", arabic: "ثَ بَ تَ", transliteration: "Tsa - Ba - Ta", tokens: ["ثَ", "بَ", "تَ"] },
              { id: "p2-8", arabic: "بَ ثَ اَ", transliteration: "Ba - Tsa - A", tokens: ["بَ", "ثَ", "اَ"] },
            ],
          },
          {
            id: 3,
            words: [
              { id: "p2-9", arabic: "ثَ ثَ تَ", transliteration: "Tsa - Tsa - Ta", tokens: ["ثَ", "ثَ", "تَ"] },
              { id: "p2-10", arabic: "تَ تَ ثَ", transliteration: "Ta - Ta - Tsa", tokens: ["تَ", "تَ", "ثَ"] },
              { id: "p2-11", arabic: "اَ بَ تَ ثَ", transliteration: "A - Ba - Ta - Tsa", tokens: ["اَ", "بَ", "تَ", "ثَ"] },
              { id: "p2-12", arabic: "ثَ تَ بَ اَ", transliteration: "Tsa - Ta - Ba - A", tokens: ["ثَ", "تَ", "بَ", "اَ"] },
            ],
          },
        ],
      },
      3: {
        pageNumber: 3,
        title: "Materi Huruf جَ (Jim), حَ (Ha), خَ (Kho)",
        subTitle: "Tenggorokan & Tengah Lidah",
        instruction: "Bedakan kejelasan ha' kecil (tengah tenggorokan) dengan kho (atas tenggorokan bersuara serak).",
        rows: [
          {
            id: 1,
            words: [
              { id: "p3-1", arabic: "جَ حَ خَ", transliteration: "Ja - Ha - Kho", tokens: ["جَ", "حَ", "خَ"] },
              { id: "p3-2", arabic: "حَ جَ خَ", transliteration: "Ha - Ja - Kho", tokens: ["حَ", "جَ", "خَ"] },
              { id: "p3-3", arabic: "خَ حَ جَ", transliteration: "Kho - Ha - Ja", tokens: ["خَ", "حَ", "جَ"] },
              { id: "p3-4", arabic: "جَ خَ حَ", transliteration: "Ja - Kho - Ha", tokens: ["جَ", "خَ", "حَ"] },
            ],
          },
          {
            id: 2,
            words: [
              { id: "p3-5", arabic: "جَ اَ تَ", transliteration: "Ja - A - Ta", tokens: ["جَ", "اَ", "تَ"] },
              { id: "p3-6", arabic: "حَ ثَ بَ", transliteration: "Ha - Tsa - Ba", tokens: ["حَ", "ثَ", "بَ"] },
              { id: "p3-7", arabic: "خَ بَ تَ", transliteration: "Kho - Ba - Ta", tokens: ["خَ", "بَ", "تَ"] },
              { id: "p3-8", arabic: "تَ حَ جَ", transliteration: "Ta - Ha - Ja", tokens: ["تَ", "حَ", "جَ"] },
            ],
          },
        ],
      },
      4: {
        pageNumber: 4,
        title: "Materi Huruf دَ (Dal) & ذَ (Dzal)",
        subTitle: "Ketukan Cepat & Tartil",
        instruction: "Ujung lidah menempel pada pangkal gigi seri atas untuk Dal, dan ujung gigi untuk Dzal.",
        rows: [
          {
            id: 1,
            words: [
              { id: "p4-1", arabic: "دَ ذَ", transliteration: "Da - Dza", tokens: ["دَ", "ذَ"] },
              { id: "p4-2", arabic: "حَ دَ ذَ", transliteration: "Ha - Da - Dza", tokens: ["حَ", "دَ", "ذَ"] },
              { id: "p4-3", arabic: "خَ دَ جَ", transliteration: "Kho - Da - Ja", tokens: ["خَ", "دَ", "جَ"] },
              { id: "p4-4", arabic: "بَ ذَ دَ", transliteration: "Ba - Dza - Da", tokens: ["بَ", "ذَ", "دَ"] },
            ],
          },
          {
            id: 2,
            words: [
              { id: "p4-5", arabic: "دَ اَ رَ", transliteration: "Da - A - Ra", tokens: ["دَ", "اَ", "رَ"] },
              { id: "p4-6", arabic: "ذَ كَ رَ", transliteration: "Dza - Ka - Ra", tokens: ["ذَ", "كَ", "رَ"] },
              { id: "p4-7", arabic: "جَ دَ لَ", transliteration: "Ja - Da - La", tokens: ["جَ", "دَ", "لَ"] },
              { id: "p4-8", arabic: "خَ ذَ لَ", transliteration: "Kho - Dza - La", tokens: ["خَ", "ذَ", "لَ"] },
            ],
          },
        ],
      },
    },
  },
  "yanbua-2": {
    id: "yanbua-2",
    name: "Yanbu'a Jilid 2",
    totalPages: 43,
    description: "Materi pengenalan harakat Kasrah, Dhammah, serta bacaan panjang (Mad Thobi'i) 2 ketukan.",
    pages: {
      1: {
        pageNumber: 1,
        title: "Materi Harakat Kasrah ( ِ ) & Dhammah ( ُ )",
        subTitle: "Pengucapan Vokal I dan U yang Tepat",
        instruction: "Tarik bibir sedikit ke samping untuk kasrah, bulatkan bibir (monyong) untuk dhammah.",
        rows: [
          {
            id: 1,
            words: [
              { id: "y2-1-1", arabic: "اَ اِ اُ", transliteration: "A - I - U", tokens: ["اَ", "اِ", "اُ"] },
              { id: "y2-1-2", arabic: "بَ بِ بُ", transliteration: "Ba - Bi - Bu", tokens: ["بَ", "بِ", "بُ"] },
              { id: "y2-1-3", arabic: "تَ تِ تُ", transliteration: "Ta - Ti - Tu", tokens: ["تَ", "تِ", "تُ"] },
              { id: "y2-1-4", arabic: "ثَ ثِ ثُ", transliteration: "Tsa - Tsi - Tsu", tokens: ["ثَ", "ثِ", "ثُ"] },
            ],
          },
          {
            id: 2,
            words: [
              { id: "y2-1-5", arabic: "جَ جِ جُ", transliteration: "Ja - Ji - Ju", tokens: ["جَ", "جِ", "جُ"] },
              { id: "y2-1-6", arabic: "حَ حِ حُ", transliteration: "Ha - Hi - Hu", tokens: ["حَ", "حِ", "حُ"] },
              { id: "y2-1-7", arabic: "خَ خِ خُ", transliteration: "Kho - Khi - Khu", tokens: ["خَ", "خِ", "خُ"] },
              { id: "y2-1-8", arabic: "دَ دِ دُ", transliteration: "Da - Di - Du", tokens: ["دَ", "دِ", "دُ"] },
            ],
          },
          {
            id: 3,
            words: [
              { id: "y2-1-9", arabic: "رُ حِ مَ", transliteration: "Ru - Hi - Ma", tokens: ["رُ", "حِ", "مَ"] },
              { id: "y2-1-10", arabic: "كُ تِ بَ", transliteration: "Ku - Ti - Ba", tokens: ["كُ", "تِ", "بَ"] },
              { id: "y2-1-11", arabic: "سُ ئِ لَ", transliteration: "Su - I - La", tokens: ["سُ", "ئِ", "لَ"] },
              { id: "y2-1-12", arabic: "عُ لِ مَ", transliteration: "‘U - Li - Ma", tokens: ["عُ", "لِ", "مَ"] },
            ],
          },
        ],
      },
      2: {
        pageNumber: 2,
        title: "Materi Mad Thobi'i (Panjang 2 Harakat)",
        subTitle: "Alif sesudah Fathah, Ya sesudah Kasrah, Wawu sesudah Dhammah",
        instruction: "Ayunkan bacaan sepanjang 2 harakat (1 alif), jangan kurang atau berlebihan.",
        rows: [
          {
            id: 1,
            words: [
              { id: "y2-2-1", arabic: "بَا بِيْ بُوْ", transliteration: "Baa - Bii - Buu", tokens: ["بَا", "بِيْ", "بُوْ"] },
              { id: "y2-2-2", arabic: "تَا تِيْ تُوْ", transliteration: "Taa - Tii - Tuu", tokens: ["تَا", "تِيْ", "تُوْ"] },
              { id: "y2-2-3", arabic: "ثَا ثِيْ ثُوْ", transliteration: "Tsaa - Tsii - Tsuu", tokens: ["ثَا", "ثِيْ", "ثُوْ"] },
              { id: "y2-2-4", arabic: "جَا جِيْ جُوْ", transliteration: "Jaa - Jii - Juu", tokens: ["جَا", "جِيْ", "جُوْ"] },
            ],
          },
          {
            id: 2,
            words: [
              { id: "y2-2-5", arabic: "قَا لَ", transliteration: "Qoo - La", tokens: ["قَا", "لَ"] },
              { id: "y2-2-6", arabic: "كَانَ", transliteration: "Kaa - Na", tokens: ["كَا", "نَ"] },
              { id: "y2-2-7", arabic: "يَقُوْلُ", transliteration: "Ya - Quu - Lu", tokens: ["يَ", "قُوْ", "لُ"] },
              { id: "y2-2-8", arabic: "فِيْهَا", transliteration: "Fii - Haa", tokens: ["فِيْ", "هَا"] },
            ],
          },
        ],
      },
    },
  },
};
