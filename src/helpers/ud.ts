import UAuth from '@uauth/js';
import setting from 'src/setting';

export default () => {
  return new UAuth({
    clientID: setting.UNSTOPPABLEDOMAIN_CLIENT_ID,
    clientSecret: setting.UNSTOPPABLEDOMAIN_CLIENT_SECRET,

    scope: 'openid email wallet',

    redirectUri: `${setting.APP_URL}/callback`,

    // This is the url that the auth server will redirect back to after logging out.
    postLogoutRedirectUri: `${setting.APP_URL}/logout`,
  });
};
