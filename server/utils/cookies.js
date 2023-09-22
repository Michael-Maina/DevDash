import session from './session.js';

class Cookies {
  static async setCookies(token, expiration) {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + expiration * 60 * 60 * 1000);
    expiryDate.toUTCString();

    const cookiesToSend = [
      `session=${token}`,
      `Expires=${expiryDate}`,
      'domain=flanders.tech',
      'SameSite=Strict',
    ];

    return cookiesToSend;
  }
}

export default Cookies;
