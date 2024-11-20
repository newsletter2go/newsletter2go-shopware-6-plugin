# Newsletter2Go - Shopware Plugin

To connect Shopware 6 to your Newsletter2go account, synchronize contacts and order them in groups easily.

Enabling [conversion tracking](https://www.newsletter2go.com/features/newsletter-conversion-tracking/) using this plugin is super easy as well.

# Run locally in docker

1. Run ``docker compose up -d`` to start the container
2. Access the shopware installation at http://localhost or login to http://localhost/admin with the following credentials:
   - Username: admin
   - Password: shopware
3. Install the plugin in the shopware installation

## Build and Deploy

In order to build the plugin you can run the following command:

    make VERSION=4.0.00

This will create `shopware6-nl2go-v4.0.00.zip` which you can then upload to your shop.

To get a ready to use plugin check Shopware 6 store or download it from our [download center](https://www.newsletter2go.de/download-center)


## License

Check the [LICENSE](./LICENSE) here.


## Copyright
[https://www.newsletter2go.de](https://www.newsletter2go.de)


