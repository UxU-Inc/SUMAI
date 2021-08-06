export function returnUrl() {
    const url=window.location.search?.slice(1)?.split('url=')[1]?.split('&')[0];

    if(/^https:\/\/.*?.sumai.co.kr\/.*$/i.test(url)) {
        return url;
    }

    return '/';
}