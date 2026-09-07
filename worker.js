// 静的アセットに一致しないリクエストだけがここに来る (assets が先に評価される)。
// デッキは history モードの SPA なので、/<slug>/2 のようなページ URL には
// そのデッキの index.html を返し、Slidev 側でページを復元させる。
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const slug = url.pathname.match(/^\/([^/]+)\//)?.[1];
    if (slug) {
      const index = await env.ASSETS.fetch(new URL(`/${slug}/index.html`, url));
      if (index.ok) return index;
    }
    return new Response("Not Found", { status: 404 });
  },
};
