// Progress and Level System
const ProgressSystem = (function() {
  const CURRENT_USER_KEY = 'kaishoku_current_user';
  const USERS_KEY = 'kaishoku_users';
  
  // Experience points required for each level
  const LEVEL_THRESHOLDS = {
    0: 0,
    1: 100,
    2: 250,
    3: 500,
    4: 1000,
    5: 2000
  };

  // Pages that unlock at each level
  const LEVEL_UNLOCKS = {
    0: ['index.html', 'login.html', 'dashboard.html'],
    1: ['divisions.html', 'chat.html'],
    2: ['division-convergence.html', 'division-support.html', 'division-engineering.html', 'division-foreign.html', 'division-port.html'],
    3: ['phenomenon.html'],
    4: ['missions.html'],
    5: ['classified.html']
  };

  // Activities that give XP
  const XP_REWARDS = {
    'first_login': 50,
    'profile_view': 10,
    'chat_message': 5,
    'division_view': 20,
    'phenomenon_view': 30,
    'mission_complete': 100,
    'daily_login': 25
  };

  function getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function updateUserInStorage(updatedUser) {
    // Update in users list
    const users = getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      saveUsers(users);
    }
    
    // Update current user
    setCurrentUser(updatedUser);
  }

  function addExperience(activity) {
    const user = getCurrentUser();
    if (!user) return null;

    const xpGained = XP_REWARDS[activity] || 0;
    if (xpGained === 0) return user;

    // Initialize XP if not exists
    if (typeof user.xp === 'undefined') {
      user.xp = 0;
    }

    user.xp += xpGained;

    // Check for level up
    const oldLevel = user.level || 0;
    const newLevel = calculateLevel(user.xp);

    if (newLevel > oldLevel) {
      user.level = newLevel;
      updateUserInStorage(user);
      return {
        user: user,
        leveledUp: true,
        oldLevel: oldLevel,
        newLevel: newLevel,
        xpGained: xpGained
      };
    }

    updateUserInStorage(user);
    return {
      user: user,
      leveledUp: false,
      xpGained: xpGained
    };
  }

  function calculateLevel(xp) {
    let level = 0;
    for (let l = 5; l >= 0; l--) {
      if (xp >= LEVEL_THRESHOLDS[l]) {
        level = l;
        break;
      }
    }
    return level;
  }

  function getUnlockedPages(level) {
    const unlocked = [];
    for (let l = 0; l <= level; l++) {
      if (LEVEL_UNLOCKS[l]) {
        unlocked.push(...LEVEL_UNLOCKS[l]);
      }
    }
    return unlocked;
  }

  function isPageUnlocked(pageName, userLevel) {
    if (typeof userLevel === 'undefined') userLevel = 0;
    const unlockedPages = getUnlockedPages(userLevel);
    return unlockedPages.includes(pageName);
  }

  function getNextLevelInfo(user) {
    const currentLevel = user.level || 0;
    const currentXP = user.xp || 0;
    const nextLevel = currentLevel + 1;
    
    if (nextLevel > 5) {
      return {
        isMaxLevel: true,
        currentXP: currentXP,
        maxXP: LEVEL_THRESHOLDS[5]
      };
    }

    const nextLevelXP = LEVEL_THRESHOLDS[nextLevel];
    const currentLevelXP = LEVEL_THRESHOLDS[currentLevel];
    const xpNeeded = nextLevelXP - currentXP;
    const progress = ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    return {
      isMaxLevel: false,
      currentLevel: currentLevel,
      nextLevel: nextLevel,
      currentXP: currentXP,
      currentLevelXP: currentLevelXP,
      nextLevelXP: nextLevelXP,
      xpNeeded: xpNeeded,
      progress: Math.max(0, Math.min(100, progress))
    };
  }

  function showLevelUpNotification(oldLevel, newLevel) {
    const notification = document.createElement('div');
    notification.id = 'levelup-notification';
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 255, 255, 0.1));
      border: 2px solid var(--primary);
      padding: 2rem 3rem;
      z-index: 10000;
      text-align: center;
      animation: levelUpPulse 0.5s ease-in-out;
      backdrop-filter: blur(10px);
      box-shadow: 0 0 50px rgba(0, 255, 255, 0.5);
    `;

    notification.innerHTML = `
      <div style="font-family: 'Space Grotesk', sans-serif; font-size: 1rem; color: var(--primary); text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 0.5rem;">
        LEVEL UP
      </div>
      <div style="font-family: 'Space Grotesk', sans-serif; font-size: 3rem; font-weight: 700; color: white; margin-bottom: 1rem;">
        LEVEL ${newLevel}
      </div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; color: var(--muted-foreground);">
        新しいコンテンツがアンロックされました
      </div>
    `;

    // Add animation keyframes
    if (!document.getElementById('levelup-styles')) {
      const style = document.createElement('style');
      style.id = 'levelup-styles';
      style.textContent = `
        @keyframes levelUpPulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.05); }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.5s';
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }

  function showXPGainNotification(xp) {
    const notification = document.createElement('div');
    notification.className = 'xp-gain-notification';
    notification.style.cssText = `
      position: fixed;
      top: 6rem;
      right: 2rem;
      background-color: rgba(0, 255, 255, 0.1);
      border: 1px solid var(--primary);
      padding: 0.75rem 1.5rem;
      z-index: 9999;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
      color: var(--primary);
      animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-in 2.7s;
      pointer-events: none;
    `;

    notification.textContent = `+${xp} XP`;

    // Add animation keyframes
    if (!document.getElementById('xp-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'xp-notification-styles';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
  }

  function trackActivity(activity) {
    const result = addExperience(activity);
    
    if (!result) return;

    if (result.leveledUp) {
      showLevelUpNotification(result.oldLevel, result.newLevel);
    } else if (result.xpGained > 0) {
      showXPGainNotification(result.xpGained);
    }

    // Dispatch event for other components to listen to
    window.dispatchEvent(new CustomEvent('userProgressUpdated', { 
      detail: result 
    }));
  }

  function checkPageAccess(pageName) {
    const user = getCurrentUser();
    if (!user) {
      // Not logged in - allow access to public pages
      const publicPages = ['index.html', 'login.html'];
      return publicPages.includes(pageName);
    }

    return isPageUnlocked(pageName, user.level);
  }

  function getLockedPages(userLevel) {
    const allPages = [];
    Object.values(LEVEL_UNLOCKS).forEach(pages => {
      allPages.push(...pages);
    });
    
    const unlockedPages = getUnlockedPages(userLevel);
    return allPages.filter(page => !unlockedPages.includes(page));
  }

  // Public API
  return {
    addExperience,
    trackActivity,
    getNextLevelInfo,
    isPageUnlocked,
    checkPageAccess,
    getUnlockedPages,
    getLockedPages,
    LEVEL_UNLOCKS,
    XP_REWARDS
  };
})();

// Make it globally accessible
window.ProgressSystem = ProgressSystem;
