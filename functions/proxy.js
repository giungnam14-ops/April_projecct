export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const target = url.searchParams.get('url');

  if (!target) {
    return new Response('Target URL is missing', { status: 400 });
  }

  try {
    const response = await fetch(target, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8'
      },
      // Pexels redirects to final CDN, we must follow
      redirect: 'follow'
    });

    // Reconstruct the response to inject our own CORS headers
    const proxyResponse = new Response(response.body, response);
    proxyResponse.headers.set('Access-Control-Allow-Origin', '*');
    proxyResponse.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    proxyResponse.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

    return proxyResponse;
  } catch (err) {
    return new Response('Proxy Error: ' + err.message, { status: 500 });
  }
}
