const commander = require('commander');
const path = require('path');
const fs = require('fs');

const loadProfile = (name, projectDir, production = false) => {
  let profile = { NAME: name };

  const profilePath = path.resolve(projectDir, 'profile.js');
  if (fs.existsSync(profilePath)) {
    const profiles = require(profilePath);
    if (profiles[name]) {
      profile = Object.assign(profile, profiles[name]);
    } else {
      throw new Error(`profile[${name}] not found`);
    }
  } else {
    throw new Error(`${profilePath} not found`);
  }

  if (!production) {
    const localProfilePath = path.resolve(projectDir, 'profile.local.js');
    if (fs.existsSync(localProfilePath)) {
      const localProfiles = require(localProfilePath);
      if (localProfiles[name]) {
        profile = Object.assign(profile, localProfiles[name]);
      } else {
        console.warn(`[PROFILE] localProfile[${name}] not found`);
      }
    } else {
      console.warn(`[PROFILE] ${localProfilePath} not found`);
    }
  }

  return profile;
}

let loadedProfile = null;

module.exports = {
  setup: (
    projectDir = process.cwd(),
    production = process.env.NODE_ENV === 'production'
  ) => {
    let profileName = 'DEV';
    commander
      .allowUnknownOption(true)
      .option('--profile <profile>', 'profile')
      .parse(process.argv);
    if (commander.profile) {
      profileName = commander.profile;
    }
    loadedProfile = loadProfile(profileName, projectDir, production);

    if (loadedProfile['PUBLIC_URL'] !== undefined) {
      process.env.PUBLIC_URL = loadedProfile['PUBLIC_URL'];
    }
  },

  overrideWebpackConfig: ({ webpackConfig }) => {
    if (!loadedProfile) {
      throw new Error('loadedProfile is null');
    }

    const plugin = webpackConfig.plugins.find(p => p.constructor.name === 'DefinePlugin');
    if (!plugin) {
      throw new Error('no DefinePlugin found');
    }
    if (!plugin.definitions) {
      plugin.definitions = {};
    }
    if (!plugin.definitions['process.env']) {
      plugin.definitions['process.env'] = {};
    }
    plugin.definitions['process.env']['PROFILE'] = JSON.stringify(loadedProfile);
    return webpackConfig;
  }
}
