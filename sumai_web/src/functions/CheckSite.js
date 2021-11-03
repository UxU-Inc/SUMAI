import imgSumaiLogo from '../images/SUMAI_logo.png';
import imgVOILogo from '../images/VOI_logo.png';
import imgCaiiLogo from '../images/Caii_logo.png';

import * as root from '../rootValue';

export const checkSite = () => {
  const hostname = window.location.search?.slice(1)?.split('url=')[1]?.split('&')[0];

  if (hostname === 'https://voi.sumai.co.kr/') {
    return {
      site: 'VOI',
      imgLogo: imgVOILogo,
      logoWidth: 63.75,
      logoHeight: 28.125,
      PrimaryColor: root.VOIPrimaryColor,
      SecondaryColor: root.VOISecondaryColor,
      HoverColor: root.VOIHoverColor,
    };
  } else if (hostname === 'https://caii.sumai.co.kr/' || hostname === 'https://caii_en.sumai.co.kr/') {
    return {
      site: 'Caii',
      imgLogo: imgCaiiLogo,
      logoWidth: 68,
      logoHeight: 30,
      PrimaryColor: root.CaiiPrimaryColor,
      SecondaryColor: root.CaiiSecondaryColor,
      HoverColor: root.CaiiHoverColor,
    };
  } else {
    return {
      site: 'SUMAI',
      imgLogo: imgSumaiLogo,
      logoWidth: 80,
      logoHeight: 28.2,
      PrimaryColor: root.PrimaryColor,
      SecondaryColor: root.SecondaryColor,
      HoverColor: root.HoverColor,
    };
  }
};
