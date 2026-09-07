import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { sessionId, message } = await request.json();
    const trimmed = (message || '').trim();
    const lower = trimmed.toLowerCase();

    const currentSessionId = sessionId || crypto.randomUUID();

    let reply = '';
    const serviceCards: Array<{ slug: string; reason: string }> = [];

    if (trimmed.startsWith('[IDEIA]: ')) {
      const ideaText = trimmed.replace('[IDEIA]: ', '');
      reply = `Excelente. Analisando rapidamente sua ideia, o próximo passo para viabilizá-la é construirmos um escopo técnico fechado (MVP). Precisaremos definir a arquitetura de dados, as integrações essenciais e o fluxo de usuários.\n\nPara desenharmos essa arquitetura juntos e entendermos o investimento necessário, clique no botão do WhatsApp logo abaixo e fale diretamente com um especialista da nossa equipe.`;
    } else if (lower.includes('landing page') || lower.includes('lp')) {
      reply = 'Para Landing Pages de Alta Conversão, nosso prazo contratual de entrega é de até 3 dias úteis. Entregamos design mobile-first com carregamento instantâneo, player VSL nativo e Bônus de Tagueamento GA4 e Pixels de Base inclusos.\n\nQual é o produto ou oferta que você vai anunciar?';
      serviceCards.push({
        slug: 'landing-pages-de-conversao',
        reason: 'Entrega ágil em 3 dias com foco em conversão imediata de tráfego.'
      });
    } else if (lower.includes('tracking') || lower.includes('pixel') || lower.includes('capi') || lower.includes('tagueamento')) {
      reply = 'O Tracking de Funil Server-Side é fundamental para recuperar dados de conversão perdidos por bloqueadores de anúncios e restrições do iOS. Implementamos Meta CAPI e GA4 via GTM Server-Side com validação em tempo real.\n\nVocê já roda campanhas no Meta Ads ou Google Ads hoje?';
      serviceCards.push({
        slug: 'tagueamento-de-fluxo',
        reason: 'Recupere até 30% dos dados de vendas do seu tráfego pago.'
      });
    } else if (lower.includes('loja') || lower.includes('e-commerce') || lower.includes('dropshipping')) {
      reply = 'Desenvolvemos lojas virtuais Headless em Next.js com foco em velocidade extrema, checkout transparente integrado e infraestrutura em Edge que não cai em picos de vendas.\n\nQual é o segmento da sua loja e sua média de pedidos mensal?';
      serviceCards.push({
        slug: 'e-commerces-globais',
        reason: 'Infraestrutura moderna e rápida para operações que não podem travar.'
      });
    } else if (lower.includes('pix')) {
      reply = 'Integramos a API Pix diretamente no seu sistema para gerar QR Codes dinâmicos com confirmação instantânea via webhooks em menos de 3 segundos, sem conciliação manual.\n\nVocê precisa dessa integração para um checkout, aplicativo ou sistema interno?';
      serviceCards.push({
        slug: 'api-pix',
        reason: 'Confirmação em tempo real e eliminação de trabalho braçal.'
      });
    } else if (lower.includes('cardapio') || lower.includes('cardápio')) {
      reply = 'Nossos Cardápios Virtuais operam como Progressive Web Apps (PWAs) de abertura instantânea via QR Code, sem necessidade de download pelo cliente, com integração direta a pedidos no WhatsApp.\n\nQuantas mesas ou unidades sua operação atende?';
      serviceCards.push({
        slug: 'cardapios-virtuais',
        reason: 'Acesso instantâneo e aumento no ticket médio por pedido.'
      });
    } else if (lower.includes('sob medida') || lower.includes('sistema') || lower.includes('personalizado') || lower.includes('microsserviço') || lower.includes('integração')) {
      reply = 'Em projetos de Software Sob Medida, desenhamos a arquitetura com microsserviços, mensageria assíncrona (Redis/RabbitMQ) e painéis administrativos para substituir rotinas manuais e dar escala à sua operação.\n\nQual processo ou gargalo da sua empresa você deseja automatizar primeiro?';
      serviceCards.push({
        slug: 'solucao-personalizada',
        reason: 'Engenharia proprietária dimensionada exatamente para suas regras de negócio.'
      });
    } else {
      reply = 'Entendido. Mapeei sua solicitação para a área de engenharia e tecnologia da TZOLKIN.\n\nPara avançarmos com a estimativa de escopo e prazos, me informe o nome da sua empresa e o objetivo principal que você quer alcançar com esse software.';
    }

    return NextResponse.json({
      sessionId: currentSessionId,
      reply,
      serviceCards,
      leadData: null
    });
  } catch {
    return NextResponse.json(
      {
        sessionId: crypto.randomUUID(),
        reply: 'Mapeamos sua demanda. Você pode clicar no botão abaixo para dar sequência diretamente no WhatsApp com a equipe técnica da TZOLKIN.',
        serviceCards: [],
        leadData: null
      },
      { status: 200 }
    );
  }
}
