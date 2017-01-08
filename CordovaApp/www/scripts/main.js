require.config({
    baseUrl: 'scripts',
    
    paths: {
        jquery: 'jquery-1.12.4.min',
        jquerymobile: 'jquery.mobile-1.4.5.min',
        iscroll: 'iscroll',
        iscrollprobe: 'iscroll-probe',
        template: 'template-debug',
        domready: 'domReady',
        index: 'index'
    },
});
//require(['domready'], function (doc) {
    require(['index'], function (index) {
        index.docReady();
    });
//});
