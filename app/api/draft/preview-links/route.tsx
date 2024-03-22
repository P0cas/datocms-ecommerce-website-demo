import { NextRequest } from 'next/server';
import { headers as getHeaders } from 'next/headers';
import { SiteLocale } from '@/graphql/types/graphql';

type generatePreviewUrlParams = {
  item: any;
  itemType: any;
  locale: SiteLocale;
};

const generatePreviewUrl = ({
  item,
  itemType,
  locale,
}: generatePreviewUrlParams) => {
  switch (itemType.attributes.api_key) {
    case 'home':
      return `/${locale}/`;
    case 'showcase':
      return `/${locale}/showcase`;
    case 'store':
      return `/${locale}/stores`;
    case 'product':
      return `/${locale}/product/${item.attributes.slug}`;
    case 'legal_page':
      return `/${locale}/legal/${item.attributes.slug}`;
    case 'brand':
      return `/${locale}/products?brands=${item.id}`;
    case 'material':
      return `/${locale}/products?materials=${item.id}`;
    case 'collection':
      return `/${locale}/products?collections=${item.id}`;
  }
};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export async function OPTIONS(request: NextRequest) {
  return new Response('ok', {
    status: 200,
    headers,
  });
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const token = searchParams.get('token');

  if (token !== process.env.DRAFT_SECRET_TOKEN)
    return new Response('Invalid token', { status: 401 });

  const parsedRequest = await request.json();
  const url = generatePreviewUrl(parsedRequest);

  if (!url) {
    return new Response(JSON.stringify({ previewLinks: [] }), {
      status: 200,
      headers,
    });
  }

  const projectName = process.env.VERCEL_BRANCH_URL?.split('-git')[0];
  const baseUrl = (
    projectName ? `https://${projectName}.vercel.app` : process.env.URL
  ) as string;

  const isPublished = parsedRequest.item.meta.status === 'published';

  const previewLinks = [];

  if (parsedRequest.item.meta.status !== 'draft')
    previewLinks.push({
      label: 'Published version',
      url: `${baseUrl}/api/draft/disable?url=${url}`,
    });

  if (parsedRequest.item.meta.status !== 'published')
    previewLinks.push({
      label: 'Draft version',
      url: `${baseUrl}/api/draft/enable?url=${url}&token=${token}`,
    });

  return new Response(JSON.stringify({ previewLinks }), {
    status: 200,
    headers,
  });
}
