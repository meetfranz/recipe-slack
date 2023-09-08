import path from 'path';

const getHasRailBar = () => document.querySelector('.p-tab_rail');

const getTeamIcon = (setServiceIcon, count = 0) => {
  let countTeamIconCheck = count;
  let bgUrl = null;

  const hasRailBar = getHasRailBar();

  const teamMenu = document.querySelector('.p-ia__sidebar_header__team_name');
  if (teamMenu || hasRailBar) {
    if (!hasRailBar) {
      teamMenu.click();
    }

    const icon = document.querySelector('.c-team_icon');

    if (icon) {
      bgUrl = window.getComputedStyle(icon, null).getPropertyValue('background-image');
      bgUrl = /^url\((['"]?)(.*)\1\)$/.exec(bgUrl);
      bgUrl = bgUrl ? bgUrl[2] : '';
    }

    if (!hasRailBar) {
      setTimeout(() => {
        const modalOverlay = document.querySelector('.ReactModal__Overlay');
        if (modalOverlay) {
          modalOverlay.click();
        }
      }, 10);
    }
  }

  countTeamIconCheck += 1;

  if (bgUrl) {
    setServiceIcon(bgUrl);
  } else if (countTeamIconCheck <= 5) {
    setTimeout(() => {
      getTeamIcon(setServiceIcon, countTeamIconCheck + 1);
    }, 2000);
  }
};

const checkForAppDownloadPrompt = () => {
  const element = document.querySelector('.p-download_modal__not_now, .c-fullscreen_modal.p-download_modal .p-download_modal__not_now');
  if (element) element.click();
};

const checkForRedirectScreen = () => {
  const element = document.querySelector('.p-ssb_redirect__body .c-link');

  if (element) {
    window.location = element.href;
  }
};

module.exports = (Franz) => {
  const getMessages = () => {
    const hasRailBar = getHasRailBar();

    let directMessages = 0;

    if (hasRailBar) {
      directMessages = document.querySelectorAll('.p-tab_rail .c-mention_badge').length;
    } else {
      directMessages = document.querySelectorAll('.p-channel_sidebar__channel--unread:not(.p-channel_sidebar__channel--muted) .p-channel_sidebar__badge').length;
    }

    const allMessages = document.querySelectorAll('.p-channel_sidebar__channel--unread:not(.p-channel_sidebar__channel--muted):not(.p-channel_sidebar__channel--suggested):not(.p-channel_sidebar__channel--selected) .p-channel_sidebar__name, .p-unread_dot').length - directMessages;

    // set Franz badge
    Franz.setBadge(directMessages, allMessages);
  };
  Franz.loop(getMessages);

  setTimeout(() => {
    getTeamIcon(Franz.setServiceIcon);

    checkForAppDownloadPrompt();
    checkForRedirectScreen();
  }, 4000);

  // inject franz.css stylesheet
  Franz.injectCSS(path.join(__dirname, 'service.css'));
};
