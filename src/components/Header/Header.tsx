import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '@/services/api';
import type { UserInfo } from '@/types';
import './Header.less';

export interface HeaderUserInfo {
  phone?: string;
  wechatQRCode?: string;
  avatar?: string;
}

interface HeaderProps {
  logo?: string;
  onLogoClick?: () => void;
  /** 不传时在客户端拉取公开资料（详情页等） */
  userInfo?: HeaderUserInfo;
}

function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }
  return phone.trim();
}

const PhoneHandsetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
  >
    <path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ onLogoClick, userInfo: userInfoProp }) => {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);
  const [fetchedUser, setFetchedUser] = useState<HeaderUserInfo | null>(null);

  useEffect(() => {
    if (userInfoProp !== undefined) return;
    let cancelled = false;
    userApi
      .getUserInfo()
      .then((res) => {
        if (cancelled || !res.data) return;
        const d = res.data as UserInfo;
        setFetchedUser({
          phone: d.phone,
          wechatQRCode: d.wechatQRCode,
          avatar: d.avatar,
        });
      })
      .catch(() => {
        if (!cancelled) setFetchedUser({});
      });
    return () => {
      cancelled = true;
    };
  }, [userInfoProp]);

  const userInfo = userInfoProp ?? fetchedUser ?? undefined;
  const phoneRaw = userInfo?.phone?.trim() ?? '';
  const wechatRaw = userInfo?.wechatQRCode?.trim() ?? '';
  const hasContactPopover = Boolean(phoneRaw || wechatRaw);

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
      return;
    }
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const avatarSrc =
    userInfo?.avatar ||
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Yeatfish';

  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-logo" onClick={handleLogoClick}>
        <div className="logo-avatar">
          <img src={avatarSrc} alt="Logo" />
        </div>
      </div>

      <div
        className="header-menu-anchor"
        onMouseEnter={() => hasContactPopover && setShowContact(true)}
        onMouseLeave={() => setShowContact(false)}
      >
        <motion.div
          className="header-menu"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          role="button"
          tabIndex={0}
          aria-label="联系方式"
          aria-expanded={showContact}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (hasContactPopover) setShowContact((v) => !v);
            }
          }}
        >
          <div className="menu-icon">
            <PhoneHandsetIcon />
          </div>
        </motion.div>

        <AnimatePresence>
          {showContact && hasContactPopover && (
            <motion.div
              key="contact-popover"
              className="contact-popover"
              role="dialog"
              aria-label="电话与微信"
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {phoneRaw ? (
                <div className="contact-popover__panel contact-popover__panel--phone">
                  <div className="contact-popover__phone-icon" aria-hidden>
                    <img src="/icons/PhoneFilled.png" alt="电话" />
                  </div>
                  <span className="contact-popover__phone-text">{formatPhoneDisplay(phoneRaw)}</span>
                </div>
              ) : null}
              {wechatRaw ? (
                <div className="contact-popover__panel contact-popover__panel--qr">
                  <div className="contact-popover__qr-frame">
                    <img src={wechatRaw} alt="微信二维码" />
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
