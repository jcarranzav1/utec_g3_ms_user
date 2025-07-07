window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    let name = params.get('url') || 'users';

    name = name.toLowerCase().replace(/(\.swagger)?(\.yaml)?$/, '');

    const specPath = `/${name}.swagger.yaml`;
    const base = window.location.origin.replace(/\/swagger-ui\/?$/, '');
    const specUrl = base + specPath;

    window.ui = SwaggerUIBundle({
        url: specUrl,
        dom_id: '#swagger-ui',
        presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
        ],
        layout: 'StandaloneLayout'
    });
};
