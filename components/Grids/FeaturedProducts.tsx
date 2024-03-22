import { ProductRecord, SiteLocale } from '@/graphql/types/graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import Link from 'next/link';
import { Image as DatoImage, ResponsiveImageType } from 'react-datocms';

type PropTypes = {
  products: ProductRecord[];
  lng: SiteLocale;
  currencySymbol: Maybe<string>;
  sale: Maybe<string>;
};

const FeaturedProducts = ({
  products,
  lng,
  currencySymbol,
  sale,
}: PropTypes) => {
  return (
    <>
      <div className="bg-white py-6 sm:py-8 lg:mx-56 lg:py-12 px-16 lg:px-8">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-3">
            {products.map((product) => {
              const isOnSale = product?.sale === 'on_sale';
              return (
                <div key={product.id}>
                  <Link
                    href={`/${lng}/product/${product.slug}`}
                    className="group relative mb-2 block h-96 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:mb-3"
                  >
                    <div className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-105">
                      <DatoImage
                        data={
                          product.productImages[0]
                            .responsiveImage as ResponsiveImageType
                        }
                        className="h-full w-full object-contain"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="50% 50%"
                      />
                    </div>

                    {isOnSale && (
                      <div className="absolute bottom-2 left-0 flex gap-2">
                        <span className="rounded-r-lg bg-red-500 px-3 py-1.5 text-sm font-semibold uppercase tracking-wider text-white">
                          {sale}
                        </span>
                      </div>
                    )}
                  </Link>

                  <div className="flex items-start justify-between gap-2 px-2">
                    <div className="flex flex-col">
                      <a
                        href="#"
                        className="text-lg font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-xl"
                      >
                        {product.name}
                      </a>
                      <span className="text-gray-500">
                        {product.brand?.name}
                      </span>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-bold text-gray-600 lg:text-lg">
                        {currencySymbol}
                        {isOnSale ? product.salePrice : product.price}
                      </span>
                      {isOnSale && (
                        <span className="text-sm text-red-500 line-through">
                          {currencySymbol}
                          {product.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturedProducts;
