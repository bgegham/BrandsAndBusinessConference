module.exports = {
    development: {
        baseUrl : "http://176.32.196.113:8000",
        secret: 'c6ddbf5047efc9s4e0d8ff9a87f4b5acb92abb8sdd26662ff2ddc74e33d1e24e0af7ssaa904825ae632e967418s98b1effd06531s15637cdca372bff0004f035',
        mongo_url: 'mongodb://127.0.0.1:27017/maeuticaAgenda?connectTimeoutMS=600000&socketTimeoutMS=600000',
        SENDGRID_API_KEY : "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",
        EMAIL_FROM : "purchase@ticket",
        http_port: 8000,
        http_host: '0.0.0.0'
    },
    production: {
        baseUrl : "http://37.186.125.214:8080",
        secret: 'c6ddbf5047efc9s4e0d8ff9a87f4b5acb92abb8sdd26662ff2ddc74e33d1e24e0af7ssaa904825ae632e967418s98b1effd06531s15637cdca372bff0004f035',
        mongo_url: 'mongodb://localhost/brandsAndBusinessConference',
        SENDGRID_API_KEY : "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",
        EMAIL_FROM : "purchase@ticket",
        http_port: 8080,
        http_host: '0.0.0.0'
    }
};