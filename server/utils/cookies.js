export default class Cookies {
  static async setCookies(token, expiration, port) {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + expiration * 60 * 60 * 1000);
    expiryDate.toUTCString();

    const cookiesToSend = [
      `session=${token}`,
      `port=${port}`,
      `Expires=${expiryDate}`,
      'domain=flanders.tech',
      'SameSite=Strict',
      'Secure',
      'Path=/',
    ];

    return cookiesToSend;
  }
}
