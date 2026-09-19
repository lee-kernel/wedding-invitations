// Pages can keep serving deleted assets from its previous deployment cache.
// The invitation is mounted only at /wedding; leave other paths unoccupied.
const worker = {
  fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (
      pathname !== '/wedding/wedding.ics' &&
      (pathname === '/wedding' || pathname.startsWith('/wedding/'))
    ) {
      return env.ASSETS.fetch(request);
    }
    return new Response('Not Found', {
      status: 404,
      headers: { 'Cache-Control': 'no-store' },
    });
  },
};

export default worker;
