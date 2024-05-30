import prometheus from 'prom-client';

prometheus.collectDefaultMetrics();

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: Request) {
    const metrics = await prometheus.register.metrics();
    return new Response(metrics, { headers: { 'Content-Type': prometheus.register.contentType } });
}
