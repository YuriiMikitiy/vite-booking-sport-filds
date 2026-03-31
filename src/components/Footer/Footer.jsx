
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