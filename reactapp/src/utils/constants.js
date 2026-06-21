export const API_BASE_URL = (() => {
  const { host } = window.location;
  if (host.includes('premiumproject.examly.io') && host.startsWith('8081-')) {
    const rest = host.substring('8081-'.length);
    return `https://8080-${rest}/api`;
  }
  return 'http://8080-fdcbfdacddfcfbfabaabafaeccbaaffec.premiumproject.examly.io/api';
})();