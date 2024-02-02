const PORT = 5100;
const prodURL = 'https://vivacious-jade-nightgown.cyclic.app';
const devURL = `http://localhost:${PORT}`;
export const URL = import.meta.env.MODE == 'development' ? devURL : prodURL;