import { ipcRenderer } from 'electron';
import path from 'path';

const getTeamIcon = function getTeamIcon(count = 0) {
  let countTeamIconCheck = count;
  let bgUrl = null;

  const teamMenu = document.querySelector('.p-ia__sidebar_header__button');
  if (teamMenu) {
    teamMenu.click();

    const icon = document.querySelector('.c-team_icon');
    if (icon) {
      bgUrl = window.getComputedStyle(icon, null).getPropertyValue('background-image');
      bgUrl = /^url\((['"]?)(.*)\1\)$/.exec(bgUrl);
      bgUrl = bgUrl ? bgUrl[2] : '';
    }

    setTimeout(() => {
      document.querySelector('.ReactModal__Overlay').click();
    }, 10);
  }

  countTeamIconCheck += 1;

  if (bgUrl) {
    ipcRenderer.sendToHost('avatar', bgUrl);
  } else if (countTeamIconCheck <= 5) {
    setTimeout(() => {
      getTeamIcon(countTeamIconCheck + 1);
    }, 2000);
  }
};

const checkForAppDownloadPrompt = () => {
  const element = document.querySelector('.p-download_modal__not_now, .c-fullscreen_modal.p-download_modal .p-download_modal__not_now');
  if (element) element.click();
};

const checkForRedirectScreen = () => {
  const element = document.querySelector('.p-ssb_redirect__body .c-link');
  console.log(element);

  if (element) {
    window.location = element.href;
  }
};

const SELECTOR_CHANNELS_UNREAD = '.p-channel_sidebar__channel--unread:not(.p-channel_sidebar__channel--muted)';

module.exports = (Franz) => {
  const getMessages = () => {
    const directMessages = document.querySelectorAll(`${SELECTOR_CHANNELS_UNREAD} .p-channel_sidebar__badge, .p-channel_sidebar__link--unread:not([data-sidebar-link-id="Punreads"]`).length;
    const allMessages = document.querySelectorAll(SELECTOR_CHANNELS_UNREAD).length - directMessages;

    // set Franz badge
    Franz.setBadge(directMessages, allMessages);
  };
  Franz.loop(getMessages);

  setTimeout(() => {
    getTeamIcon();

    checkForAppDownloadPrompt();
    checkForRedirectScreen();
  }, 4000);

  // inject franz.css stylesheet
  Franz.injectCSS(path.join(__dirname, 'service.css'));
};
