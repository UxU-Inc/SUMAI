import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { checkSite } from '../../functions/CheckSite';
const root = checkSite();


const useStyles = makeStyles(theme => ({
    button: {
        variant: 'contained',
        color: '#666',
        border: '1px solid #d4d4d4',
        width: '100%',
        height: '50px',
        fontSize: '15px',
        borderRadius: '0px',

        "&:hover": {
            fontWeight: "bold",
            background: "#ffffff",
            textDecorationLine: 'underline',
        },
    },
    subtitle: {
        fontSize: "20px",
        fontWeight: "bold",
    },
    content: {
        fontSize: "14px",
        fontFamily: "NotoSansKR-Regular",
        lineHeight: "25px",
    },
}));

export function PrivacyContentsPadding() {
    return (
        <Box style={{ padding: '20px' }}>
            <PrivacyContents />
        </Box>
    )
}

export default function PrivacyContents() {
    const classes = useStyles();

    return (
        <div style={{ minWidth: "250px" }}>
            <Typography className={classes.subtitle}>1. 개인정보처리방침이란?</Typography>
            <Typography className={classes.content}>
                {root.site}(이하"회사")는 이용자의 ‘동의를 기반으로 개인정보를 수집·이용 및 제공’하고 있으며,<br />
                ‘이용자의 권리 (개인정보 자기결정권)를 적극적으로 보장’합니다.<br />
                <br />
                회사는 정보통신서비스제공자가 준수하여야 하는 대한민국의 관계 법령 및 개인정보보호 규정, 가이드라인을 준수하고 있습니다.<br />
                <br />
                “개인정보 처리방침”이란 이용자의 소중한 개인정보를 보호함으로써 이용자가 안심하고 서비스를 이용할 수 있도록 회사가 준수해야 할 지침을 의미합니다.<br />
                <br />
                본 개인정보 처리방침은 {root.site} 서비스(이하 '{root.site}' 또는 '서비스'라 함)에 적용됩니다.
            </Typography>

            <div style={{ marginTop: "30px" }} />

            <Typography className={classes.subtitle}>2. 개인정보 수집</Typography>
            <Typography component={'span'} className={classes.content}>
                서비스 제공을 위한 필요 최소한의 개인정보를 수집하고 있습니다.<br />
                <br />
                회원 가입 시 또는 서비스 이용 과정에서 홈페이지 또는 개별 어플리케이션이나 프로그램 등을 통해 아래와 같은 서비스 제공을 위해 필요한 최소한의 개인정보를 수집하고 있습니다.<br />
                <br />
                [{root.site}]
                <ul style={{ margin: "0px" }}>
                    <li>필수 : 이메일, 비밀번호(SNS 가입이 아닌 이메일 가입의 경우), 이름(닉네임)</li>
                    <li>선택 : 생년월일, 성별</li>
                </ul>
                [고객센터]
                <ul style={{ margin: "0px" }}>
                    <li>필수 : 이메일</li>
                </ul>
                <br />
                회원가입 및 서비스 이용 과정에서 이용자가 개인정보 수집에 대해 동의를 하고 직접 정보를 입력하는 방법을 통해 개인정보를 수집합니다.<br />
                <br />
                서비스 이용 과정에서 이용자로부터 수집하는 개인정보는 아래와 같습니다.<br />
                PC웹, 모바일 웹/앱 이용 과정에서 단말기정보(OS, 화면사이즈), IP주소, 쿠키, 방문일시, 부정이용기록, 서비스 이용 기록 등의 정보가 자동으로 생성되어 수집될 수 있습니다.
            </Typography>

            <div style={{ marginTop: "30px" }} />

            <Typography className={classes.subtitle}>3. 개인정보 이용</Typography>
            <Typography component={'span'} className={classes.content}>
                회원관리, 서비스 제공·개선, 신규 서비스 개발 등을 위해 이용합니다.<br />
                <br />
                회원 가입 시 또는 서비스 이용 과정에서 홈페이지 또는 개별 어플리케이션이나 프로그램 등을 통해 아래와 같이 서비스 제공을 위해 필요한 최소한의 개인정보를 수집하고 있습니다.<br />
                <ul>
                    <li>회원 식별/가입의사 확인, 본인/연령 확인, 부정이용 방지</li>
                    <li>만 14세 미만 아동 개인정보 수집 시 법정 대리인 동의여부 확인, 법정 대리인 권리행사 시 본인 확인</li>
                    <li>신규 서비스 개발, 다양한 서비스 제공, 문의사항 또는 불만처리, 공지사항 전달</li>
                    <li>유료서비스 이용 시 컨텐츠 등의 전송이나 배송·요금 정산</li>
                    <li>서비스의 원활한 운영에 지장을 주는 행위(계정 도용 및 부정 이용 행위 등 포함)에 대한 방지 및 제재</li>
                    <li>이벤트/행사 참여 확인, 마케팅 및 광고 등에 활용</li>
                    <li>서비스 이용 기록, 접속 빈도 및 서비스 이용에 대한 통계, 프라이버시 보호 측면의 서비스 환경 구축, 맞춤형 서비스 제공, 서비스 개선에 활용</li>
                </ul>
            </Typography>

            <div style={{ marginTop: "30px" }} />

            <Typography className={classes.subtitle}>4. 개인정보 제공</Typography>
            <Typography className={classes.content}>
                {root.site}는 이용자의 별도 동의가 있는 경우나 법령에 규정된 경우를 제외하고는 이용자의 개인정보를 제3자에게 제공하지 않습니다.<br />
            </Typography>

            <div style={{ marginTop: "30px" }} />

            <Typography className={classes.subtitle}>5. 개인정보 파기</Typography>
            <Typography component={'span'} className={classes.content}>
                개인정보는 수집 및 이용목적이 달성되면 지체없이 파기하며, 절차 및 방법은 다음과 같습니다.<br />
                전자적 파일 형태인 경우 복구 및 재생되지 않도록 안전하게 삭제하고, 그 밖에 기록물, 인쇄물, 서면 등의 경우 분쇄하거나 소각하여 파기합니다.<br />
                <br />
                또한, {root.site}는 ‘개인정보 유효기간제’에 따라 1년간 서비스를 이용하지 않은 회원의 개인정보를 별도로 분리 보관 또는 삭제하고 있으며,<br />
                분리 보관된 개인정보는 4년간 보관 후 지체없이 파기합니다.<br />
                <br />
                이 외에 법령에 따라 일정기간 보관해야 하는 개인정보 및 해당 법령은 아래와 같습니다.<br />
                <ul>
                    <li>계약 또는 청약철회 등에 관한 기록 : 5년</li>
                    <li>대금결제 및 재화 등의 공급에 관한 기록 : 5년</li>
                    <li>소비자의 불만 또는 분쟁처리에 관한 기록 : 3년</li>
                    <li>표시·광고에 관한 기록 : 6개월</li>
                    <li>전자금융거래법 - 전자금융에 관한 기록 : 5년</li>
                    <li>통신비밀보호법 - 로그인 기록(로그기록자료, 접속지의 추적자료) : 3개월</li>
                </ul>
            </Typography>

            <div style={{ marginTop: "30px" }} />

            <Typography className={classes.subtitle}>6. 기타</Typography>
            <Typography component={'span'} className={classes.content}>
                {root.site}는 여러분의 권리를 보호합니다.<br />
                언제든 자신의 개인정보(만 14세 미만인 경우 법정 대리인)를 조회하거나 수정할 수 있으며 수집・이용에 대한 동의 철회 또는 가입 해지를 요청할 수도 있습니다.<br />
                보다 구체적으로는 서비스 내 설정 기능을 통한 변경, 가입 해지(동의 철회)를 위해서는 서비스 내 "계정삭제"를 클릭하면 되며, 고객센터를 통해 서면, 전화 또는 이메일로 연락하시면 지체 없이 조치하겠습니다.<br />
                개인정보의 오류에 대한 정정을 요청하신 경우 정정을 완료하기 전까지 해당 개인정보를 이용 또는 제공하지 않습니다.<br />
                <br />
                PC 기반 서비스의 제공을 위하여 쿠키를 이용하는 경우가 있습니다.<br />
                쿠키는 보다 빠르고 편리한 웹사이트 사용을 지원하고 맞춤형 서비스를 제공하기 위해 사용됩니다.<br />
                쿠키란?<br />
                웹사이트를 운영하는데 이용되는 서버가 이용자의 브라우저에 보내는 아주 작은 텍스트 파일로서 이용자 컴퓨터에 저장됩니다.<br />
                <br />
                사용목적<br />
                개인화되고 맞춤화된 서비스를 제공하기 위해서 이용자의 정보를 저장하고 수시로 불러오는 쿠키를 사용합니다. 이용자가 웹사이트에 방문할 경우 웹 사이트 서버는 이용자의 디바이스에 저장되어 있는 쿠키의 내용을 읽어 이용자의 환경설정을 유지하고 맞춤화된 서비스를 제공하게 됩니다. 쿠키는 이용자가 웹 사이트를 방문할 때, 웹 사이트 사용을 설정한대로 접속하고 편리하게 사용할 수 있도록 돕습니다. 또한, 이용자의 웹사이트 방문 기록, 이용 형태를 통해서 최적화된 광고 등 맞춤형 정보를 제공하기 위해 활용됩니다.<br />
                <br />
                쿠키 수집 거부
                쿠키에는 이름, 전화번호 등 개인을 식별하는 정보를 저장하지 않으며, 이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서, 이용자는 웹 브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수도 있습니다. 다만, 쿠키 설치를 거부할 경우 웹 사용이 불편해지며, 로그인이 필요한 일부 서비스 이용에 어려움이 있을 수 있습니다.<br />
                <br />
                설정 방법의 예<br />
                1) Internet Explorer의 경우<br />
                웹 브라우저 상단의 도구 메뉴 &gt; 인터넷 옵션 &gt; 개인정보 &gt; 설정<br />
                <br />
                2) Chrome의 경우<br />
                웹 브라우저 우측의 설정 메뉴 &gt; 화면 하단의 고급 설정 표시 &gt; 개인정보의 콘텐츠 설정 버튼 &gt; 쿠키<br />
                <br />
                개인정보보호와 관련해서 궁금하신 사항은?<br />
                서비스를 이용하면서 발생하는 모든 개인정보보호 관련 문의, 불만, 조언이나 기타 사항은 개인정보 보호책임자 및 담당부서로 연락해 주시기 바랍니다. {root.site}는 여러분의 목소리에 귀 기울이고 신속하고 충분한 답변을 드릴 수 있도록 최선을 다하겠습니다.<br />
                <br />
                개인정보 보호책임자 및 담당부서
                <ul>
                    <li>책임자: 이바다 (개인정보 보호책임자/CPO)</li>
                    <li>담당부서: 개인정보보호파트</li>
                    <li>문의 : 고객센터 : help@sumai.co.kr</li>
                </ul>
                또한 개인정보가 침해되어 이에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하셔서 도움을 받으실 수 있습니다.<br />
                <ul>
                    <li>개인정보침해신고센터 (<a href="https://privacy.kisa.or.kr" style={{ color: "#000", textDecoration: "none" }}>https://privacy.kisa.or.kr</a> / 국번없이 118)</li>
                    <li>대검찰청 사이버수사과 (<a href="https://spo.go.kr" style={{ color: "#000", textDecoration: "none" }}>https://spo.go.kr</a> / 국번없이 1301)</li>
                    <li>경찰청 사이버안전국 (<a href="https://cyberbureau.police.go.kr" style={{ color: "#000", textDecoration: "none" }}>https://cyberbureau.police.go.kr</a> / 국번없이 182)</li>
                </ul>

                <br />
                개인정보 처리방침이 변경되는 경우<br />
                법률이나 서비스의 변경사항을 반영하기 위한 목적 등으로 개인정보 처리방침을 수정할 수 있습니다. 개인정보 처리방침이 변경되는 경우 {root.site}는 변경 사항을 게시하며, 변경된 개인정보 처리방침은 게시한 날로부터 7일 후부터 효력이 발생합니다.<br />
                다만, 수집하는 개인정보의 항목, 이용목적의 변경 등과 같이 이용자 권리의 중대한 변경이 발생할 때에는 최소 30일 전에 미리 알려드리겠습니다.<br />
                <br />
                <ul>
                    <li>공고일자: 2021년 01월 03일</li>
                    <li>시행일자: 2021년 01월 03일</li>
                </ul>

            </Typography>

        </div>
    );
}