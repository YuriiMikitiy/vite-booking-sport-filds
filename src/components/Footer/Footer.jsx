// import Image1 from "./Image1";
// import IconGitHub from "./IconGitHub";
// import IconInstagram from "./IconInstagram";
// import IconLinkedin from "./IconLinkedin";
// import IconX from "./IconX";
// import IconYoutube from "./IconYoutube";

// export default function Footer() {
//   return (
//     <>
//     <div className="flex flex-col justify-end gap-8 bg-white pb-[38px] pl-[59px] pr-16 pt-[76px]">
//       <div className="flex flex-wrap items-start justify-center gap-x-32 gap-y-[90px] min-[1350px]:flex-nowrap">
//         <div className="flex flex-col items-center gap-[11px]">
//           <div className="flex flex-wrap items-end gap-x-[1px] gap-y-[13px] pr-[353px] min-[1350px]:flex-nowrap">
//             <Image1 className="h-8 w-11" />
//             <div className="border-solid border-x-black border-y-black leading-normal drop-shadow-[1px_1px_0_black] text-[20px] font-bold">
//               mikitchTask
//             </div>
//           </div>
//           <div className="self-stretch pl-1 pt-[13px] [max-width:506px]">
//             <div className="leading-normal">
//               Subscribe to our newsletter for the latest features and updates.
//             </div>
//           </div>
//           <div className="flex flex-col items-center justify-end pl-1 pt-3">
//             <div className="flex flex-wrap items-center justify-center gap-3.5 leading-normal min-[1350px]:flex-nowrap">
//               <input
//                 type="email"
//                 className="w-96 border border-solid border-black p-3 text-black placeholder-[dimgray]"
//                 placeholder="Your email here"
//               />
//               <button className="flex items-center justify-center border border-solid border-x-black border-y-black px-11 py-3">
//                 <div className="text-center">Join</div>
//               </button>
//             </div>
//           </div>
//           <div className="flex items-center self-stretch pl-[5px] [max-width:506px]">
//             <div className="flex-grow text-xs leading-normal">
//               By subscribing, you consent to our Privacy Policy and receive
//               updates.
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-wrap items-center justify-center gap-10 text-sm leading-normal min-[1350px]:flex-nowrap">
//           <div className="flex flex-col items-center justify-center pt-[3.7px]">
//             <div className="flex flex-col gap-4 overflow-clip pb-2">
//               <div className="font-semibold leading-normal">Useful Links</div>
//               <div className="pt-2 [max-width:175px]">
//                 <div>About Us</div>
//               </div>
//               <div>Contact Us</div>
//               <div>Support</div>
//               <div>Careers</div>
//               <div>Blog</div>
//             </div>
//           </div>
//           <div className="flex flex-col items-center justify-center pt-[3.7px]">
//             <div className="flex flex-col gap-4 overflow-clip pb-2">
//               <div className="font-semibold leading-normal">Resources</div>
//               <div className="pt-2 [max-width:175px]">
//                 <div>Help Center</div>
//               </div>
//               <div>API Docs</div>
//               <div>Community</div>
//               <div>Feedback</div>
//               <div>Events</div>
//             </div>
//           </div>
//           <div className="flex flex-col items-center justify-center pt-[3.7px]">
//             <div className="flex flex-col items-start gap-4">
//               <div className="self-stretch font-semibold leading-normal">
//                 Connect With Us
//               </div>
//               <div className="flex flex-col items-start justify-end gap-4 pt-2">
//                 <a
//                   href="https://github.com/mikitiiiura"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center justify-center gap-3 hover:text-gray-600"
//                 >
//                   <IconGitHub className="h-6 w-6" />
//                   <span>GitHub</span>
//                 </a>
//                 <a
//                   href="https://www.instagram.com/mikitiiiura/"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center justify-center gap-3 hover:text-pink-500"
//                 >
//                   <IconInstagram className="h-6 w-6" />
//                   <span>Instagram</span>
//                 </a>
//               </div>
//               <a
//                 href="https://x.com/qnYhmlAndRWOJJu"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-3 hover:text-blue-500"
//               >
//                 <IconX className="h-6 w-6" />
//                 <span>X</span>
//               </a>
//               <div className="flex flex-col items-start gap-4">
//                 <a
//                   href="https://www.linkedin.com/in/yurii-mykytii-a6682b270/"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center justify-center gap-3 hover:text-blue-700"
//                 >
//                   <IconLinkedin className="h-6 w-6" />
//                   <span>LinkedIn</span>
//                 </a>
//                 <a
//                   href="https://www.youtube.com/@ЮраМикитій-н6ь"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center justify-center gap-3 hover:text-red-600"
//                 >
//                   <IconYoutube className="h-6 w-6" />
//                   <span>YouTube</span>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-col justify-end pl-[5px] pr-6 pt-16">
//         <div className="h-px border border-solid border-x-black border-y-black bg-black" />
//       </div>
//       <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-[11px] pl-[5px] pr-6 text-sm leading-normal min-[1350px]:flex-nowrap">
//         <div>© 2024 Relume. All rights reserved.</div>
//         <div className="flex items-center justify-center gap-6 underline">
//           <div>Privacy Policy</div>
//           <div>Terms of Service</div>
//           <div>Cookie Settings</div>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// }
import React from "react";
import { Bookmark } from "lucide-react"; // Using lucide-react for icons
import "./Footer.css";
import IconGithub from "./IconGitHub"
import IconInstagram from "./IconInstagram"
import IconTwitter from "./IconX"
import IconLinkedin from "./IconLinkedin"
import IconYoutube from "./IconYoutube"



