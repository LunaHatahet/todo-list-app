exports.index = (req, res, next) => {
    res.render('index', { pageTitle: 'Index', path: '/' });
};

exports.about = (req, res, next) => {
    res.render('about', { pageTitle: 'About', path: '/about' });
};
