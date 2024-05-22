import Link from "next/link";

const Header = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 1440 134"
    >
      <image
        xlinkHref="upload_bg.png"
        width="100%"
        height="250px"
        preserveAspectRatio="none"
      />
      <image xlinkHref="full_image.png" x="100" y="25" width="200" height="80" />
      <path
        opacity="0.6"
        d="M0 0H1440V134H0V0Z"
        fill="#00172B"
        fillOpacity="0.6"
      />
      {/* <text className="font-bold" fill="white" x="300" y="70" fontSize="24">
        INDEPENDENT ACCOUNTANT 401K AUDIT DOCUMENT REQUEST
      </text> */}
      <Link href="https://www.bdgcpa.com/" target="_blank">
        {/* <text className="font-bold" fill="white" x="1150" y="70" fontSize="14">
          Contact&nbsp;&nbsp;|
        </text> */}
      </Link>
      <Link href="https://www.bdgcpa.com/" target="_blank">
        {/* <text className="font-bold" fill="white" x="1230" y="70" fontSize="14">
          About Us
        </text> */}
      </Link>
    </svg>
  );
};

export default Header;
