export const serializeQueryString = (obj: Record<string, string>) => {
  const str = [];
  for (const p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
};

export const setRedirectUrl = () => {
  window.localStorage.setItem('redirectUrl', window.location.pathname);
};

export const getRedirectUrl = () => {
  return window.localStorage.getItem('redirectUrl');
};
