import imgSumaiLogo from '../images/SUMAI_logo.png';
import imgVOILogo from '../images/VOI_logo.png';

import * as root from '../rootValue';

export const checkSite = () => {
  const hostname = window.location.search?.slice(1)?.split('url=')[1]?.split('&')[0];

  if (hostname === "https://voi.sumai.co.kr/") {
    return {
      site: "VOI",
      imgLogo: imgVOILogo,
      logoWidth: 63.75,
      logoHeight: 28.125,
      PrimaryColor: root.VOIPrimaryColor,
      SecondaryColor: root.VOISecondaryColor,
      HoberColor: root.VOIHoberColor,
    };
  }
  else {
    return {
      site: "SUMAI",
      imgLogo: imgSumaiLogo,
      logoWidth: 80,
      logoHeight: 28.2,
      PrimaryColor: root.PrimaryColor,
      SecondaryColor: root.SecondaryColor,
      HoberColor: root.HoberColor,
    };
  }
}