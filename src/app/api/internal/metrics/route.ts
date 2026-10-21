import prometheus from '@prometheus-io/client';

prometheus.collectDefaultMetrics();

export async function GET(_: Request) {
    const metrics = await prometheus.register.metrics();
    return new Response(metrics, { headers: { 'Content-Type': prometheus.register.contentType } });
}