export default function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="brand-logo">
            <Bookmark className="logo-icon" />
            <div className="brand-title">mikitchTask</div>
          </div>
          <div className="newsletter-text">
            <div>Subscribe to our newsletter for the latest features and updates.</div>
          </div>
          <div className="newsletter-form">
            <div className="form-group">
              <input
                type="email"
                className="email-input"
                placeholder="Your email here"
              />
              <button className="join-button">
                <div className="button-text">Join</div>
              </button>
            </div>
          </div>
          <div className="newsletter-consent">
            <div className="consent-text">
              By subscribing, you consent to our Privacy Policy and receive updates.
            </div>
          </div>
        </div>
        <div className="footer-links">
          <div className="links-column">
            <div className="links-group">
              <div className="links-title">Useful Links</div>
              <div className="link-item">
                <div>About Us</div>
              </div>
              <div>Contact Us</div>
              <div>Support</div>
              <div>Careers</div>
              <div>Blog</div>
            </div>
          </div>
          <div className="links-column">
            <div className="links-group">
              <div className="links-title">Resources</div>
              <div className="link-item">
                <div>Help Center</div>
              </div>
              <div>API Docs</div>
              <div>Community</div>
              <div>Feedback</div>
              <div>Events</div>
            </div>
          </div>
          <div className="links-column">
            <div className="links-group">
              <div className="links-title">Connect With Us</div>
              <div className="social-links">
                <a
                  href="https://github.com/mikitiiiura"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <IconGithub className="social-icon" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://www.instagram.com/mikitiiiura/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link instagram"
                >
                  <IconInstagram className="social-icon" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://x.com/qnYhmlAndRWOJJu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link twitter"
                >
                  <IconTwitter className="social-icon" />
                  <span>X</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/yurii-mykytii-a6682b270/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link linkedin"
                >
                  <IconLinkedin className="social-icon" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://www.youtube.com/@ЮраМикитій-н6ь"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link youtube"
                >
                  <IconYoutube className="social-icon" />
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-divider">
        <div className="divider-line"></div>
      </div>
      <div className="footer-bottom">
        <div>© 2025 Relume. All rights reserved.</div>
        <div className="bottom-links">
          <div>Privacy Policy</div>
          <div>Terms of Service</div>
          <div>Cookie Settings</div>
        </div>
      </div>
    </div>
  );
}