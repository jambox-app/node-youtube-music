import ytMusic from '../src';

const main = () =>
  ytMusic.searchMusics('DJOKO', { lang: 'en-GB', country: 'FR' });

main().then((results) => console.log(results));
