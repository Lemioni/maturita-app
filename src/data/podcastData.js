// Podcast data mapping: book ID → podcast filename
// Files stored in public/podcasts/

const podcastMap = {
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

export const hasPodcast = (bookId) => !!podcastMap[bookId];

export const getPodcastUrl = (bookId) => {
    const filename = podcastMap[bookId];
    if (!filename) return null;
    return `/podcasts/${encodeURIComponent(filename)}`;
};

// Ordered list of book IDs that have podcasts
export const podcastBookIds = Object.keys(podcastMap).map(Number).sort((a, b) => a - b);

export default podcastMap;
