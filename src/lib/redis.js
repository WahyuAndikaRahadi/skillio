
export const redis = {
  async get(key) {
    try {
      const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/${key}`, {
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
        next: { revalidate: 0 }
      });
      const data = await res.json();
      return data.result ? JSON.parse(data.result) : null;
    } catch (e) {
      console.error("Redis Get Error:", e);
      return null;
    }
  },

  async set(key, value, ex = 86400) {
    try {
      await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/set/${key}?ex=${ex}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
        body: JSON.stringify(value),
      });
      return true;
    } catch (e) {
      console.error("Redis Set Error:", e);
      return false;
    }
  }
};
