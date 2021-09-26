import * as React from 'react';
import {View} from 'react-native';

import theme from '~/components/theme/Style';
import Svg, {
  Circle,
  Ellipse,
  Path,
  Defs,
  LinearGradient,
  Stop,
  G,
  Rect,
} from 'react-native-svg';

export function SvgLogo(props) {
  return (
    <Svg width={286} height={171} viewBox="0 0 286 171" fill="none" {...props}>
      <Circle cx={58} cy={35.714} r={10} fill="#2A8CFF" fillOpacity={0.1} />
      <Ellipse
        cx={125}
        cy={8.214}
        rx={10}
        ry={8.214}
        fill="#2A8CFF"
        fillOpacity={0.1}
      />
      <Ellipse
        cx={56}
        cy={69.821}
        rx={10}
        ry={8.214}
        fill="#2A8CFF"
        fillOpacity={0.1}
      />
      <Ellipse
        cx={273.5}
        cy={78.446}
        rx={12.5}
        ry={10.268}
        fill="#2A8CFF"
        fillOpacity={0.1}
      />
      <Ellipse
        cx={155}
        cy={128.964}
        rx={10}
        ry={8.214}
        fill="#2A8CFF"
        fillOpacity={0.1}
      />
      <Ellipse
        cx={88}
        cy={59.143}
        rx={10}
        ry={8.214}
        fill="#2A8CFF"
        fillOpacity={0.1}
      />
      <Ellipse
        cx={197}
        cy={69.821}
        rx={10}
        ry={8.214}
        fill="#2A8CFF"
        fillOpacity={0.1}
      />
      <Ellipse
        cx={241}
        cy={128.964}
        rx={10}
        ry={8.214}
        fill="#2A8CFF"
        fillOpacity={0.1}
      />
      <Ellipse
        cx={195}
        cy={28.75}
        rx={5}
        ry={4.107}
        fill="#2A8CFF"
        fillOpacity={0.1}
      />
      <Ellipse
        cx={231}
        cy={18.893}
        rx={10}
        ry={8.214}
        fill="#2A8CFF"
        fillOpacity={0.1}
      />
      <Ellipse
        cx={20}
        cy={153.607}
        rx={20}
        ry={16.429}
        fill="#2A8CFF"
        fillOpacity={0.1}
      />
      <Path
        d="M126.192 97.349c4.902 0 9.753-2.647 9.753-8.693 0-5.45-3.818-8.58-9.753-8.58h-15.373v17.273h15.373zM130.035 117.135c6.128 0 12.191-2.647 12.191-8.692 0-5.451-4.772-8.581-12.191-8.581h-19.216v17.273h19.216z"
        fill="#37ADFF"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M100.606 71.606h56.975V68H97v60.581h60.581V114.628l-3.606-4.245v14.592h-53.369V71.606z"
        fill="#2D9CDB"
      />
      <Path
        d="M157.581 71.606h-3.606v15.536l3.606-4.468V71.606z"
        fill="#2D9CDB"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M157.581 81.875l-14.63 15.252h4.955l9.675-10.126v-5.126z"
        fill="#2D9CDB"
      />
      <Path d="M167 77.142v-4.955l-9.419 9.688V87L167 77.142z" fill="#2D9CDB" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M157.581 114.957V109.831l-9.675-10.127h-4.955l14.63 15.253z"
        fill="#2D9CDB"
      />
      <Path
        d="M167 124.645v-4.955l-9.419-9.859V114.957l9.419 9.688z"
        fill="#2D9CDB"
      />
      <Path d="M171 123h18v2h-18v-2z" fill="#707070" />
      <Path
        d="M177.756 109.2v4.004h-5.026V109.2h-1.582v9.8h1.582v-4.284h5.026V119h1.582v-9.8h-1.582zM187.515 119h1.946l-2.926-3.738c1.554-.294 2.464-1.344 2.464-2.954 0-1.848-1.204-3.108-3.332-3.108h-4.046v9.8h1.582v-3.654h1.512l2.8 3.654zm-4.312-8.288h2.296c1.288 0 1.904.658 1.904 1.61 0 .952-.602 1.624-1.904 1.624h-2.296v-3.234z"
        fill="#666"
      />
    </Svg>
  );
}

