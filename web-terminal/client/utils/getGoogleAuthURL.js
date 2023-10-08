function getGoogleAuthURL() {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

  const options = {
    redirect_uri: 'http://localhost:3000/auth/google',
    client_id: '1094200596573-ajkpcm45m096inom84ru1e3rlqvg4ij5.apps.googleusercontent.com',
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  console.log(options);

  const qs = new URLSearchParams(options);

  console.log(qs.toString());

  return `${rootUrl}?${qs.toString()}`;
}
