import svgPaths from "./svg-2cah46nsdz";
import imgEllipse137 from "./f60182a3e4b1315b2cc46f96e8a683ca5c022850.png";

function UserAvatar() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <div className="relative shrink-0 size-[70px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="70" src={imgEllipse137} width="70" />
      </div>
    </div>
  );
}

function UserInfoText() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col items-start justify-center relative shrink-0 text-[12px] whitespace-nowrap">
      <p className="font-['Poppins:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#1f2937]">Your name</p>
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280]" style={{ fontVariationSettings: '"wdth" 100' }}>
        yourname@gmail.com
      </p>
    </div>
  );
}

function UserProfileHeader() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <UserAvatar />
      <UserInfoText />
    </div>
  );
}

function MenuHeaderSection() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0">
      <UserProfileHeader />
      <div className="h-0 relative shrink-0 w-[278px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 278 1" width="278">
            <line id="Line 261" stroke="#E5E7EB" x2="278" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function MyProfileMenuItem() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="user-01">
        <div className="absolute inset-[12.5%_16.67%]" data-name="Icon">
          <div className="absolute inset-[-4.17%_-4.69%]">
            <svg className="block size-full" fill="none" height="19.5" preserveAspectRatio="none" viewBox="0 0 17.5001 19.5" width="17.5001">
              <path d={svgPaths.p388eb480} id="Icon" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">My Profile</p>
    </div>
  );
}

function MyProfileRow() {
  return (
    <div className="content-stretch flex gap-[141px] items-start relative shrink-0">
      <MyProfileMenuItem />
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="chevron-right">
        <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Icon">
          <div className="absolute inset-[-6.25%_-12.5%]">
            <svg className="block size-full" fill="none" height="13.5" preserveAspectRatio="none" viewBox="0 0 7.5 13.5" width="7.5">
              <path d={svgPaths.p17f7b800} id="Icon" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function MyProfileButton() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start justify-center p-[10px] relative shrink-0 w-[278px]">
      <MyProfileRow />
    </div>
  );
}

function SettingsMenuItem() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="settings-01">
        <div className="absolute inset-[8.33%]" data-name="Icon">
          <div className="absolute inset-[-3.75%]">
            <svg className="block size-full" fill="none" height="21.5" preserveAspectRatio="none" viewBox="0 0 21.5 21.5" width="21.5">
              <g id="Icon">
                <path d={svgPaths.p2a4b8300} stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgPaths.p29f0f100} stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1f2937] text-[14px] whitespace-nowrap">Settings</p>
    </div>
  );
}

function SettingsRow() {
  return (
    <div className="content-stretch flex gap-[151px] items-start relative shrink-0">
      <SettingsMenuItem />
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="chevron-right">
        <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Icon">
          <div className="absolute inset-[-6.25%_-12.5%]">
            <svg className="block size-full" fill="none" height="13.5" preserveAspectRatio="none" viewBox="0 0 7.5 13.5" width="7.5">
              <path d={svgPaths.p17f7b800} id="Icon" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsButton() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center p-[10px] relative shrink-0 w-[278px]">
      <SettingsRow />
    </div>
  );
}

function NotificationMenuItem() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[24px]" data-name="bell-01">
        <div className="absolute inset-0 overflow-clip" data-name="bell-01">
          <div className="absolute inset-[8.33%_13.59%]" data-name="Icon">
            <div className="absolute inset-[-3.75%_-4.29%]">
              <svg className="block size-full" fill="none" height="21.5" preserveAspectRatio="none" viewBox="0 0 18.978 21.5" width="18.978">
                <path d={svgPaths.p1073e4f2} id="Icon" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1f2937] text-[14px] whitespace-nowrap">Notification</p>
    </div>
  );
}

function NotificationStatus() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#4b5563] text-[12px] whitespace-nowrap">Allow</p>
    </div>
  );
}

function NotificationButton() {
  return (
    <div className="content-stretch flex gap-[120px] items-center p-[10px] relative shrink-0 w-[278px]">
      <NotificationMenuItem />
      <NotificationStatus />
    </div>
  );
}

function LogoutMenuItem() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="log-out-04">
        <div className="absolute inset-[12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-4.17%_-3.75%]">
            <svg className="block size-full" fill="none" height="19.5" preserveAspectRatio="none" viewBox="0 0 21.5 19.5" width="21.5">
              <path d={svgPaths.p1fd39e00} id="Icon" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1f2937] text-[14px] whitespace-nowrap">Log Out</p>
    </div>
  );
}

function LogoutButton() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center p-[10px] relative shrink-0 w-[278px]">
      <LogoutMenuItem />
    </div>
  );
}

function MenuList() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[278px]">
      <MyProfileButton />
      <SettingsButton />
      <NotificationButton />
      <LogoutButton />
    </div>
  );
}

export default function UserMenu() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative size-full">
      <MenuHeaderSection />
      <MenuList />
    </div>
  );
}