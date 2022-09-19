const isLogged = (req) => {
    return req.session.isLogged
}

const setLoggedAccount = (req, data) => {
    req.session.isLogged = true;
    req.session.account = data;
}

const getLoggedAccount = (req) => {
    return req.session.account;
}

module.exports = {
    isLogged,
    setLoggedAccount,
    getLoggedAccount
}