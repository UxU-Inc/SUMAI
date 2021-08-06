import imgSumaiLogo from '../images/sumai_logo_blue.png';
import imgVoiLogo from '../images/VOI_logo.png';

import * as root from '../rootValue';

export const checkSite = () => {
  const hostname = window.location.search?.slice(1)?.split('url=')[1]?.split('&')[0];

  if (hostname === "https://voi.sumai.co.kr/") return { site: "VOI", imgLogo: imgVoiLogo, PrimaryColor: root.VoiPrimaryColor, HoberColor: root.VoiHoberColor };
  else return { site: "SUMAI", imgLogo: imgSumaiLogo, PrimaryColor: root.PrimaryColor, HoberColor: root.HoberColor };
}