export function HeaderBgSVG() {
  return (
    <Svg width={'100%'} height={100} fill="none">
      <Path fill="url(#prefix__paint0_linear)" d="M0 0h414v100H0z" />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={207}
          y1={0}
          x2={207}
          y2={100}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#2E8DFF" stopOpacity={0.6} />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

// use in authHeader || FIRM PAY Logo
export function HeaderLogo(props) {
  return (
    <Svg
      width="83"
      height="17"
      viewBox="0 0 83 17"
      fill="none"
      xmlns="http://www.w3.org/2000/Svg">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M58.5936 7.08793H60.92C61.6438 7.08793 62.2049 6.90418 62.6019 6.53538C62.9996 6.16724 63.1984 5.65866 63.1984 5.01162C63.1984 4.35145 63.0107 3.83238 62.636 3.45439C62.2607 3.0764 61.6858 2.88741 60.9101 2.88741H58.5936V7.08793ZM60.8911 9.42401H58.5936V14.5472H55.7095V0.551147H60.9101C62.5638 0.551147 63.8389 0.919948 64.7359 1.65689C65.6336 2.39384 66.0818 3.43527 66.0818 4.78054C66.0818 5.73535 65.8751 6.53201 65.4617 7.16987C65.0483 7.80772 64.4222 8.31499 63.5829 8.69298L66.6108 14.4127V14.5472H63.5153L60.8911 9.42401ZM42.069 8.82768H47.6063V6.50135H42.069V2.88684H48.2986V0.551325H39.1855V14.5474H42.069V8.82768ZM53.0373 14.5474H50.1531V0.551337H53.0373V14.5474ZM75.6373 10.7023L72.0418 0.551147H68.2737V14.5472H71.1572V10.7214L70.8691 4.12694L74.6372 14.5472H76.6177L80.3949 4.11775L80.1069 10.7214V14.5472H83.0002V0.551147H79.2131L75.6373 10.7023Z"
        fill="#027DFF"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M29.2179 1.91564C29.567 1.77258 29.949 1.59278 30.3204 1.39919C30.8361 1.14381 31.3521 0.833983 31.8836 0.514816C32.1306 0.366505 32.381 0.216177 32.6362 0.0683594L32.7045 0.19698C32.0259 0.922769 31.3192 1.60393 30.5776 2.19913C29.8341 2.78515 29.0572 3.28191 28.2618 3.63627C27.4665 3.99064 26.6567 4.20326 25.8653 4.27675C25.0719 4.35288 24.2962 4.29513 23.5475 4.1501C22.0493 3.83905 20.666 3.19594 19.3036 2.53972C19.1434 2.46244 18.9834 2.38477 18.8234 2.30712C18.3026 2.05439 17.7823 1.80185 17.2562 1.5639C16.5724 1.24563 15.8794 0.954268 15.1609 0.729838L15.2147 0.55725C15.3723 0.531816 15.5272 0.523058 15.6827 0.51427C15.7318 0.511494 15.7809 0.508716 15.8302 0.505408C16.0317 0.504751 16.2305 0.509345 16.4313 0.515907C16.8329 0.529688 17.2214 0.583499 17.6079 0.64584C18.3784 0.774461 19.1192 0.97658 19.8411 1.1892C20.2345 1.30852 20.6226 1.43234 21.0066 1.55485C22.0292 1.88108 23.0226 2.19802 24.0101 2.396C25.3692 2.67293 26.717 2.70837 28.1338 2.29954C28.1713 2.28801 28.2089 2.27661 28.2465 2.26518C28.3868 2.22261 28.5279 2.17976 28.6687 2.12957C28.8372 2.07036 28.9983 2.0049 29.1774 1.93213L29.2179 1.91564ZM30.491 4.82864C29.6399 5.28931 28.8032 5.66796 27.9881 5.91273C26.3581 6.40621 24.7831 6.39243 23.2298 6.06694C22.0488 5.82237 20.8723 5.41559 19.6625 4.99728C19.2784 4.8645 18.891 4.73056 18.4991 4.60027C17.684 4.33384 16.85 4.07988 15.9831 3.90795C15.5493 3.82527 15.1116 3.75111 14.6621 3.72224C14.4364 3.70715 14.21 3.69599 13.9842 3.69205C13.9391 3.69347 13.8939 3.69461 13.8488 3.69575C13.6642 3.70041 13.4795 3.70508 13.2939 3.7288L13.2407 3.9027C14.0617 4.14026 14.8531 4.4664 15.6327 4.82798C16.3021 5.12837 16.9628 5.45623 17.6239 5.78431L17.9544 5.94817C19.4992 6.70808 21.0636 7.46012 22.7619 7.81711C23.6118 7.98707 24.4937 8.05335 25.3928 7.96935C26.2938 7.88207 27.2118 7.64977 28.1155 7.24947C29.0178 6.84917 29.9017 6.29006 30.7463 5.62858C31.5902 4.95792 32.396 4.19144 33.1678 3.36459L33.1002 3.23532C32.8806 3.3734 32.6638 3.51231 32.4489 3.64995L32.4486 3.65011C31.7844 4.07561 31.139 4.48902 30.491 4.82864ZM7.36943 6.08345C8.0611 5.92071 8.75014 5.83277 9.43327 5.79602C9.57961 5.78815 9.72464 5.78487 9.86835 5.78487C10.4006 5.78487 10.9236 5.83277 11.4426 5.89511C11.7721 5.93908 12.0995 5.99224 12.4224 6.0572C12.7459 6.12479 13.0629 6.21076 13.3785 6.30263C14.0111 6.48113 14.6221 6.72065 15.2219 6.97986L16.9346 7.76143C17.4983 8.02523 18.062 8.28313 18.6277 8.52331C20.8818 9.50175 23.1275 10.3653 25.5056 10.2065C25.8036 10.1868 26.1015 10.1475 26.4033 10.0897C26.6895 10.0331 26.9763 9.95704 27.2648 9.88051L27.3122 9.86792C27.9238 9.69533 28.54 9.43809 29.1588 9.12179C30.4057 8.5115 31.6407 7.61903 32.8974 6.68062L32.9663 6.8099C31.833 8.01342 30.634 9.10866 29.3577 9.96111C28.0846 10.8096 26.7374 11.3825 25.4124 11.603C24.0836 11.8307 22.7901 11.7244 21.5564 11.4455C20.3234 11.164 19.1395 10.7191 17.9833 10.2197C16.8303 9.71108 15.6996 9.14213 14.5748 8.57187C13.45 8.01211 12.2787 7.56784 11.0581 7.2896C9.83882 7.01267 8.57033 6.90308 7.27428 7.04023C6.62658 7.10389 5.97232 7.23251 5.31872 7.43988C4.66905 7.65249 4.00757 7.93008 3.394 8.35925L3.34806 8.21029C3.9518 7.60656 4.62377 7.19182 5.30297 6.84271C5.98217 6.49753 6.6758 6.26588 7.36943 6.08345ZM4.6041 9.48524C5.39551 9.31396 6.18036 9.22274 6.95733 9.19321C7.08136 9.18862 7.20539 9.186 7.3281 9.186C7.97777 9.186 8.61562 9.25031 9.24757 9.33496C9.62228 9.3868 9.99567 9.45308 10.3638 9.53052C10.73 9.61255 11.0922 9.7136 11.4512 9.81991C12.1711 10.0306 12.8673 10.3081 13.5524 10.608L15.5185 11.515C16.1668 11.8208 16.8159 12.1167 17.4675 12.3956C20.0622 13.5197 22.6707 14.5113 25.442 14.2882C25.7878 14.2586 26.1369 14.2081 26.4867 14.1359C26.8371 14.0631 27.1902 13.966 27.5432 13.8623C28.2533 13.6503 28.9666 13.3406 29.6779 12.9619C31.1144 12.2296 32.5286 11.1763 33.9533 10.0568L34.0202 10.1887C32.7209 11.5674 31.3415 12.8261 29.8781 13.8013C28.416 14.7751 26.8712 15.4313 25.3481 15.684C23.8244 15.9445 22.3406 15.8205 20.9245 15.5002C19.5077 15.1767 18.1519 14.6655 16.8224 14.0913C15.4968 13.5079 14.1995 12.8543 12.9067 12.2001C11.6139 11.557 10.2641 11.0464 8.86302 10.7281C7.46132 10.4105 6.00252 10.2852 4.51092 10.442C3.7661 10.5188 3.01275 10.6658 2.26202 10.9066C1.51458 11.1527 0.754007 11.4716 0.0479047 11.9671L0 11.8181C0.700196 11.1468 1.4693 10.692 2.24561 10.3108C3.02324 9.93147 3.81466 9.68276 4.6041 9.48524Z"
        fill="#B31F31"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.2062 0C14.2062 0 12.8648 1.41417 12.2814 3.19255C12.2099 3.40911 10.5818 2.3972 7.17139 4.14671C7.17139 4.14671 10.4755 0.68904 11.0687 0.405549C11.6613 0.122715 14.2062 0 14.2062 0Z"
        fill="#1F1F1F"
      />
    </Svg>
  );
}

export function ButtonSvgBg(btnsvgprops) {
  return (
    <Svg
      width={btnsvgprops.buttonWidth ? btnsvgprops.buttonWidth : 150}
      height={btnsvgprops.smallButton ? 40 : 50}
      fill="none">
      <G filter="url(#prefix__filter0_d)">
        <Rect
          x={0}
          y={0}
          width={btnsvgprops.buttonWidth ? btnsvgprops.buttonWidth : 150}
          height={btnsvgprops.smallButton ? 40 : 50}
          rx={5}
          fill={
            btnsvgprops.buttonInvert
              ? theme.secondaryColor
              : 'url(#prefix__paint0_linear)'
          }
        />
      </G>
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={90}
          y1={15.714}
          x2={89.35}
          y2={60.03}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor={theme.primaryColor} />
          <Stop offset={1} stopColor={theme.primaryColor} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export function ButtonShadowView(props) {
  return <View style={shadowViewStyle(props)} />;
}

function shadowViewStyle(shadowviewprops) {
  return {
    height: shadowviewprops.smallButton ? 0 : 0,
    borderRadius: shadowviewprops.smallButton ? 0 : 0,
    position: 'absolute',
    top: 0,
    left: 0,
    // width: shadowviewprops.buttonWidth ? shadowviewprops.buttonWidth + 5 : 150,
    backgroundColor: shadowviewprops.buttonInvert
      ? 'white'
      : theme.primaryColor,
    borderColor: shadowviewprops.buttonInvert ? '#d5d5d5' : 'transparent',
    borderWidth: shadowviewprops.buttonInvert ? 1 : 0,
  };
}

export function VerifiedSvg(props) {
  return (
    <Svg
      width="206"
      height="150"
      viewBox="0 0 206 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="101" cy="90" r="60" fill="#219653" />
      <Path
        d="M130.444 66.4445C125.409 65.1005 120.489 63.3542 115.733 61.2223C111.054 59.1925 106.537 56.8078 102.222 54.0889L101 53.3334L99.8 54.1112C95.4848 56.83 90.9679 59.2147 86.2889 61.2445C81.5251 63.3699 76.5981 65.1088 71.5556 66.4445L69.8889 66.8667V85.4C69.8889 115.156 99.9556 126.289 100.244 126.4L101 126.667L101.756 126.4C102.067 126.4 132.111 115.178 132.111 85.4V66.8667L130.444 66.4445ZM120.289 81.2223L95.4667 105.333L81.4222 91.2667C80.8329 90.6773 80.5018 89.878 80.5018 89.0445C80.5018 88.211 80.8329 87.4116 81.4222 86.8223C82.0116 86.2329 82.811 85.9018 83.6445 85.9018C84.478 85.9018 85.2773 86.2329 85.8667 86.8223L95.5334 96.6667L115.956 76.6667C116.247 76.3749 116.594 76.1434 116.975 75.9855C117.356 75.8275 117.765 75.7462 118.178 75.7462C118.591 75.7462 118.999 75.8275 119.38 75.9855C119.762 76.1434 120.108 76.3749 120.4 76.6667C120.692 76.9585 120.923 77.305 121.081 77.6863C121.239 78.0676 121.32 78.4762 121.32 78.8889C121.32 79.3016 121.239 79.7103 121.081 80.0916C120.923 80.4729 120.692 80.8193 120.4 81.1112L120.289 81.2223Z"
        fill="white"
      />
      <Circle cx="180" cy="65" r="5" fill="#98BF29" />
      <Circle cx="26" cy="60" r="5" fill="#8B2AEC" />
      <Circle cx="69.5" cy="12.5" r="2.5" fill="#8B2AEC" />
      <Circle cx="174" cy="36" r="5.5" stroke="#2085E2" />
      <Circle cx="101" cy="7" r="1.5" stroke="#002A51" />
      <Circle cx="13" cy="36" r="5.5" stroke="#E220CF" />
      <Path
        d="M45.7002 30.4365H42.2021V28.8721H45.7002V25.2861H47.2822V28.8721H50.7891V30.4365H47.2822V34.0049H45.7002V30.4365Z"
        fill="#097AFF"
      />
      <Path
        d="M199.7 50.4365H196.202V48.8721H199.7V45.2861H201.282V48.8721H204.789V50.4365H201.282V54.0049H199.7V50.4365Z"
        fill="#FFD809"
      />
      <Path d="M0.980469 66.6152V64.6621H6V66.6152H0.980469Z" fill="#02EE99" />
      <Path d="M143.98 16.6152V14.6621H149V16.6152H143.98Z" fill="#EE4902" />
    </Svg>
  );
}

export function ThumbsUp(props) {
  return (
    <Svg
      width="206"
      height="145"
      viewBox="0 0 206 145"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="101" cy="85" r="60" fill="#0BDA51" />
      <Path
        d="M85.8403 78.7506H77.092C76.4293 78.7475 75.7856 78.972 75.2685 79.3865C74.7514 79.8011 74.3923 80.3805 74.2512 81.0281C72.4644 88.9908 72.4058 97.2441 74.0794 105.231L74.2552 106.074C74.3935 106.728 74.7518 107.315 75.2704 107.737C75.7889 108.158 76.4364 108.39 77.1049 108.392H85.8409C86.6126 108.391 87.3524 108.084 87.898 107.538C88.4437 106.993 88.7506 106.253 88.7515 105.481V81.6612C88.7506 80.8895 88.4436 80.1496 87.8978 79.6039C87.352 79.0582 86.6121 78.7514 85.8403 78.7506ZM85.0009 104.642H77.7869L77.7507 104.468C76.2325 97.2233 76.2388 89.7423 77.7693 82.5006H85.0009V104.642Z"
        fill="white"
      />
      <Path
        d="M128.944 87.4942L126.356 80.5912C126.151 80.0516 125.788 79.5867 125.314 79.2581C124.84 78.9294 124.277 78.7525 123.7 78.7506H109.906V75.2895L111.028 72.8051C111.589 71.5618 111.899 70.2195 111.939 68.8558C111.978 67.4921 111.747 66.1341 111.259 64.8602C110.771 63.5863 110.035 62.4217 109.095 61.4338C108.154 60.4459 107.026 59.6542 105.778 59.1045C105.095 58.8072 104.323 58.7891 103.627 59.0542C102.931 59.3192 102.367 59.8463 102.055 60.5225L92.6436 81.1254V84.0625H95.4245L105.066 62.9549C106.427 63.7939 107.436 65.0999 107.904 66.6287C108.373 68.1574 108.268 69.8044 107.611 71.2617L106.323 74.1142L106.156 74.8858V80.6256L108.031 82.5006H123.066L125.375 88.6562V89.7428L117.407 103.746H102.766L92.6436 97.8076V102.155L101.082 107.105C101.517 107.361 102.013 107.495 102.517 107.496H117.939C118.44 107.495 118.932 107.362 119.365 107.11C119.798 106.859 120.156 106.497 120.404 106.062L128.754 91.3867C128.997 90.9591 129.125 90.4758 129.125 89.9841V88.4902C129.125 88.15 129.064 87.8126 128.944 87.4942Z"
        fill="white"
      />
      <Circle cx="180" cy="65" r="5" fill="#98BF29" />
      <Circle cx="26" cy="60" r="5" fill="#8B2AEC" />
      <Circle cx="69.5" cy="12.5" r="2.5" fill="#8B2AEC" />
      <Circle cx="174" cy="36" r="5.5" stroke="#2085E2" />
      <Circle cx="101" cy="7" r="1.5" stroke="#002A51" />
      <Circle cx="13" cy="36" r="5.5" stroke="#E220CF" />
      <Path
        d="M45.7002 30.4365H42.2021V28.8721H45.7002V25.2861H47.2822V28.8721H50.7891V30.4365H47.2822V34.0049H45.7002V30.4365Z"
        fill="#097AFF"
      />
      <Path
        d="M199.7 50.4365H196.202V48.8721H199.7V45.2861H201.282V48.8721H204.789V50.4365H201.282V54.0049H199.7V50.4365Z"
        fill="#FFD809"
      />
      <Path d="M0.980469 66.6152V64.6621H6V66.6152H0.980469Z" fill="#02EE99" />
      <Path d="M143.98 16.6152V14.6621H149V16.6152H143.98Z" fill="#EE4902" />
    </Svg>
  );
}
