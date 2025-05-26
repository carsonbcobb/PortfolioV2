// Initialize Koalendar
window.Koalendar = window.Koalendar || function() {
    (window.Koalendar.props = window.Koalendar.props || []).push(arguments);
};

// Load the widget script
const script = document.createElement('script');
script.src = 'https://koalendar.com/assets/widget.js';
script.async = true;
document.body.appendChild(script);

// Initialize the widget when the script loads
script.onload = function() {
    window.Koalendar('inline', {
        url: 'https://koalendar.com/e/meet-with-carson-koaUwc9W',
        selector: '#inline-widget-meet-with-carson-koaUwc9W'
    });
};