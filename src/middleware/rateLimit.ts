const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
// 3 pastes per minute
const RATE_LIMIT = 3; 
// 1 minute in milliseconds
const RATE_LIMIT_WINDOW = 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 60 * 1000);

function getClientIp(c: any): string {
  return c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
         c.req.header('cf-connecting-ip') ||
         c.req.header('x-real-ip') ||
         'unknown';
}

export const rateLimitMiddleware = async (c: any, next: any) => {
  const ip = getClientIp(c);
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    await next();
    return;
  }

  if (record.count >= RATE_LIMIT) {
    return c.json({ error: "Rate limit exceeded: Maximum 5 pastes per minute" }, 429);
  }

  record.count++;
  console.log(`Rate limit: ${record.count}/${RATE_LIMIT} for IP: ${ip}`);
  await next();
};
