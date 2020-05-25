import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';

export default class Category extends CatalogPage {
    onReady() {
        compareProducts(this.context.urls);

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }
        this.getAdd3ToCart();
    }

    initFacetedSearch() {
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('body').triggerHandler('compareReset');

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        });
    }

    getAdd3ToCart() { 
        $("button#add3ToCart").click(function() {

                var cartItems = {"lineItems": [
                    {
                        "quantity": 1,
                        "productId": 93,
                        "variantId": 52
                    },
                    {
                        "quantity": 1,
                        "productId": 86
                    },
                    {
                        "quantity": 1,
                        "productId": 103
                    }
                ]};
                
                let url = `/api/storefront/carts`;
    
                fetch(url, {
                    method: "POST",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(cartItems),
                })
                .then(response => response.json());
    
                url = `/api/storefront/carts?include=lineItems.physicalItems.options`;
    
                fetch(url, {
                    method: "GET",
                    credentials: "same-origin"
                })
                .then(response => response.json());

        });
    }
}
