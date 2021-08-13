export function returnUrl() {
    const url = window.location.search?.slice(1)?.split('url=')[1]?.split('&')[0];

    if (/^https:\/\/.*?.sumai.co.kr\/.*$/i.test(url)) {
        return url;
    }

    return '/';
}

export const onClickLink = (url) => (e) => {
    moveLink(url)
};

export const onClickExternLink = (url) => (e) => {
    moveLink(url)
};

function moveLink(url) {
    window.location.assign(url);
}