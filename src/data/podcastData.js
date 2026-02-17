// Podcast data mapping
// Files stored in public/podcasts/knizky/ and public/podcasts/PSI/

// Book podcasts (CJ) – knižky subfolder
const bookPodcastMap = {
    1: '01_Lakomec.m4a',
    2: '02_Romeo_a_Julie.m4a',
    3: '03_Král_Lávra.m4a',
    4: '04_Povídky_a_básně.m4a',
    5: '05_Tyrolské_elegie.m4a',
    6: '06_Stařec_a_moře.m4a',
    7: '07_Malý_princ.m4a',
    8: '08_Petr_a_Lucie.m4a',
    9: '09_Na_západní_forntě_klid.m4a',
    10: '10_Velký_Gatsby.m4a',
    11: '11_Farmě_zvířat.m4a',
};

// PSI podcasts – PSI subfolder (question ID → filename)
const psiPodcastMap = {
    11: 'Jak_studená_válka_a_ARPANET_stvořily_internet.m4a',
    12: 'Jak_fyzická_vrstva_mění_data_na_signál.m4a',
    13: 'Jak_linková_vrstva_krotí_síťový_chaos.m4a',
    14: 'Strojovna_internetu_a_směrování_IP_adres.m4a',
    15: 'Technická_odysea_emailu_z_Prahy_do_Sydney.m4a',
    16: 'Jak_sítě_doručují_a_šifrují_vaše_data.m4a',
    17: 'Jak_fungují_protokoly_DNS_HTTP_a_e-mail.m4a',
    18: 'Síťová_infrastruktura_od_kabelů_po_routery.m4a',
    19: 'Ethernet_od_sdíleného_kabelu_k_optice.m4a',
    20: 'Wi-Fi_a_Bluetooth_na_neviditelné_dálnici.m4a',
};

// PSI question titles for display
export const psiQuestionTitles = {
    11: 'Historie a vývoj počítačových sítí',
    12: 'Fyzická vrstva ISO/OSI',
    13: 'Linková vrstva ISO/OSI',
    14: 'Síťová vrstva ISO/OSI',
    15: 'Adresace a směřování v sítích',
    16: 'Transportní, relační a prezentační vrstva',
    17: 'Aplikační vrstva ISO/OSI',
    18: 'Síťové prvky a strukturovaná kabeláž',
    19: 'Ethernet',
    20: 'Bezdrátové síťové technologie',
};

// --- Book podcast helpers ---
export const hasPodcast = (bookId) => !!bookPodcastMap[bookId];

export const getPodcastUrl = (bookId) => {
    const filename = bookPodcastMap[bookId];
    if (!filename) return null;
    return `/podcasts/knizky/${encodeURIComponent(filename)}`;
};

export const podcastBookIds = Object.keys(bookPodcastMap).map(Number).sort((a, b) => a - b);

// --- PSI podcast helpers ---
export const hasPsiPodcast = (questionId) => !!psiPodcastMap[questionId];

export const getPsiPodcastUrl = (questionId) => {
    const filename = psiPodcastMap[questionId];
    if (!filename) return null;
    return `/podcasts/PSI/${encodeURIComponent(filename)}`;
};

export const psiPodcastIds = Object.keys(psiPodcastMap).map(Number).sort((a, b) => a - b);

// Legacy default export (book map only)
export default bookPodcastMap;
